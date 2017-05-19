import React, { Component } from 'react';
import ResultBox from './ResultBox';
import FullResult from './FullResult';
import './styles.css';

class ResultComparison extends Component {
  componentWillMount() {
    this.state = {
      full_result: null
    }
  }

  toggleFullResult = (index, type) => {
    this.isFullResultShown(index, type)
      ? this.props.onSetFullResult(-1, null)
      : this.props.onSetFullResult(index, type);
  }

  isFullResultShown(index, type) {
    const { full_result_type, full_result_index } = this.props;

    return full_result_type === type && full_result_index === index;
  }

  getFullAnswer() {
    const { full_result_type, result, enriched_result } = this.props;

    return full_result_type === 'enriched' ? enriched_result : result;
  }

  render() {
    const {
      result,
      enriched_result,
      index,
      full_result_index
    } = this.props;

    return (
      <div>
        <div className='results_comparison--div'>
          <ResultBox
            result_type={'Discovery Enriched'}
            result_rank={index + 1}
            result={enriched_result}
            is_full_result_shown={
              this.isFullResultShown(index, 'enriched')
            }
            onToggleFullResult={
              () => { this.toggleFullResult(index, 'enriched') }
            }
          />
          <ResultBox
            result_type={'Discovery Standard'}
            result_rank={index + 1}
            result={result}
            is_full_result_shown={
              this.isFullResultShown(index, 'regular')
            }
            onToggleFullResult={
              () => { this.toggleFullResult(index, 'regular') }
            }
          />
        </div>
        {
          full_result_index === index
            ? (<FullResult {...this.getFullAnswer()} />)
            : null
        }
      </div>
    );
  }
}

ResultComparison.PropTypes = {
  result: React.PropTypes.object.isRequired,
  enriched_result: React.PropTypes.object.isRequired,
  index: React.PropTypes.number.isRequired,
  onSetFullResult: React.PropTypes.func.isRequired,
  full_result_index: React.PropTypes.number.isRequired,
  full_result_type: React.PropTypes.string.isRequired
}

export default ResultComparison;
