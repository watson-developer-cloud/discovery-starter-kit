import React, { Component } from 'react';
import './styles.css';

class RelatedQuestions extends Component {
  filterRelatedQuestions() {
    const { enriched_results, max_related_questions } = this.props;
    const firstTitle = enriched_results[0].title;

    return enriched_results.reduce((memo, result) => {
      if (result.title !== firstTitle && memo.indexOf(result.title) === -1) {
        memo.push(result.title);
      }
      return memo;
    }, []).slice(0, max_related_questions);
  }

  handleOnClick = (e) => {
    this.props.onSearch(e.target.value);
  }

  render() {
    return (
      <div className='results_right--div'>
        <h4>Related Questions</h4>
        <ul className='base--ul'>
        {
          this.filterRelatedQuestions().map((question, index) => {
            return (
              <li key={index} className='base--li related_questions--li'>
                <button
                  type='button'
                  onClick={this.handleOnClick}
                  value={question}
                  className='base--button_icon-hyperlink teal--link'
                >
                  { question }
                </button>
              </li>
            );
          })
        }
        </ul>
      </div>
    );
  }
}

RelatedQuestions.PropTypes = {
  enriched_results: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSearch: React.PropTypes.func.isRequired
}

RelatedQuestions.defaultProps = {
  max_related_questions: 4
}

export default RelatedQuestions;
