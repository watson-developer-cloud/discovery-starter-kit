import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class ResultContainer extends Component {
  render() {
    const {
      result_text,
      result_rank
    } = this.props;

    return (
      <div className={'result_container--div' + (result_text ? '' : ' result_container_empty--div')}>
        { result_text
          ? (
              <div className='result_container_items--div'>
                <div className='result_container_text--div'>
                  { result_text }
                </div>
              </div>
            )
          : result_rank === 1
            ? (<div className='result_container--div'>No Results</div>)
            : null
        }
      </div>
    );
  }
}

ResultContainer.PropTypes = {
  result_text: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  result_rank: PropTypes.number.isRequired
}

export default ResultContainer;
