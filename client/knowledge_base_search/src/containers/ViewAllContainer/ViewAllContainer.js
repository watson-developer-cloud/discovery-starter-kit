import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class ViewAllContainer extends Component {
  render() {
    const {
      isFetchingResults,
      onQuestionClick,
      onCloseClick,
      presetQueries
    } = this.props;

    return (
      <div className='view_all_container--div'>
        <div className='view_all_questions_header--div'>
          <h4>Available Questions</h4>
          <button
            type='button'
            className='close_view_all--button'
            disabled={isFetchingResults}
            onClick={onCloseClick}
          >
            X Close
          </button>
        </div>
        <h5>
          These are a list of available questions we have prepared
          for you. Click one below to see how Watson delivers
          meaningful results with Passage Search.
        </h5>
        <div className='_container _container-center view_all_questions_list--div'>
          {
            presetQueries.map((query, i) => {
              return (
                <button
                  key={'query_button_' + i}
                  className='view_all_question--button'
                  disabled={isFetchingResults}
                  type='button'
                  onClick={() => { onQuestionClick(query) }}
                >
                  {query}
                </button>
              )
            })
          }
        </div>
      </div>
    );
  }
}

ViewAllContainer.PropTypes = {
  onQuestionClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  isFetchingResults: PropTypes.bool.isRequired,
  presetQueries: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default ViewAllContainer;
