import React, { Component } from 'react';
import links from '../../utils/links';

class AnswerColumn extends Component {
  generateUserAnswerLink(userId) {
    return links.stack_exhange_users + userId;
  }

  displayAccepted(accepted) {
    return accepted ? 'YES' : 'NO';
  }

  render() {
    const {
      answer,
      userId,
      userName,
      views,
      downVotes,
      upVotes,
      accepted
    } = this.props;

    return (
      <div className='answer_column--div'>
        <h5 className='base--h5'>
          Watson thinks this is the best answer on this thread:
        </h5>
        <div className='answer_box--div'>
          <h5 className='base--h5'>
            Recommended answer
          </h5>
          <div>
            { answer }
          </div>
          <h5 className='base--h5'>
            Answered by:
          </h5>
          <a href={this.generateUserAnswerLink(userId)} target='_blank' className=''>
            { userName }
          </a>
        </div>
        <div className='answer_metadata--div'>
          <ul>
            <li>
              <span>Number of times this answer was viewed: </span>
              { views }
            </li>
            <li>
              <span>Number of downvotes this answer received: </span>
              { downVotes }
            </li>
            <li>
              <span>Number of upvotes this answer received: </span>
              { upVotes }
            </li>
            <li>
              <span>Did the original poster accept this answer?: </span>
              { this.displayAccepted(accepted) }
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

AnswerColumn.PropTypes = {
  answer: React.PropTypes.string.isRequired,
  userId: React.PropTypes.number.isRequired,
  userName: React.PropTypes.string.isRequired,
  views: React.PropTypes.number.isRequired,
  downVotes: React.PropTypes.number.isRequired,
  upVotes: React.PropTypes.number.isRequired,
  accepted: React.PropTypes.bool.isRequired
}

export default AnswerColumn;
