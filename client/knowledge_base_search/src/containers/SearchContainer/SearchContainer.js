import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { Icon, TextInput } from 'watson-react-components';
import randomQueries from '../../utils/randomQueries';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class SearchContainer extends Component {
  componentWillMount() {
    this.state = {
      search_input: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search_input !== this.state.search_input) {
      this.setState({search_input: nextProps.search_input});
    }
  }

  handleOnClick = () => {
    const totalQueries = randomQueries.length;
    const randomInt = Math.floor(Math.random() * totalQueries);

    this.handleOnInput({'target': { 'value': randomQueries[randomInt]}});
    this.props.onSubmit(randomQueries[randomInt]);
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
        <div className="_container">
          <CSSTransitionGroup
            transitionName='search_header'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {!this.props.hasResults
              ? (
                <h2 className="header--input" key='header_input'>
                  Use a community's expertise to amplify the way you find information.
                </h2>
                )
              : null
            }
          </CSSTransitionGroup>
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
            <CSSTransitionGroup
              transitionName='search_button'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
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
            </CSSTransitionGroup>
          </form>
        </div>
      </section>
    );
  }
}

SearchContainer.PropTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  hasResults: React.PropTypes.bool.isRequired,
  search_input: React.PropTypes.string.isRequired
}

export default SearchContainer;
