import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Sticky from 'react-stickynode';
import { Header, Jumbotron, Footer, Icon } from 'watson-react-components';
import SearchContainer from './containers/SearchContainer/SearchContainer';
import FeatureSelect from './containers/SearchContainer/FeatureSelect';
import QuestionBarContainer from './containers/QuestionBarContainer/QuestionBarContainer';
import PassagesContainer from './containers/PassagesContainer/PassagesContainer';
import TrainingContainer from './containers/TrainingContainer/TrainingContainer';
import ErrorContainer from './containers/ErrorContainer/ErrorContainer';
import ViewAllContainer from './containers/ViewAllContainer/ViewAllContainer';
import links from './utils/links';
import query from './actions/query';
import questions from './actions/questions';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingQuestions: true,
      fetchingResults: false,
      resultsFetched: false,
      results: [],
      trainedResults: [],
      search_input: '',
      resultsError: null,
      questionsError: null,
      searchContainerHeight: 0,
      showViewAll: false,
      presetQueries: [],
      offset: 0,
      selectedFeature: FeatureSelect.featureTypes.PASSAGES.value
    }
  }

  componentDidMount() {
    this.retrieveQuestions(this.state.selectedFeature);
  }

  componentWillUpdate(nextProps, nextState) {
    const searchContainer = this.searchContainer;
    if (searchContainer) {
      nextState.searchContainerHeight = searchContainer
        .searchSection.getBoundingClientRect().height
    }
  }

  retrieveMissingDocuments(results) {
    const uniqueDocumentIds = results.passages.reduce(
      (uniqueVals, passage) => {
        if (uniqueVals.indexOf(passage.document_id) === -1) {
          uniqueVals.push(passage.document_id);
        }
        return uniqueVals;
      }, []);

    let missingDocumentIds = [];
    uniqueDocumentIds.forEach((document_id) => {
      let resultDocument = results.results.find((result) => {
        return result.id === document_id;
      });

      if (!resultDocument) {
        missingDocumentIds.push(document_id);
      }
    });

    return missingDocumentIds.length > 0
      ? query(FeatureSelect.featureTypes.PASSAGES.value, {filter: `id:(${missingDocumentIds.join('|')})`})
          .then((response) => {
            if (response.error) {
              this.setState({resultsError: response.error});
            }

            if (response.results) {
              let newResults = results.results.concat(response.results);
              results.results = newResults;
            }

            return results;
          })
      : Promise.resolve(results);
  }

  retrieveQuestions(selectedFeature) {
    this.setState({ fetchingQuestions: true });
    questions(selectedFeature).then((response) => {
      if (response.error) {
        this.setState({
          questionsError: response.error,
          fetchingQuestions: false
        });
      } else {
        this.setState({
          presetQueries: this.shuffleQuestions(response),
          fetchingQuestions: false
        });
      }
    });
  }

  shuffleQuestions(questions) {
    const allQuestions = questions.slice(0);
    let shuffledQueries = [];

    for (let i = 0; i < questions.length; i++) {
      let questionIndex = Math.floor(Math.random() * allQuestions.length);
      shuffledQueries.push(allQuestions.splice(questionIndex, 1)[0]);
    }

    return shuffledQueries;
  }

  handleSearch = (input) => {
    const selectedFeature = this.state.selectedFeature;
    this.setState({
      fetchingResults: true,
      search_input: input,
      resultsError: null,
      results: [],
      trainedResults: []
    });

    if (selectedFeature === FeatureSelect.featureTypes.PASSAGES.value) {
      this.handlePassageSearch(input);
    } else {
      this.handleTrainedSearch(input);
    }
  }

  handlePassageSearch = (input) => {
    query(FeatureSelect.featureTypes.PASSAGES.value, { natural_language_query: input })
      .then((response) => {
        if (response.passages) {
          return this.retrieveMissingDocuments(response)
            .then((response) => {
              return response;
            });
        } else {
          return Promise.resolve(response);
        }
      }).then((responseWithPassages) => {
        if (responseWithPassages.error) {
          this.setState({
            fetchingResults: false,
            resultsFetched: true,
            resultsError: responseWithPassages.error
          });
        } else {
          this.setState({
            fetchingResults: false,
            resultsFetched: true,
            results: responseWithPassages
          });
        }
      });
  }

  handleTrainedSearch = (input) => {
    Promise.all([
      query(FeatureSelect.featureTypes.TRAINED.value, { natural_language_query: input }),
      query('regular', { natural_language_query: input })
    ]).then((responses) => {
      const trainedResponse = responses[0];
      const regularResponse = responses[1];
      const resultsError = trainedResponse.error || regularResponse.error;

      if (resultsError) {
        this.setState({
          fetchingResults: false,
          resultsFetched: true,
          resultsError
        });
      } else {
        this.setState({
          fetchingResults: false,
          resultsFetched: true,
          results: regularResponse,
          trainedResults: trainedResponse
        });
      }
    });
  }

  handleQuestionClick = (query) => {
    const { presetQueries, offset } = this.state;
    const questionIndex = presetQueries.findIndex((presetQuery) => {
      return presetQuery.question === query;
    });
    const beginQuestions = offset;
    const endQuestions = offset + QuestionBarContainer.defaultProps.questionsShown - 1;
    let newPresetQueries = presetQueries.slice(0);
    let newOffset = offset;

    if (questionIndex < beginQuestions || questionIndex > endQuestions) {
      const moveQuestions = newPresetQueries.splice(questionIndex, 1);
      newPresetQueries.unshift(moveQuestions[0]);
      newOffset = 0;
    }

    this.setState({
      showViewAll: false,
      search_input: query,
      presetQueries: newPresetQueries,
      offset: newOffset
    })
    this.handleSearch(query);
  }

  handleFeatureSelect = (e) => {
    const selectedFeature = e.target.value;
    this.setState({
      results: [],
      trainedResults: [],
      resultsFetched: false,
      selectedFeature
    });
    this.retrieveQuestions(selectedFeature);
  }

  handleOffsetUpdate = (offset) => {
    this.setState({ offset: offset });
  }

  toggleViewAll = () => {
    this.setState({ showViewAll: !this.state.showViewAll });
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
            errorMessage={this.state.questionsError}
            isFetchingQuestions={this.state.fetchingQuestions}
            isFetchingResults={this.state.fetchingResults}
            offset={this.state.offset}
            onFeatureSelect={this.handleFeatureSelect}
            onOffsetUpdate={this.handleOffsetUpdate}
            onQuestionClick={this.handleQuestionClick}
            onSubmit={this.handleSearch}
            onViewAllClick={this.toggleViewAll}
            presetQueries={this.state.presetQueries}
            searchInput={this.state.search_input}
            selectedFeature={this.state.selectedFeature}
          />
        </Sticky>
        <CSSTransitionGroup
          transitionName='view_all_overlay'
          transitionEnterTimeout={230}
          transitionLeaveTimeout={230}
        >
          {
            this.state.showViewAll &&
            (
              <div
                className='view_all_overlay--div'
                onClick={this.toggleViewAll}
              />
            )
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionName='view_all'
          transitionEnterTimeout={230}
          transitionLeaveTimeout={230}
        >
          {
            this.state.showViewAll &&
            (
              <ViewAllContainer
                key='view_all'
                onQuestionClick={this.handleQuestionClick}
                onCloseClick={this.toggleViewAll}
                isFetchingResults={this.state.fetchingResults}
                presetQueries={this.state.presetQueries}
              />
            )
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionName='results'
          transitionEnterTimeout={500}
          transitionLeave={false}
        >
          { this.state.fetchingResults || this.state.resultsFetched
              ? (
                  <section key='results' className='_full-width-row results_row--section'>
                    {
                      this.state.fetchingResults
                        ? (
                            <div key='loader' className='_container _container_large _container-center'>
                              <Icon type='loader' size='large' />
                            </div>
                          )
                        : this.state.resultsFetched
                          ? this.state.resultsError
                            ? (
                                <ErrorContainer
                                  key='error_container'
                                  errorMessage={this.state.resultsError}
                                />
                              )
                            : this.state.selectedFeature === FeatureSelect.featureTypes.PASSAGES.value
                              ? (
                                  <PassagesContainer
                                    key="passages_container"
                                    results={this.state.results}
                                    searchContainerHeight={this.state.searchContainerHeight}
                                  />
                                )
                              : (
                                  <TrainingContainer
                                    key="training_container"
                                    regularResults={this.state.results}
                                    trainedResults={this.state.trainedResults}
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
