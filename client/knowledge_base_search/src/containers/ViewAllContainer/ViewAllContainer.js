import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { Icon, TextInput } from 'watson-react-components';
import './styles.css';

class ViewAllContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionFilter: '',
      shownQuestions: props.presetQueries.slice(0, props.questionsPerPage)
    }
  }

  loadMore = () => {
    const currentLength = this.state.shownQuestions.length;
    const { presetQueries, questionsPerPage } = this.props;
    const { questionFilter } = this.state;

    if (questionFilter.length > 0) {
      const filteredQuestions = this.getFilteredQuestions(questionFilter);

      if (currentLength < filteredQuestions.length) {
        this.setState({
          shownQuestions: filteredQuestions.slice(0, currentLength + questionsPerPage)
        });
      }
    } else if (this.hasMore()) {
      this.setState({
        shownQuestions: presetQueries.slice(0, currentLength + questionsPerPage)
      });
    }
  }

  hasMore = () => {
    return this.state.shownQuestions.length < this.props.presetQueries.length;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getFilteredQuestions(questionFilter) {
    const { presetQueries } = this.props;
    const filterRexExp = new RegExp(this.escapeRegExp(questionFilter), 'i');

    return presetQueries.filter((question) => {
      return filterRexExp.test(question);
    });
  }

  handleOnInput = (e) => {
    const filter = e.target.value;
    const { questionsPerPage } = this.props;

    this.setState({
      questionFilter: filter,
      shownQuestions: this.getFilteredQuestions(filter).slice(0, questionsPerPage)
    });
  }

  render() {
    const {
      isFetchingResults,
      onQuestionClick,
      onCloseClick
    } = this.props;

    return (
      <div
        className='view_all_container--div'
        role='dialog'
        aria-labelledby='view_all_title'
        aria-describedby='view_all_description'
      >
        <div className='view_all_questions_header--div'>
          <h3 id='view_all_title'>Available questions</h3>
          <button
            type='button'
            className='close_view_all--button'
            disabled={isFetchingResults}
            onClick={onCloseClick}
          >
            <Icon type='close' />
          </button>
        </div>
        <h5 id='view_all_description' className='view_all_questions_description--h5'>
          These are a list of available questions we have prepared
          for you. Click one below to see how Watson delivers
          meaningful results with Passage Search.
        </h5>
        <div className='view_all_questions_filter--div'>
          <span className='view_all_questions_filter--icon'>
            <Icon type='search' size='small' />
          </span>
          <TextInput
            id='questionFilterInput'
            placeholder='Filter available questions'
            value={this.state.questionFilter}
            onInput={this.handleOnInput}
            style={{width: 'calc(100% - 1.5rem)'}}
            disabled={isFetchingResults}
          />
        </div>
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
              this.state.shownQuestions.length > 0
                ? this.state.shownQuestions.map((query, i) => {
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
                : <span className='view_all_questions_no_results--span'>
                    No questions found that match your filter,
                    try broadening your query
                  </span>
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
