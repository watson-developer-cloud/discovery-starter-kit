import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class ResultBox extends Component {
  render() {
    const {
      result_text,
      result_rank
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
                    { result_text }
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
  result_text: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  result_rank: PropTypes.number.isRequired
}

export default ResultBox;
