import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import ResultContainer from '../ResultContainer/ResultContainer';
import replaceNewlines from '../../utils/replaceNewlines';
import './styles.css';

class TrainingComparison extends Component {
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
                  result_text={replaceNewlines(regularResult.text)}
                  result_rank={index + 1}
                />
              )
            }
          </div>
          <div className="training_comparison--content_right">
            { isFirst && (<h5>Trained search</h5>) }
            { trainedResult && (
                <ResultContainer
                  result_text={replaceNewlines(trainedResult.text)}
                  result_rank={index + 1}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

TrainingComparison.PropTypes = {
  regularResult: shape({
    text: string.isRequired
  }),
  trainedResult: shape({
    text: string.isRequired
  }),
  index: number.isRequired
}

export default TrainingComparison;
