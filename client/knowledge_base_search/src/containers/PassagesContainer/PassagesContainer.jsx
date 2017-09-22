import React, { Component } from 'react';
import { string, number, arrayOf, shape } from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { scroller, Element } from 'react-scroll';
import PassageComparison from './PassageComparison';
import NoResults from '../../views/NoResults/NoResults';
import ShowMoreResults from '../../views/ShowMoreResults/ShowMoreResults';
import './styles.css';

class PassagesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_results_shown: 3,
    };
  }

  componentDidMount() {
    scroller.scrollTo('scroll_to_results', {
      smooth: true,
      offset: -this.props.searchContainerHeight,
    });
  }

  getNextDocumentWithPassages(documentIndicesShown, documentIdsWithPassages) {
    const { results } = this.props;

    return results.results.find((result, index) => {
      const documentId = result.id;

      if (documentIdsWithPassages.indexOf(documentId) >= 0 &&
          documentIndicesShown.indexOf(index) < 0) {
        documentIndicesShown.push(index);
        return true;
      }
      return false;
    });
  }

  getPassagesFromDocument(documentId, passageIndicesShown) {
    const { results } = this.props;

    return results.passages.reduce((passages, passage, index) => {
      if (passage.document_id === documentId) {
        const passageWithIndex = Object.assign({}, passage, { index });
        passages.push(passageWithIndex);
        passageIndicesShown.push(index);
      }
      return passages;
    }, []);
  }

  handleMoreResults = () => {
    this.setState({ total_results_shown: this.state.total_results_shown + 1 });
  }

  isMoreResults(passageIndicesShown) {
    const { results } = this.props;

    return results.passages.length > passageIndicesShown.length;
  }

  render() {
    const { results } = this.props;
    const documentIdsWithPassages = results.passages.map(passage => passage.document_id);
    const passageIndicesShown = [];
    const documentIdsShown = [];

    return (
      <Element name="scroll_to_results">
        {
          results.matching_results > 0
            ? (
              <div className="_container _container_large">
                <h3>
                    Compare the Standard search to the Passage search on Stack Exchange Travel data.
                </h3>
                <div className="passages_container--div">
                  <CSSTransitionGroup
                    transitionName="passages_comparison"
                    transitionEnterTimeout={500}
                    transitionLeave={false}
                  >
                    {
                      [...Array(this.state.total_results_shown)].map((x, index) => {
                        const fullResult = this.getNextDocumentWithPassages(
                          documentIdsShown,
                          documentIdsWithPassages,
                        );
                        if (fullResult) {
                          const passages = this.getPassagesFromDocument(
                            fullResult.id,
                            passageIndicesShown,
                          );
                          return (
                            <PassageComparison
                              key={fullResult.id}
                              index={index}
                              passages={passages}
                              passageFullResult={fullResult}
                            />
                          );
                        }
                        return null;
                      })
                    }
                  </CSSTransitionGroup>
                </div>
              </div>
            )
            : <NoResults />
        }
        {
          this.isMoreResults(passageIndicesShown) &&
            <ShowMoreResults onClick={this.handleMoreResults} />
        }
      </Element>
    );
  }
}

PassagesContainer.propTypes = {
  results: shape({
    matching_results: number.isRequired,
    results: arrayOf(shape({
      id: string.isRequired,
      text: string.isRequired,
    })),
    passages: arrayOf(shape({
      document_id: string.isRequired,
      passage_text: string.isRequired,
    })),
  }).isRequired,
  searchContainerHeight: number.isRequired,
};

export default PassagesContainer;
