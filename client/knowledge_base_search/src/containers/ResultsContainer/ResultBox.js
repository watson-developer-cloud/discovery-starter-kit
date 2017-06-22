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

    return (
      <div className={'result_box--div' + (result_text ? '' : ' result_box_empty--div')}>
        { result_text
          ? (
              <div className='result_box_items--div'>
                <div className='result_box_item_left--div'>
                  {result_rank}
                </div>
                <div className='result_box_item_right--div'>
                  <div className='result_box_text--div'>
                    { is_full_result_shown
                        ? result_text
                        : this.trimAnswer(result_text)
                    }
                  </div>
                  <div className='result_box_toggle--div'>
                    <button
                      type='button'
                      onClick={this.handleToggleFullAnswer}
                    >
                      {
                        is_full_result_shown
                          ? (<span>Collapse answer</span>)
                          : (<span>Show full answer</span>)
                      }
                    </button>
                  </div>
                </div>
              </div>
            )
          : result_rank === 1
            ? (<div className='result_text--div'>No Results</div>)
            : null
        }
      </div>
    );
  }
}

ResultBox.PropTypes = {
  result_type: PropTypes.string.isRequired,
  result_text: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  result_rank: PropTypes.number.isRequired,
  is_full_result_shown: PropTypes.bool.isRequired,
  max_length: PropTypes.number.isRequired,
  onToggleFullResult: PropTypes.func.isRequired
}

ResultBox.defaultProps = {
  max_length: 200
}

export default ResultBox;
