import React, { Component } from 'react';
import './styles.css';

class RelatedQuestions extends Component {
  filterRelatedQuestions() {
    const { results, max_related_questions } = this.props;
    const firstTitle = results[0] ? results[0].title : '';

    return results.reduce((memo, result) => {
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
    const relatedQuestions = this.filterRelatedQuestions();

    return (
      <div className='results_right--div'>
        <h4>Related Questions</h4>
        { relatedQuestions.length > 0
            ? <ul className='base--ul'>
              {
                relatedQuestions.map((question, index) => {
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
            : <div>No Related Questions</div>
        }
      </div>
    );
  }
}

RelatedQuestions.PropTypes = {
  results: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSearch: React.PropTypes.func.isRequired
}

RelatedQuestions.defaultProps = {
  max_related_questions: 4
}

export default RelatedQuestions;
