import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
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
      enriched_results_error: null
    }
  }

  handleSearch = (input) => {
    this.setState({
      fetching: true,
      search_input: input,
      results_error: null,
      enriched_results_error: null
    });

    Promise.all([
      query('regular', {query: input}),
      query('enriched', {query: input})
    ]).then((results_array) => {
      const results_response = results_array[0];
      const enriched_results_response = results_array[1];

      if (results_response.error || enriched_results_response.error) {
        this.setState({
          fetching: false,
          results_fetched: true,
          results_error: results_response.error,
          enriched_results_error:  enriched_results_response.error
        });
      } else {
        this.setState({
          fetching: false,
          results_fetched: true,
          results: results_array[0],
          enriched_results: results_array[1]
        });
      }
    }).catch((error) => {
      this.setState({
        fetching: false,
        results_fetched: true,
        results_error: error
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Header
          mainBreadcrumbs="Starter Kits"
          mainBreadcrumbsUrl={links.starter_kits}
          subBreadcrumbs="Knowledge Base Search"
          subBreadcrumbsUrl="/"
        />
        <Jumbotron
          serviceName="Discovery - Knowledge Base Search"
          repository={links.repository}
          documentation={links.doc_homepage}
          apiReference={links.doc_api}
          startInBluemix={links.bluemix}
          version="GA"
          description="This starter kit uses Stack Exchange Travel data to show the effect of using answer metadata to improve ranking and search relevance. Compared to a default collection, you get better results by enriching the documents and applying them to search."
        />
        <SearchContainer
          onSubmit={this.handleSearch}
          hasResults={this.state.results_fetched}
          search_input={this.state.search_input}
          isFetching={this.state.fetching}
        />
        <CSSTransitionGroup
          transitionName='results'
          transitionEnterTimeout={500}
          transitionLeave={false}
        >
          {
            this.state.fetching
              ? (<section key={'loader'} className='_full-width-row'>
                  <div className='_container _container_large _container-center'>
                    <Icon type='loader' size='large' />
                  </div>
                 </section>
                )
              : this.state.results_fetched
                ? this.state.results_error || this.state.enriched_results_error
                  ? (<ErrorContainer
                      key={'error_container'}
                      results_error={this.state.results_error}
                      enriched_results_error={this.state.enriched_results_error}
                      />
                    )
                  : (<ResultsContainer
                      key={'results_container'}
                      results={this.state.results}
                      enriched_results={this.state.enriched_results}
                      onSearch={this.handleSearch}
                      />)
                : null
          }
        </CSSTransitionGroup>
        <section className='_full-width-row license--section'>
          <a
            href={links.stack_exhange}
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
