import React, { Component } from 'react';
import { Icon, TextInput } from 'watson-react-components';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class KnowledgeBaseSearchContainer extends Component {
  render() {
    return (
      <section className="_full-width-row teal">
        <div className="_container">
          <h2 className="header--input">
            Use a community's expertise to amplify the way you find information.
          </h2>
          <div className="positioned--icon">
            <Icon type="search" />
          </div>
          <TextInput
            id="search_input"
            placeholder="Enter words, phrase, or a question about travel"
          />
          <div className="_container-right">
            <button className="random-query--button">
              Random Query
            </button>
          </div>
          <div className="_container-center">
            <button className="white--button">
              Retrieve Answers
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default KnowledgeBaseSearchContainer;
