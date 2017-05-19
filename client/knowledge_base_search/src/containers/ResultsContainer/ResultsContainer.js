import React, { Component } from 'react';
import ResultBox from './ResultBox';
import RelatedQuestions from './RelatedQuestions';
import FullResult from './FullResult';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class ResultsContainer extends Component {
  componentWillMount() {
    this.state = {
      full_result: null
    };
  }

  showFullAnswer = (result) => {
    this.setState(
      {
        full_result: result
      }
    );
  }

  render() {
    const { results, enriched_results } = this.props;

    return (
      <section className='_full-width-row'>
        <div className='_container _container_x-large'>
          <h4>
            Compare the top Watson result to a standard Discovery search on Stack Exchange.
          </h4>
          <div className='results_container--div'>
            <div className='results_comparison--div'>
              <ResultBox
                result_type={'Discovery Enriched'}
                result={enriched_results.results[0]}
                onShowFullAnswer={
                  () => { this.showFullAnswer(enriched_results.results[0]) }
                }
              />
              <ResultBox
                result_type={'Discovery Standard'}
                result={results.results[0]}
                onShowFullAnswer={
                  () => { this.showFullAnswer(results.results[0]) }
                }
              />
            </div>
            <RelatedQuestions />
          </div>
          {
            this.state.full_result
              ? (<FullResult {...this.state.full_result} />)
              : null
          }
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
