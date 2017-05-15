import React, { Component } from 'react';
import { Header, Jumbotron, Footer, Icon } from 'watson-react-components';
import SearchContainer from './containers/SearchContainer/SearchContainer';
import ResultsContainer from './containers/ResultsContainer/ResultsContainer';
import links from './utils/links';
import query from './actions/query';
import 'watson-react-components/dist/css/watson-react-components.css';
import './App.css';

class App extends Component {
  componentWillMount() {
    this.state = {
      fetching: false,
      results_fetched: false,
      results: [],
      enriched_results: []
    }
  }

  handleSearch = (input) => {
    this.setState({fetching: true});
    Promise.all([
      query('regular', {query: input}),
      query('enriched', {query: input})
    ]).then((results_array) => {
      this.setState({
        fetching: false,
        results_fetched: true,
        results: results_array[0],
        enriched_results: results_array[1]
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Header
          mainBreadcrumbs="Starter Kits"
          mainBreadcrumbsUrl={links.starter_kits}
          subBreadcrumbs="Knowledge Base Search"
          subBreadcrumbsUrl="/"
        />
        <Jumbotron
          serviceName="Discovery - Knowledge Base Search"
          repository={links.repository}
          documentation={links.doc_homepage}
          apiReference={links.doc_api}
          startInBluemix={links.bluemix}
          version="GA"
          description="This starter kit uses Stack Exchange Travel data to show the effect of using answer metadata to improve ranking and search relevance. Compared to a default collection, you get better results by enriching the documents and applying them to search."
        />
        <SearchContainer onSubmit={this.handleSearch} />
        {
          this.state.fetching
            ? (<section className="_full-width-row">
                <Icon type="loader" size="large" />
               </section>
              )
            : this.state.results_fetched
              ? (<ResultsContainer
                  results={this.state.results}
                  enriched_results={this.state.enriched_results}
                  />)
              : null
        }
        <Footer />
      </div>
    );
  }
}

export default App;
