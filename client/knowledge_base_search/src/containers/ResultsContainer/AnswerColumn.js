import React, { Component } from 'react';
import PropTypes from 'prop-types';
import links from '../../utils/links';

class AnswerColumn extends Component {
  generateUserAnswerLink(userId) {
    return links.stack_exchange_users + userId;
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
          <ul className='base--ul_no-bullets'>
            <li className='base--li'>
              <span>Number of times this answer was viewed: </span>
              { views }
            </li>
            <li className='base--li'>
              <span>Number of downvotes this answer received: </span>
              { downVotes }
            </li>
            <li className='base--li'>
              <span>Number of upvotes this answer received: </span>
              { upVotes }
            </li>
            <li className='base--li'>
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
  answer: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  downVotes: PropTypes.number.isRequired,
  upVotes: PropTypes.number.isRequired,
  accepted: PropTypes.bool.isRequired
}

export default AnswerColumn;
