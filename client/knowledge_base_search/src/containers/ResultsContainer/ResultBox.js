import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class ResultBox extends Component {
  trimAnswer(answer) {
    const { max_length } = this.props;

    if (answer.length > max_length) {
      return answer.substring(0, max_length) + '…';
    }
    return answer;
  }

  roundScore(score) {
    const { decimal_places } = this.props;

    return Number(
      Math.round(score + 'e' + decimal_places) + 'e-' + decimal_places
    );
  }

  handleToggleFullAnswer = () => {
    this.props.onToggleFullResult();
  }

  render() {
    const {
      result,
      result_type,
      result_rank,
      is_full_result_shown
    } = this.props;

    return (
      <div className='result_box--div'>
        { result_rank === 1 ? (<h4>{result_type}</h4>) : null }
        {
          result
            ? <div className='result_text--div'>
                <div className='result_answer_snippet--div'>
                  {this.trimAnswer(result.answer)}
                </div>
                <div className='result_full_answer--div'>
                  <button
                    type='button'
                    onClick={this.handleToggleFullAnswer}
                  >
                    {
                      is_full_result_shown
                        ? (<span>Hide full answer</span>)
                        : (<span>Show full answer</span>)
                    }
                  </button>
                </div>
                <hr className='base--hr' />
                <div className='result_rank--div'>
                  <div className='result_rank_left--div'>
                    <span>Rank</span>
                    <span className='circle'>{result_rank}</span>
                  </div>
                  <div className='result_rank_right--div'>
                    <span>Relevance Score </span>
                    <span>{this.roundScore(result.score)}</span>
                  </div>
                </div>
              </div>
            : result_rank === 1
              ? <div className='result_text--div'>No Results</div>
              : null
        }
      </div>
    );
  }
}

ResultBox.PropTypes = {
  result: PropTypes.object.isRequired,
  result_type: PropTypes.string.isRequired,
  result_rank: PropTypes.number.isRequired,
  is_full_result_shown: PropTypes.bool.isRequired,
  max_length: PropTypes.number.isRequired,
  decimal_places: PropTypes.number.isRequired,
  onToggleFullResult: PropTypes.func.isRequired
}

ResultBox.defaultProps = {
  max_length: 130,
  decimal_places: 2
}

export default ResultBox;
