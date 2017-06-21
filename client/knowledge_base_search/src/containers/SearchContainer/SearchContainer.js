import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, TextInput, Tabs, Pane } from 'watson-react-components';
import randomQueries from '../../utils/randomQueries';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class SearchContainer extends Component {
  componentWillMount() {
    this.state = {
      search_input: '',
      random_queries: this.getFiveRandomQueries(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search_input !== this.state.search_input) {
      this.setState({search_input: nextProps.search_input});
    }
  }

  getFiveRandomQueries() {
    const allQueries = randomQueries.slice(0);
    let myQueries = [];
    for(let i = 0; i < 5; i++) {
      let myIndex = Math.floor(Math.random() * allQueries.length);
      myQueries.push(allQueries.splice(myIndex, 1)[0]);
    }
    return myQueries;
  }

  handleQuestionClick(query, index) {
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
      <section className="_full-width-row search_container--section">
        <div className="_container _container_large">
          <form onSubmit={this.handleOnSubmit}>
            <Tabs selected={0}>
              <Pane label="Preset questions">
              <div className='clickable-tabs'>
                {
                  this.state.random_queries.map((query, index) => {
                    return (
                      <span key={'questionButton-'+index}>
                        <button className={query === this.state.search_input
                          ? 'active_button clickable-tab'
                          : 'clickable-tab'}
                          type='button'
                          disabled={this.props.isFetching}
                          onClick={() => {
                            this.handleQuestionClick(query, index);
                          }}>
                            {query}
                        </button>
                      </span>
                    )
                  })
                }
              </div>
              </Pane>
              <Pane label='Custom question'>
                <span className="positioned--icon">
                  <Icon type="search" />
                </span>
                <TextInput
                  id="search_input"
                  placeholder="Enter words, phrase, or a question about travel"
                  value={this.state.search_input}
                  onInput={this.handleOnInput}
                  style={{width: '100%'}}
                  disabled={this.props.isFetching}
                />
                <button
                  className="white--button"
                  disabled={this.props.isFetching}
                >
                  Retrieve Answers
                </button>
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
  hasResults: PropTypes.bool.isRequired,
  search_input: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default SearchContainer;
