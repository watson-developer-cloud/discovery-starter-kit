import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { scroller, Element } from 'react-scroll';
import ResultComparison from './ResultComparison';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class ResultsContainer extends Component {
  componentWillMount() {
    this.state = {
      total_results_shown: 1,
      full_answer_index: -1,
      full_answer_type: null
    };
  }

  componentDidMount() {
    scroller.scrollTo('scroll_to_results', {
      smooth: true
    });
  }

  isMoreResults() {
    const { results, enriched_results } = this.props;
    const { total_results_shown } = this.state;

    return results.results.length > total_results_shown ||
      enriched_results.results.length > total_results_shown
      ? true
      : false;
  }

  handleMoreResults = () => {
    this.setState({total_results_shown: this.state.total_results_shown + 1});
  }

  setFullResult = (index, type) => {
    this.setState({
      full_result_index: index,
      full_result_type: type
    });
  }

  findPassageResult(passage) {
    const { enriched_results } = this.props;
    const targetId = parseInt(passage ? passage.document_id : 0, 10);

    return enriched_results.results.find((result) => {
      return result.id === targetId;
    });
  }

  render() {
    const { results, enriched_results } = this.props;

    return (
      <section className='_full-width-row'>
        <Element name='scroll_to_results'>
          {
            results.matching_results > 0 || enriched_results.matching_results > 0
              ? (
                  <div className='_container _container_large'>
                    <h4>
                      Compare the top Watson result to a standard Discovery search on Stack Exchange.
                    </h4>
                    <div className='results_container--div'>
                      <div className='results_left--div'>
                        <CSSTransitionGroup
                          transitionName='results_comparison'
                          transitionEnterTimeout={500}
                          transitionLeave={false}
                        >
                          {
                            [...Array(this.state.total_results_shown)].map((x, i) => {
                              return(
                                <ResultComparison
                                  key={'result_comparison_' + i}
                                  index={i}
                                  passage={enriched_results.passages[i]}
                                  passageFullResult={
                                    this.findPassageResult(
                                      enriched_results.passages[i]
                                    )
                                  }
                                  result={results.results[i]}
                                  full_result_index={this.state.full_result_index}
                                  full_result_type={this.state.full_result_type}
                                  onSetFullResult={this.setFullResult}
                                />
                              );
                            })
                          }
                        </CSSTransitionGroup>
                      </div>
                    </div>
                  </div>
                )
              : (
                  <div className='_container-center'>
                    <h2>No Results</h2>
                  </div>
                )
          }
          {
            this.isMoreResults()
              ? (
                  <div className='_container-center show_results--div'>
                    <button
                      className='base--button base--button_teal'
                      type='button'
                      onClick={this.handleMoreResults}
                    >
                      Show More Results
                    </button>
                  </div>
                )
              : null
          }
        </Element>
      </section>
    );
  }
}

ResultsContainer.PropTypes = {
  results: PropTypes.shape({
    matching_results: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  enriched_results: PropTypes.shape({
    matching_results: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(PropTypes.object),
    passages: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  onSearch: PropTypes.func.isRequired
}

export default ResultsContainer;
