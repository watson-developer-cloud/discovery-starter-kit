import React, { Component } from 'react';
import ResultBox from './ResultBox';
import RelatedQuestions from './RelatedQuestions';
import './styles.css';

class ResultsContainer extends Component {
  render() {
    return (
      <section className='_full-width-row'>
        <div className='_container _container_large'>
          <h4>
            Compare the top Watson result to a standard Discovery search on Stack Exchange.
          </h4>
          <div className='results_container--div'>
            <div className='results_comparison--div'>
              <ResultBox
                result_type={'Discovery Enriched'}
                result={this.props.enriched_results.results[0]}
              />
              <ResultBox
                result_type={'Discovery Standard'}
                result={this.props.results.results[0]}
              />
            </div>
            <RelatedQuestions />
          </div>
        </div>
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
