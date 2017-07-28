import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { scroller, Element } from 'react-scroll';
import PassageComparison from './PassageComparison';
import 'watson-react-components/dist/css/watson-react-components.css';
import './styles.css';

class PassagesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_results_shown: 3
    };
  }

  componentDidMount() {
    scroller.scrollTo('scroll_to_results', {
      smooth: true,
      offset: -this.props.searchContainerHeight
    });
  }

  isMoreResults(passage_ranks_shown) {
    const { enriched_results } = this.props;

    return enriched_results.passages.length > passage_ranks_shown.length;
  }

  handleMoreResults = () => {
    this.setState({total_results_shown: this.state.total_results_shown + 1});
  }

  findPassageResult(document_id) {
    const { enriched_results } = this.props;

    return enriched_results.results.find((result) => {
      return result.id === document_id;
    });
  }

  getPassagesInSameDocument(rank, passage_ranks_shown) {
    const { enriched_results } = this.props;

    let nextDocumentId;
    return enriched_results.passages.reduce((passages, passage, passageRank) => {
      if (passage_ranks_shown.indexOf(passageRank) === -1) {
        if (!nextDocumentId) {
          // passage not already shown, set it as the next document Id
          nextDocumentId = passage.document_id;
        }

        if (nextDocumentId === passage.document_id) {
          passage_ranks_shown.push(passageRank);
          passage.rank = passageRank;
          passages.push(passage);
        }
      }
      return passages;
    }, []);
  }

  render() {
    const { enriched_results } = this.props;
    const passage_ranks_shown = [];

    return (
      <Element name='scroll_to_results'>
        {
          enriched_results.matching_results > 0
            ? (
                <div className='_container _container_large'>
                  <h3>
                    Compare the Standard search to the Passage search on Stack Exchange Travel data.
                  </h3>
                  <div className='passages_container--div'>
                    <CSSTransitionGroup
                      transitionName='passages_comparison'
                      transitionEnterTimeout={500}
                      transitionLeave={false}
                    >
                      {
                        [...Array(this.state.total_results_shown)].map((x, rank) => {
                          const passages = this.getPassagesInSameDocument(
                                             rank,
                                             passage_ranks_shown
                                           )
                          return(
                            <PassageComparison
                              key={'passage_comparison_' + rank}
                              index={rank}
                              passages={passages}
                              passageFullResult={
                                this.findPassageResult(
                                  passages[0].document_id
                                )
                              }
                            />
                          );
                        })
                      }
                    </CSSTransitionGroup>
                  </div>
                </div>
              )
            : (
                <div className='_container-center'>
                  <h2>No Results</h2>
                </div>
              )
        }
        {
          this.isMoreResults(passage_ranks_shown)
            ? (
                <div className='_container-center show_results--div'>
                  <button
                    className='base--button base--button_teal'
                    type='button'
                    onClick={this.handleMoreResults}
                  >
                    Show more results
                  </button>
                </div>
              )
            : null
        }
      </Element>
    );
  }
}

PassagesContainer.PropTypes = {
  enriched_results: PropTypes.shape({
    matching_results: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(PropTypes.object),
    passages: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  searchContainerHeight: PropTypes.number.isRequired
}

export default PassagesContainer;
