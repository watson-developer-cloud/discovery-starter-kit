import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import './styles.css';

class ViewAllContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownQuestions: props.presetQueries.slice(0, props.questionsPerPage)
    }
  }

  loadMore = () => {
    if (this.hasMore()) {
      const currentLength = this.state.shownQuestions.length;
      const { presetQueries, questionsPerPage } = this.props;

      this.setState({
        shownQuestions: presetQueries.slice(0, currentLength + questionsPerPage)
      });
    }
  }

  hasMore = () => {
    return this.state.shownQuestions.length < this.props.presetQueries.length;
  }

  render() {
    const {
      isFetchingResults,
      onQuestionClick,
      onCloseClick
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
        <div
          className='_container _container-center view_all_questions_list--div'
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.hasMore()}
            useWindow={false}
          >
            {
              this.state.shownQuestions.map((query, i) => {
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
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

ViewAllContainer.PropTypes = {
  onQuestionClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  isFetchingResults: PropTypes.bool.isRequired,
  presetQueries: PropTypes.arrayOf(PropTypes.string).isRequired,
  questionsPerPage: PropTypes.number.isRequired
}

ViewAllContainer.defaultProps = {
  questionsPerPage: 50
}

export default ViewAllContainer;
