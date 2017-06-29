import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, TextInput, Tabs, Pane } from 'watson-react-components';
import QuestionBarContainer from '../QuestionBarContainer/QuestionBarContainer';
import ErrorContainer from '../ErrorContainer/ErrorContainer';
import questions from '../../actions/questions';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_input: '',
      presetQueries: [],
      questionsError: null,
      fetchingQuestions: false
    };
  }

  componentDidMount() {
    this.setState({ fetchingQuestions: true, questionsError: null });
    questions().then((response) => {
      this.setState({ fetchingQuestions: false });
      if (response.error) {
        this.setState({ questionsError: response.error });
      } else {
        this.setState({ presetQueries: this.shuffleQuestions(response) });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search_input !== this.state.search_input) {
      this.setState({ search_input: nextProps.search_input });
    }
  }

  shuffleQuestions(questions) {
    const questionsCopy = questions.slice(0);
    let shuffledQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      let questionIndex = Math.floor(Math.random() * questionsCopy.length);
      shuffledQuestions.push(questionsCopy.splice(questionIndex, 1)[0]);
    }

    return shuffledQuestions;
  }

  handleOnQuestionClick = (query) => {
    this.handleOnInput({'target': { 'value': query}});
    this.props.onSubmit(query);
  }

  handleOnInput = (e) => {
    this.setState({search_input: e.target.value});
  }

  handleOnSubmit = (e) => {
    const input = this.state.search_input;

    e.preventDefault();
    if (input && input.length > 0) {
      this.props.onSubmit(input);
    }
  }

  render() {
    return (
      <section className='_full-width-row search_container--section'>
        <div className='_container _container_large'>
          <form onSubmit={this.handleOnSubmit}>
            <Tabs selected={0}>
              <Pane label='Preset questions'>
                { this.state.fetchingQuestions
                  ? (
                      <div key='loader' className='_container _container_large _container-center'>
                        <Icon type='loader' size='large' />
                      </div>
                    )
                  : this.state.questionsError
                    ? (
                        <ErrorContainer
                          errorMessage={this.state.questionsError}
                        />
                      )
                    : (
                        <QuestionBarContainer
                          currentQuery={this.state.search_input}
                          onQuestionClick={this.handleOnQuestionClick}
                          presetQueries={this.state.presetQueries}
                          isFetching={this.props.isFetching}
                        />
                      )
                }
              </Pane>
              <Pane label='Custom question'>
                <div className='custom_question--div'>
                  <span className='positioned--icon'>
                    <Icon type='search' />
                  </span>
                  <TextInput
                    id='search_input'
                    placeholder='Enter words, phrase, or a question about travel'
                    value={this.state.search_input}
                    onInput={this.handleOnInput}
                    style={{width: 'calc(100% - 3rem)'}}
                    disabled={this.props.isFetching}
                  />
                  <button
                    className='white--button'
                    disabled={this.props.isFetching}
                  >
                    Find Answers
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
  onSubmit: PropTypes.func.isRequired,
  search_input: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default SearchContainer;
