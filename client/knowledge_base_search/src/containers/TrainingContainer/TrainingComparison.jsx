import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import ResultContainer from '../ResultContainer/ResultContainer';
import replaceNewlines from '../../utils/replaceNewlines';
import './styles.css';

class TrainingComparison extends Component {
  getRankDisplay() {
    const { trainedResult: { originalRank } } = this.props;

    if (originalRank === 0) {
      return 'Untrained Rank: > 100';
    }
    return `Untrained Rank: ${originalRank}`;
  }

  render() {
    const { regularResult, trainedResult, index } = this.props;
    const isFirst = index === 0;

    return (
      <div className="training_comparison">
        <div className="training_comparison--content">
          <div className="training_comparison--content_left">
            { isFirst && (<h5>Standard search</h5>) }
            { regularResult && (
              <ResultContainer
                resultText={replaceNewlines(regularResult.text)}
                resultRank={index + 1}
              />
            )
            }
          </div>
          <div className="training_comparison--content_right">
            { isFirst && (<h5>Trained search</h5>) }
            { trainedResult && (
              <ResultContainer
                resultText={replaceNewlines(trainedResult.text)}
                resultRank={index + 1}
              >
                <div className="training_comparison--content_rank">
                  { this.getRankDisplay() }
                </div>
              </ResultContainer>
            )
            }
          </div>
        </div>
      </div>
    );
  }
}

TrainingComparison.propTypes = {
  regularResult: shape({
    text: string.isRequired,
  }),
  trainedResult: shape({
    text: string.isRequired,
    originalRank: number.isRequired,
  }),
  index: number.isRequired,
};

TrainingComparison.defaultProps = {
  regularResult: null,
  trainedResult: null,
};

export default TrainingComparison;
