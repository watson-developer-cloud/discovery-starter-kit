import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class ResultBox extends Component {
  trimAnswer(answer) {
    const { max_length, result_type } = this.props;

    if (answer.length > max_length && result_type === 'regular') {
      return answer.substring(0, max_length) + '…';
    }
    return answer;
  }

  handleToggleFullAnswer = () => {
    this.props.onToggleFullResult();
  }

  render() {
    const {
      result_text,
      result_rank,
      is_full_result_shown
    } = this.props;

    if (result_text) {
      return (
        <div className='result_box--div'>
          <div className='result_box_header--div'>
            <div className='result_box_title--div'>
              <div className='circle'>{result_rank}</div>
            </div>
            <div className='result_box_toggle--div'>
              <button
                type='button'
                onClick={this.handleToggleFullAnswer}
              >
                {
                  is_full_result_shown
                    ? (<span>Collapse Article</span>)
                    : (<span>Show Full Article</span>)
                }
              </button>
            </div>
          </div>
          <hr className='base--hr' />
          <div className='result_text--div'>
            { is_full_result_shown
                ? result_text
                : this.trimAnswer(result_text)
            }
          </div>
        </div>
      );
    } else if (result_rank === 1) {
      return (
        <div className='result_box--div'>
          <div className='result_text--div'>No Results</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

ResultBox.PropTypes = {
  result_type: PropTypes.string.isRequired,
  result_text: PropTypes.string.isRequired,
  result_rank: PropTypes.number.isRequired,
  is_full_result_shown: PropTypes.bool.isRequired,
  max_length: PropTypes.number.isRequired,
  onToggleFullResult: PropTypes.func.isRequired
}

ResultBox.defaultProps = {
  max_length: 200
}

export default ResultBox;
