import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import arrow_back from '../../images/arrow_back_24.svg';
import arrow_forward from '../../images/arrow_forward_24.svg';
import './styles.css';

class QuestionBarContainer extends Component {
  handlePaginateRight = (e) => {
    const {
      presetQueries,
      questionsShown,
      offset,
      onOffsetUpdate
    } = this.props;
    const paginateTo = Math.min(
                        offset + questionsShown,
                        presetQueries.length - 1
                      );

    onOffsetUpdate(paginateTo);
  }

  handlePaginateLeft = (e) => {
    const { questionsShown, offset, onOffsetUpdate } = this.props;
    const paginateTo = Math.max(offset - questionsShown, 0);

    onOffsetUpdate(paginateTo);
  }

  render() {
    const {
      presetQueries,
      currentQuery,
      questionsShown,
      isFetchingResults,
      onQuestionClick,
      offset
    } = this.props;

    return (
      <div className='question_bar_container--div'>
        { offset > 0 &&
          (
            <button
              type='button'
              className='question_bar_arrow--button left'
              onClick={this.handlePaginateLeft}
            >
              <Isvg src={arrow_back} className='arrow--span' />
            </button>
          )
        }
        {
          presetQueries.slice(offset, offset + questionsShown).map((query, i) => {
            return (
              <button
                key={`question_button_${i}`}
                className={'question_bar_button--button' +
                  ( query === currentQuery
                      ? ' active'
                      : ''
                  )
                }
                type='button'
                disabled={isFetchingResults}
                onClick={() => { onQuestionClick(query) }}>
                  {query}
              </button>
            )
          })
        }
        { presetQueries.length > offset + questionsShown &&
          (
            <button
              type='button'
              className='question_bar_arrow--button right'
              onClick={this.handlePaginateRight}
            >
              <Isvg src={arrow_forward} className='arrow--span' />
            </button>
          )
        }
      </div>
    );
  }
}

QuestionBarContainer.PropTypes = {
  presetQueries: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentQuery: PropTypes.string.isRequired,
  isFetchingResults: PropTypes.bool.isRequired,
  questionsShown: PropTypes.number.isRequired,
  onQuestionClick: PropTypes.func.isRequired,
  onOffsetUpdate: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired
}

QuestionBarContainer.defaultProps = {
  questionsShown: 4
}

export default QuestionBarContainer;
