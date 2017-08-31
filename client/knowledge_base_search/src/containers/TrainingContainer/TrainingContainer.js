import React, { Component } from 'react';
import { string, number, arrayOf, shape } from 'prop-types';
import { scroller, Element } from 'react-scroll';
import TrainingComparison from './TrainingComparison';
import NoResults from '../../views/NoResults/NoResults';
import ShowMoreResults from '../../views/ShowMoreResults/ShowMoreResults';
import './styles.css';

class TrainingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalResultsShown: 3
    };
  }

  componentDidMount() {
    scroller.scrollTo('scroll_to_results', {
      smooth: true,
      offset: -this.props.searchContainerHeight
    });
  }

  hasMoreResults() {
    const { regularResults, trainedResults } = this.props;
    const totalResultsShown = this.state.totalResultsShown;

    return regularResults.results.length > totalResultsShown ||
           trainedResults.results.length > totalResultsShown;
  }

  handleMoreResults = () => {
    this.setState({totalResultsShown: this.state.totalResultsShown + 1});
  }

  render() {
    const { regularResults, trainedResults } = this.props;
    const maxResults = Math.max(regularResults.results.length, trainedResults.results.length);

    return (
      <Element name="scroll_to_results">
        {
          regularResults.matching_results > 0 || trainedResults.matching_results > 0
            ? (
                <div className="_container _container_large">
                  <h3>
                    Compare the Standard search to a dataset with custom relevancy training on Stack Exchange Travel data.
                  </h3>
                  <div className="training--results">
                    {
                      [...Array(Math.min(this.state.totalResultsShown, maxResults))].map((x, rank) => {
                        return(
                          <TrainingComparison
                            key={`training_comparison_${rank}`}
                            index={rank}
                            regularResult={regularResults.results[rank]}
                            trainedResult={trainedResults.results[rank]}
                          />
                        );
                      })
                    }
                  </div>
                </div>
              )
            : <NoResults />
        }
        {
          this.hasMoreResults() && <ShowMoreResults onClick={this.handleMoreResults} />
        }
      </Element>
    );
  }
}

TrainingContainer.PropTypes = {
  regularResults: shape({
    matching_results: number.isRequired,
    results: arrayOf(shape({
      text: string.isRequired
    })).isRequired
  }).isRequired,
  trainedResults: shape({
    matching_results: number.isRequired,
    results: arrayOf(shape({
      text: string.isRequired
    })).isRequired
  }).isRequired,
  searchContainerHeight: number.isRequired
}

export default TrainingContainer;
