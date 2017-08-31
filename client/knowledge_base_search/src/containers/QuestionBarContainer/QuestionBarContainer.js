import React, { Component } from 'react';
import { string, number, bool, func, arrayOf, shape } from 'prop-types';
import classNames from 'classnames';
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
      <div className="question_bar--container">
        { offset > 0 &&
          (
            <button
              type="button"
              className="question_bar--arrow_button--left"
              onClick={this.handlePaginateLeft}
            >
              <Isvg src={arrow_back} className="arrow--span" />
            </button>
          )
        }
        {
          presetQueries.slice(offset, offset + questionsShown).map((query, i) => {
            return (
              <button
                key={`question_button_${i}`}
                className={
                  classNames('question_bar--button', {
                    'question_bar--button--active': query.question === currentQuery
                  })
                }
                type="button"
                disabled={isFetchingResults}
                onClick={() => { onQuestionClick(query.question) }}>
                  { query.question }
                  { query.is_training_query && (
                      <span title="training question" className="question_bar--train" />
                    )
                  }
              </button>
            )
          })
        }
        { presetQueries.length > offset + questionsShown &&
          (
            <button
              type="button"
              className="question_bar--arrow_button--right"
              onClick={this.handlePaginateRight}
            >
              <Isvg src={arrow_forward} className="arrow--span" />
            </button>
          )
        }
      </div>
    );
  }
}

QuestionBarContainer.PropTypes = {
  presetQueries: arrayOf(shape({
    question: string.isRequired,
    is_training_query: bool
  })).isRequired,
  currentQuery: string.isRequired,
  isFetchingResults: bool.isRequired,
  questionsShown: number.isRequired,
  onQuestionClick: func.isRequired,
  onOffsetUpdate: func.isRequired,
  offset: number.isRequired
}

QuestionBarContainer.defaultProps = {
  questionsShown: 4
}

export default QuestionBarContainer;
