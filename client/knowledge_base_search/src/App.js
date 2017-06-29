import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Sticky from 'react-stickynode';
import { Header, Jumbotron, Footer, Icon } from 'watson-react-components';
import SearchContainer from './containers/SearchContainer/SearchContainer';
import ResultsContainer from './containers/ResultsContainer/ResultsContainer';
import ErrorContainer from './containers/ErrorContainer/ErrorContainer';
import links from './utils/links';
import query from './actions/query';
import 'watson-react-components/dist/css/watson-react-components.css';
import './App.css';

class App extends Component {
  componentWillMount() {
    this.state = {
      fetching: false,
      results_fetched: false,
      results: [],
      enriched_results: [],
      search_input: '',
      results_error: null,
      searchContainerHeight: 0
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const searchContainer = this.searchContainer;
    if (searchContainer) {
      nextState.searchContainerHeight = searchContainer
        .searchSection.getBoundingClientRect().height
    }
  }

  handleSearch = (input) => {
    this.setState({
      fetching: true,
      search_input: input,
      results_error: null
    });

    Promise.all([
      query('enriched', {natural_language_query: input})
        .then((enriched_response) => {
          if (enriched_response.passages) {
            return this.retrieveMissingPassages(enriched_response)
              .then((response) => {
                return response;
              });
          } else {
            return Promise.resolve(enriched_response);
          }
        }),
      query('regular', {natural_language_query: input})
    ]).then((results_array) => {
      const enriched_results_response = results_array[0];
      const results_response = results_array[1];

      if (results_response.error || enriched_results_response.error) {
        this.setState({
          fetching: false,
          results_fetched: true,
          results_error: results_response.error || enriched_results_response.error
        });
      } else {
        this.setState({
          fetching: false,
          results_fetched: true,
          results: results_response,
          enriched_results: enriched_results_response
        });
      }
    });
  }

  retrieveMissingPassages(enriched_results) {
    const uniqueDocumentIds = enriched_results.passages.reduce(
      (uniqueVals, passage) => {
        if (uniqueVals.indexOf(passage.document_id) === -1) {
          uniqueVals.push(passage.document_id);
        }
        return uniqueVals;
      }, []);

    let missingDocumentIds = [];
    uniqueDocumentIds.forEach((document_id) => {
      const targetId = parseInt(document_id, 10);

      let enriched_result = enriched_results.results.find((result) => {
        return result.id === targetId;
      });

      if (!enriched_result) {
        missingDocumentIds.push(targetId);
      }
    });

    return missingDocumentIds.length > 0
      ? query('enriched', {filter: `id:(${missingDocumentIds.join('|')})`})
          .then((response) => {
            if (response.error) {
              console.error(response.error);
              this.setState({results_error: response.error});
            }

            if (response.results) {
              let newResults = enriched_results.results.concat(response.results);
              enriched_results.results = newResults;
            }

            return enriched_results;
          })
      : Promise.resolve(enriched_results);
  }

  render() {
    return (
      <div className='App'>
        <Header
          mainBreadcrumbs='Starter Kits'
          mainBreadcrumbsUrl={links.starter_kits}
          subBreadcrumbs='Knowledge Base Search'
          subBreadcrumbsUrl='/'
        />
        <Jumbotron
          serviceName='Discovery - Knowledge Base Search'
          repository={links.repository}
          documentation={links.doc_homepage}
          apiReference={links.doc_api}
          startInBluemix={links.bluemix}
          version='GA'
          description='This starter kit demonstrates how Watson Discovery&#39;s Passage Search quickly finds the most relevant information in your documents to answer your natural language questions. Try out the preset questions or enter a custom question and compare the answers returned by a Standard (non-Passage) Search vs. a Passage Search on the Stack Exchange Travel data set.'
        />
        <Sticky>
          <SearchContainer
            ref={(container) => { this.searchContainer = container }}
            onSubmit={this.handleSearch}
            hasResults={this.state.results_fetched}
            search_input={this.state.search_input}
            isFetching={this.state.fetching}
          />
        </Sticky>
        <CSSTransitionGroup
          transitionName='results'
          transitionEnterTimeout={500}
          transitionLeave={false}
        >
          { this.state.fetching || this.state.results_fetched
              ? (
                  <section key='results' className='_full-width-row results_row--section'>
                    {
                      this.state.fetching
                        ? (
                            <div key='loader' className='_container _container_large _container-center'>
                              <Icon type='loader' size='large' />
                            </div>
                          )
                        : this.state.results_fetched
                          ? this.state.results_error
                            ? (
                                <ErrorContainer
                                  key='error_container'
                                  errorMessage={this.state.results_error}
                                />
                              )
                            : (
                                <ResultsContainer
                                  key='results_container'
                                  results={this.state.results}
                                  enriched_results={this.state.enriched_results}
                                  onSearch={this.handleSearch}
                                  searchContainerHeight={this.state.searchContainerHeight}
                                />
                              )
                          : null
                    }
                  </section>
                )
              : null
          }
        </CSSTransitionGroup>
        <section className='_full-width-row license--section'>
          <a
            href={links.stack_exchange}
            className={'base--a'}
          >
            Stack Exchange
          </a>
          <span> user contributions are licensed under </span>
          <a
            href={links.cc_license}
            className={'base--a'}
          >
            cc by-sa 3.0 with attribution required
          </a>
        </section>
        <Footer />
      </div>
    );
  }
}

export default App;
