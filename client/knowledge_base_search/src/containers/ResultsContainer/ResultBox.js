import React, { Component } from 'react';
import './styles.css';

class ResultBox extends Component {
  render() {
    return (
      <div className='result_box--div'>
        <h4>
          {this.props.result_type}
        </h4>
        <div className='result_text--div'>
          {this.props.result.answer}
        </div>
      </div>
    );
  }
}

ResultBox.PropTypes = {
  result: React.PropTypes.object.isRequired,
  result_type: React.PropTypes.string.isRequired
}

export default ResultBox;
