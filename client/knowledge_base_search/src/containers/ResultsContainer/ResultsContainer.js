import React, { Component } from 'react';
import RelatedQuestions from './RelatedQuestions';
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

  render() {
    const { results, enriched_results } = this.props;

    return (
      <section className='_full-width-row'>
        {
          results.matching_results > 0 || enriched_results.matching_results > 0
            ? (
                <div className='_container _container_large'>
                  <h4>
                    Compare the top Watson result to a standard Discovery search on Stack Exchange.
                  </h4>
                  <div className='results_container--div'>
                    <div className='results_left--div'>
                      {
                        [...Array(this.state.total_results_shown).keys()].map((i) => {
                          return(
                            <ResultComparison
                              key={i}
                              index={i}
                              enriched_result={enriched_results.results[i]}
                              result={results.results[i]}
                              full_result_index={this.state.full_result_index}
                              full_result_type={this.state.full_result_type}
                              onSetFullResult={this.setFullResult}
                            />
                          );
                        })
                      }
                    </div>
                    <RelatedQuestions />
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
                    className='teal--button'
                    type='button'
                    onClick={this.handleMoreResults}
                  >
                    Show More Results
                  </button>
                </div>
              )
            : null
        }
      </section>
    );
  }
}

ResultsContainer.PropTypes = {
  results: React.PropTypes.shape({
    matching_results: React.PropTypes.number.isRequired,
    results: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired,
  enriched_results: React.PropTypes.shape({
    matching_results: React.PropTypes.number.isRequired,
    results: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired
}

export default ResultsContainer;
