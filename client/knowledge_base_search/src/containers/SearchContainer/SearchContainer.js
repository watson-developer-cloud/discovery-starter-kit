import React, { Component } from 'react';
import { Icon, TextInput } from 'watson-react-components';
import randomQueries from '../../utils/randomQueries';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class SearchContainer extends Component {
  componentWillMount() {
    this.state = {
      search_input: ''
    }
  }

  handleOnClick = () => {
    const totalQueries = randomQueries.length;
    const randomInt = Math.floor(Math.random() * totalQueries);

    this.handleOnInput({'target': { 'value': randomQueries[randomInt]}});
    this.props.onSubmit(this.state.search_input);
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
      <section className="_full-width-row teal">
        <div className="_container">
          {!this.props.hasResults
            ? (
              <h2 className="header--input">
                Use a community's expertise to amplify the way you find information.
              </h2>
              )
            : null
          }
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
            {!this.props.hasResults
              ? (
                <div className="_container-center">
                  <button className="white--button">
                    Retrieve Answers
                  </button>
                </div>
                )
              : null
            }
          </form>
        </div>
      </section>
    );
  }
}

SearchContainer.PropTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  hasResults: React.PropTypes.bool.isRequired
}

export default SearchContainer;
