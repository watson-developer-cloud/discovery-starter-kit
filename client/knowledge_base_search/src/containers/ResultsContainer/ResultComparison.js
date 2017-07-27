import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResultBox from './ResultBox';
import './styles.css';

class ResultComparison extends Component {
  getPassageResult() {
    const { passages, passageFullResult } = this.props;

    return passages.reduce((highlightedResult, passage) => {
      return this.recursiveHighlight(highlightedResult, passage);
    }, passageFullResult.text);
  }

  recursiveHighlight(highlightedResult, passage) {
    if (typeof highlightedResult === 'object') {
      // it has already been highlighted at least once, find the strings
      if (highlightedResult.props) {
        // it is a react element
        if (typeof highlightedResult.props.children === 'object') {
          // it is a <span>string<b>string</b>string</span>
          return (
                    <span key={highlightedResult.key}>
                      {
                        highlightedResult.props.children.map((child) => {
                          if (typeof child === 'string') {
                            // is either before or after the <b> tag
                            return this.highlightPassage(passage, child);
                          } else {
                            // this is the content of the <b> tag
                            return this.recursiveHighlight(child, passage);
                          }
                        })
                      }
                    </span>
                  )
        } else {
          // it is a <b> tag
          return highlightedResult;
        }
      } else {
        // it is an array, highlight the strings
        return highlightedResult.map((object) => {
          if (typeof object === 'string') {
            return this.highlightPassage(passage, object);
          } else {
            return object;
          }
        });
      }
    } else {
      // base case
      return this.highlightPassage(passage, highlightedResult);
    }
  }

  highlightPassage(passage, fullResult) {
    const passageIndex = fullResult.indexOf(passage.passage_text);

    if (passageIndex === -1) {
      return fullResult;
    }

    return (
      <span key={'text_with_highlights_' + (passage.rank + 1)}>
        { fullResult.substr(0, passageIndex) }
        <span key={'passage_' + (passage.rank + 1)}>
          <span className='passage_rank--span'>
            { passage.rank + 1}
          </span>
          <b>{passage.passage_text}</b>
        </span>
        { fullResult.substr(passageIndex + passage.passage_text.length) }
      </span>
    )
  }

  render() {
    const {
      passageFullResult,
      index
    } = this.props;

    return (
      <div className='results_comparison--div'>
        <div className='results_comparison_content--div'>
          <div className='results_comparison_content_left--div'>
            { index === 0 && (<h5>Standard search</h5>) }
            <ResultBox
              result_type={'regular'}
              result_text={passageFullResult.text}
              result_rank={index + 1}
            />
          </div>
          <div className='results_comparison_content_right--div'>
            { index === 0 && (<h5>Passage search</h5>) }
            <ResultBox
              result_type={'passage'}
              result_text={this.getPassageResult()}
              result_rank={index + 1}
            />
          </div>
        </div>
      </div>
    );
  }
}

ResultComparison.PropTypes = {
  passages: PropTypes.arrayOf(PropTypes.shape({
    passage_text: PropTypes.string.isRequired,
    passage_score: PropTypes.string,
    rank: PropTypes.number
  })).isRequired,
  passageFullResult: PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
}

export default ResultComparison;
