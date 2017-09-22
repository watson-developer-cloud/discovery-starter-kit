import React, { Component } from 'react';
import { string, func, bool } from 'prop-types';
import './styles.css';

class QuestionTypeSelect extends Component {
  // a map of the questions used per feature type
  static questionTypes = {
    // select "PRESET" when you wish to have questions from the dataset
    // this uses the /api/questions endpoint on the server
    PRESET: {
      value: 'preset',
      text: 'Preset questions',
    },
    // select "CUSTOM" when you wish to type in your own question
    CUSTOM: {
      value: 'custom',
      text: 'Custom questions',
    },
  }

  render() {
    return (
      <select
        className="question_type--select"
        value={this.props.selectedQuestion}
        onChange={this.props.onSelect}
        disabled={this.props.isFetchingResults}
      >
        {
          Object.keys(QuestionTypeSelect.questionTypes).map((questionKey) => {
            const { value, text } = QuestionTypeSelect.questionTypes[questionKey];

            return (
              <option key={value} value={value}>
                { text }
              </option>
            );
          })
        }
      </select>
    );
  }
}

QuestionTypeSelect.propTypes = {
  onSelect: func.isRequired,
  selectedQuestion: string.isRequired,
  isFetchingResults: bool.isRequired,
};

export default QuestionTypeSelect;
