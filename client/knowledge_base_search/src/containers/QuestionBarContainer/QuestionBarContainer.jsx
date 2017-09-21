import React, { Component } from 'react';
import { string, number, bool, func, arrayOf, shape } from 'prop-types';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';
import arrowBack from '../../images/arrow_back_24.svg';
import arrowForward from '../../images/arrow_forward_24.svg';
import md5 from '../../utils/md5';
import './styles.css';

class QuestionBarContainer extends Component {
  handlePaginateRight = () => {
    const {
      presetQueries,
      questionsShown,
      offset,
      onOffsetUpdate,
    } = this.props;
    const paginateTo = Math.min(
      offset + questionsShown,
      presetQueries.length - 1,
    );

    onOffsetUpdate(paginateTo);
  }

  handlePaginateLeft = () => {
    const { questionsShown, offset, onOffsetUpdate } = this.props;
    const paginateTo = Math.max(offset - questionsShown, 0);

    onOffsetUpdate(paginateTo);
  }

  isCurrentQuestion(question) {
    return question === this.props.currentQuery;
  }

  render() {
    const {
      presetQueries,
      questionsShown,
      isFetchingResults,
      onQuestionClick,
      offset,
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
              <Isvg src={arrowBack} className="arrow--span" />
            </button>
          )
        }
        {
          presetQueries.slice(offset, offset + questionsShown).map(query => (
            <button
              key={md5(query.question)}
              className={
                classNames('question_bar--button', {
                  'question_bar--button--active': this.isCurrentQuestion(query.question),
                })
              }
              type="button"
              disabled={isFetchingResults || this.isCurrentQuestion(query.question)}
              onClick={() => { onQuestionClick(query.question); }}
            >
              { query.question }
              { query.is_training_query && (
                <span title="training question" className="question_bar--train" />
              )
              }
            </button>
          ))
        }
        { presetQueries.length > offset + questionsShown &&
          (
            <button
              type="button"
              className="question_bar--arrow_button--right"
              onClick={this.handlePaginateRight}
            >
              <Isvg src={arrowForward} className="arrow--span" />
            </button>
          )
        }
      </div>
    );
  }
}

QuestionBarContainer.propTypes = {
  presetQueries: arrayOf(shape({
    question: string.isRequired,
    is_training_query: bool,
  })).isRequired,
  currentQuery: string.isRequired,
  isFetchingResults: bool.isRequired,
  questionsShown: number.isRequired,
  onQuestionClick: func.isRequired,
  onOffsetUpdate: func.isRequired,
  offset: number.isRequired,
};

QuestionBarContainer.defaultProps = {
  questionsShown: 4,
};

export default QuestionBarContainer;
