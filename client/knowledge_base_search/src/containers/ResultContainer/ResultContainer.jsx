import React from 'react';
import classNames from 'classnames';
import { string, number, node, oneOfType } from 'prop-types';
import './styles.css';

function ResultContainer({ resultText, resultRank, children }) {
  return (
    <div
      className={
        classNames('result_container--div', {
          'result_container_empty--div': resultText === '',
        })
      }
    >
      { resultText && (
        <div className="result_container_items--div">
          <div className="result_container_text--div">
            { resultText }
          </div>
        </div>
      )
      }
      {
        resultRank === 1 && !resultText &&
          <div className="result_container--div">No Results</div>
      }
      { children }
    </div>
  );
}

ResultContainer.propTypes = {
  resultText: oneOfType([
    string,
    node,
  ]),
  resultRank: number.isRequired,
  children: node,
};

ResultContainer.defaultProps = {
  resultText: null,
  children: null,
};

export default ResultContainer;
