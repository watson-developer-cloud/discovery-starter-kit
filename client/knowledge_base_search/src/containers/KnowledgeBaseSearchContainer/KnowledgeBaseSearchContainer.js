import React, { Component } from 'react';
import { Icon, TextInput } from 'watson-react-components';
import randomQueries from '../../utils/randomQueries';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class KnowledgeBaseSearchContainer extends Component {
  componentWillMount() {
    this.state = {
      search_input: ''
    }
  }

  handleOnClick = () => {
    const totalQueries = randomQueries.length;
    const randomInt = Math.floor(Math.random() * totalQueries);
    this.handleOnInput({'target': { 'value': randomQueries[randomInt]}});
  }

  handleOnInput = (e) => {
    this.setState({search_input: e.target.value});
  }

  handleOnSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <section className="_full-width-row teal">
        <div className="_container">
          <h2 className="header--input">
            Use a community's expertise to amplify the way you find information.
          </h2>
          <form onSubmit={this.handleOnSubmit}>
            <div className="positioned--icon">
              <Icon type="search" />
            </div>
            <TextInput
              id="search_input"
              placeholder="Enter words, phrase, or a question about travel"
              value={this.state.search_input}
              onInput={this.handleOnInput}
              style={{width: '100%'}}
            />
            <div className="_container-right">
              <button
                type="button"
                className="random-query--button"
                onClick={this.handleOnClick}
              >
                Random Query
              </button>
            </div>
            <div className="_container-center">
              <button className="white--button">
                Retrieve Answers
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default KnowledgeBaseSearchContainer;
