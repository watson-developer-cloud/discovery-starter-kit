import React, { Component } from 'react';
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

  handleOnShowFullAnswer = () => {
    this.props.onShowFullAnswer();
  }

  render() {
    const { result, result_type } = this.props;
    const result_rank = 1;

    return (
      <div className='result_box--div'>
        <h4>
          {result_type}
        </h4>
        <div className='result_text--div'>
          <div className='result_answer_snippet--div'>
            {this.trimAnswer(result.answer)}
          </div>
          <div className='result_full_answer--div'>
            <button
              type='button'
              onClick={this.handleOnShowFullAnswer}
            >
              See full answer
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
      </div>
    );
  }
}

ResultBox.PropTypes = {
  result: React.PropTypes.object.isRequired,
  result_type: React.PropTypes.string.isRequired,
  max_length: React.PropTypes.number.isRequired,
  decimal_places: React.PropTypes.number.isRequired,
  onShowFullAnswer: React.PropTypes.func.isRequired
}

ResultBox.defaultProps = {
  max_length: 130,
  decimal_places: 2
}

export default ResultBox;
