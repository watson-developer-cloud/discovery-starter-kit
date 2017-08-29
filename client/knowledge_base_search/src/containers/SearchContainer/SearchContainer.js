import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, TextInput, Tabs, Pane } from 'watson-react-components';
import ErrorContainer from '../ErrorContainer/ErrorContainer';
import QuestionBarContainer from '../QuestionBarContainer/QuestionBarContainer';
import './styles.css';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchInput !== this.state.searchInput) {
      this.setState({ searchInput: nextProps.searchInput });
    }
  }

  handleOnInput = (e) => {
    this.setState({ searchInput: e.target.value });
  }

  handleOnSubmit = (e) => {
    const input = this.state.searchInput;

    e.preventDefault();
    if (input && input.length > 0) {
      this.props.onSubmit(input);
    }
  }

  getViewAllButtonText() {
    const { presetQueries } = this.props;
    const numQuestions = presetQueries.length;
    const numZeroes = numQuestions.toString().length;
    const scale = Math.pow(10, numZeroes - 1);
    const numPresetQueries = Math.floor(numQuestions / scale) * scale;

    return `View all ${numPresetQueries.toLocaleString()}+ questions`;
  }

  render() {
    const {
      errorMessage,
      isFetchingQuestions,
      isFetchingResults,
      presetQueries,
      offset,
      onOffsetUpdate,
      onQuestionClick,
      onViewAllClick
    } = this.props;

    return (
      <section
        className='_full-width-row search_container--section'
        ref={(section) => { this.searchSection = section }}
      >
        <div className='_container _container_large'>
          <form onSubmit={this.handleOnSubmit}>
            <Tabs selected={0}>
              <Pane label='Preset questions'>
                {
                  isFetchingQuestions
                    ? (
                        <div key='loader' className='_container _container_large _container-center'>
                          <Icon type='loader' size='large' />
                        </div>
                      )
                    : errorMessage
                      ? (
                          <ErrorContainer errorMessage={errorMessage} />
                        )
                      : (
                          <div>
                            <QuestionBarContainer
                              currentQuery={this.state.searchInput}
                              offset={offset}
                              onOffsetUpdate={onOffsetUpdate}
                              onQuestionClick={onQuestionClick}
                              presetQueries={presetQueries}
                              isFetchingResults={isFetchingResults}
                            />
                            <div className='view_all_button--div'>
                              <button
                                type='button'
                                className='view_all--button'
                                disabled={isFetchingResults}
                                onClick={onViewAllClick}
                              >
                                {this.getViewAllButtonText()}
                              </button>
                            </div>
                          </div>
                        )
                }
              </Pane>
              <Pane label='Custom question'>
                <div className='custom_question--div'>
                  <span className='positioned--icon'>
                    <Icon type='search' />
                  </span>
                  <TextInput
                    id='searchInput'
                    placeholder='Enter words, phrase, or a question about travel'
                    value={this.state.searchInput}
                    onInput={this.handleOnInput}
                    style={{width: 'calc(100% - 3rem)'}}
                    disabled={isFetchingResults}
                  />
                  <button
                    className='white--button'
                    disabled={isFetchingResults}
                  >
                    Find answers
                  </button>
                </div>
              </Pane>
            </Tabs>
          </form>
        </div>
      </section>
    );
  }
}

SearchContainer.PropTypes = {
  errorMessage: PropTypes.string,
  isFetchingQuestions: PropTypes.bool.isRequired,
  isFetchingResults: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
  onOffsetUpdate: PropTypes.func.isRequired,
  onQuestionClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onViewAllClick: PropTypes.func.isRequired,
  presetQueries: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchInput: PropTypes.string.isRequired
}

export default SearchContainer;
