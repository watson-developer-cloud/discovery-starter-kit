import React from 'react';
import { func } from 'prop-types';
import './styles.css';

function ShowMoreResults({ onClick }) {
  return (
    <div className="_container-center show_results--div">
      <button
        className="base--button base--button_teal"
        type="button"
        onClick={onClick}
      >
        Show more results
      </button>
    </div>
  );
}

ShowMoreResults.propTypes = {
  onClick: func.isRequired,
};

export default ShowMoreResults;
