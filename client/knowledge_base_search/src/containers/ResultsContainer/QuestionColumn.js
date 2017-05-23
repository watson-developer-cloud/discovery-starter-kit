import React, { Component } from 'react';
import PropTypes from 'prop-types';
import links from '../../utils/links';

class QuestionColumn extends Component {
  generateAuthorLink(userId) {
    return links.stack_exchange_users + userId;
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
          className='base--a'
        >
          {userName}
        </a>
      </div>
    );
  }
}

QuestionColumn.PropTypes = {
  subtitle: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired
}

export default QuestionColumn;
