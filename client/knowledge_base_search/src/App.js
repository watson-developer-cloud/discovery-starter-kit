import React, { Component } from 'react';
import { Header, Jumbotron, Footer } from 'watson-react-components';
import KnowledgeBaseSearchContainer from './containers/KnowledgeBaseSearchContainer/KnowledgeBaseSearchContainer';
import links from './utils/links';
import 'watson-react-components/dist/css/watson-react-components.css';
import './App.css';

class App extends Component {
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
        <KnowledgeBaseSearchContainer />
        <Footer />
      </div>
    );
  }
}

export default App;
