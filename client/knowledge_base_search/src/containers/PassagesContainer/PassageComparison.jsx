import React, { Component } from 'react';
import { string, number, arrayOf, shape } from 'prop-types';
import ResultContainer from '../ResultContainer/ResultContainer';
import replaceNewlines from '../../utils/replaceNewlines';
import './styles.css';

class PassageComparison extends Component {
  getSortedPassagesWithIndices() {
    const { passages, passageFullResult: { text } } = this.props;

    return passages.map((passage) => {
      const start = text.indexOf(passage.passage_text);
      const end = start + passage.passage_text.length;

      return Object.assign({}, passage, { start, end });
    }).sort((a, b) => a.start - b.start);
  }

  highlightPassages() {
    const { passageFullResult: { text } } = this.props;
    const passagesWithIndices = this.getSortedPassagesWithIndices();

    const highlightedPassages = [];

    passagesWithIndices.forEach((currentPassage, i) => {
      const nextPassage = passagesWithIndices[i + 1];
      const isLastPassage = typeof nextPassage === 'undefined';

      // if first passage doesn't start at the beginning
      if (highlightedPassages.length === 0 && currentPassage.start > 0) {
        highlightedPassages.push(
          replaceNewlines(text.substr(0, currentPassage.start)),
        );
      }

      // highlight the passage
      highlightedPassages.push(
        <span
          className="passage--span"
          key={`passage_${currentPassage.index + 1}`}
        >
          <span className="passage_rank--span" />
          <b>
            { replaceNewlines(currentPassage.passage_text) }
          </b>
        </span>,
      );

      // if not last passage and there is text between this passage and the next
      if (!isLastPassage && nextPassage.start > currentPassage.end) {
        const textEnd = nextPassage.start - currentPassage.end;

        highlightedPassages.push(
          replaceNewlines(text.substr(currentPassage.end, textEnd)),
        );
      }

      // if the last passage and we aren't at the end of the result
      if (isLastPassage && currentPassage.end < text.length) {
        highlightedPassages.push(
          replaceNewlines(text.substr(currentPassage.end)),
        );
      }
    });

    return highlightedPassages;
  }

  render() {
    const {
      passageFullResult,
      index,
    } = this.props;

    return (
      <div className="passages_comparison--div">
        <div className="passages_comparison_content--div">
          <div className="passages_comparison_content_left--div">
            { index === 0 && (<h5>Standard search</h5>) }
            <ResultContainer
              resultText={replaceNewlines(passageFullResult.text)}
              resultRank={index + 1}
            />
          </div>
          <div className="passages_comparison_content_right--div">
            { index === 0 && (<h5>Passage search</h5>) }
            <ResultContainer
              resultText={this.highlightPassages()}
              resultRank={index + 1}
            />
          </div>
        </div>
      </div>
    );
  }
}

PassageComparison.propTypes = {
  passages: arrayOf(shape({
    passage_text: string.isRequired,
    index: number.isRequired,
  })).isRequired,
  passageFullResult: shape({
    id: string.isRequired,
    text: string.isRequired,
  }).isRequired,
  index: number.isRequired,
};

export default PassageComparison;
