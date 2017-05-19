import React, { Component } from 'react';
import links from '../../utils/links';

class QuestionColumn extends Component {
  generateAuthorLink(userId) {
    return links.stack_exhange_users + userId;
  }

  render() {
    const { subtitle, userId, userName } = this.props;

    return (
      <div className='question_column--div'>
        <h5 className='base--h5'>
          Original question
        </h5>
        <div>
          { subtitle }
        </div>
        <h5 className='base--h5'>
          Originally asked by:
        </h5>
        <a
          href={this.generateAuthorLink(userId)}
          target='_blank'
          className='teal--a'
        >
          {userName}
        </a>
      </div>
    );
  }
}

QuestionColumn.PropTypes = {
  subtitle: React.PropTypes.string.isRequired,
  userId: React.PropTypes.string.isRequired,
  userName: React.PropTypes.string.isRequired
}

export default QuestionColumn;
