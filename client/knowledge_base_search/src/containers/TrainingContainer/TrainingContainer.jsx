import React, { Component } from 'react';
import { string, number, arrayOf, shape } from 'prop-types';
import { scroller, Element } from 'react-scroll';
import TrainingComparison from './TrainingComparison';
import NoResults from '../../views/NoResults/NoResults';
import ShowMoreResults from '../../views/ShowMoreResults/ShowMoreResults';
import './styles.css';

class TrainingContainer extends Component {
  static getKey(regularResult, trainedResult) {
    if (regularResult && trainedResult) {
      return regularResult.id + trainedResult.id;
    } else if (regularResult) {
      return regularResult.id;
    } else if (trainedResult) {
      return trainedResult.id;
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      totalResultsShown: 3,
    };
  }

  componentDidMount() {
    scroller.scrollTo('scroll_to_results', {
      smooth: true,
      offset: -this.props.searchContainerHeight,
    });
  }

  getTrainedResultWithOriginalRank(rank) {
    const { regularResults, trainedResults } = this.props;
    const trainedResult = trainedResults.results[rank];
    const trainedResultId = trainedResult.id;
    const originalIndex = regularResults.results.findIndex(result => result.id === trainedResultId);

    return Object.assign({}, trainedResult, {
      originalRank: originalIndex + 1,
    });
  }

  hasMoreResults() {
    const { regularResults, trainedResults, maxRegularResults } = this.props;
    const totalResultsShown = this.state.totalResultsShown;
    const totalRegularResults = Math.min(regularResults.results.length, maxRegularResults);

    return totalRegularResults > totalResultsShown ||
           trainedResults.results.length > totalResultsShown;
  }

  handleMoreResults = () => {
    this.setState({ totalResultsShown: this.state.totalResultsShown + 1 });
  }

  render() {
    const { regularResults, trainedResults, maxRegularResults } = this.props;
    const { totalResultsShown } = this.state;
    const maxResults = Math.max(maxRegularResults, trainedResults.results.length);

    return (
      <Element name="scroll_to_results">
        {
          regularResults.matching_results > 0 || trainedResults.matching_results > 0
            ? (
              <div className="_container _container_large">
                <h3>
                  Compare the Standard search to a dataset with custom relevancy
                  training on Stack Exchange Travel data.
                </h3>
                <div className="training--results">
                  {
                    [...Array(Math.min(totalResultsShown, maxResults))].map((x, rank) => {
                      const regularResult = regularResults.results[rank];
                      const trainedResult = this.getTrainedResultWithOriginalRank(rank);

                      return (
                        <TrainingComparison
                          key={TrainingContainer.getKey(regularResult, trainedResult)}
                          index={rank}
                          regularResult={regularResult}
                          trainedResult={trainedResult}
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

TrainingContainer.propTypes = {
  regularResults: shape({
    matching_results: number.isRequired,
    results: arrayOf(shape({
      text: string.isRequired,
    })).isRequired,
  }).isRequired,
  trainedResults: shape({
    matching_results: number.isRequired,
    results: arrayOf(shape({
      text: string.isRequired,
    })).isRequired,
  }).isRequired,
  searchContainerHeight: number.isRequired,
  maxRegularResults: number.isRequired,
};

TrainingContainer.defaultProps = {
  maxRegularResults: 10,
};

export default TrainingContainer;
