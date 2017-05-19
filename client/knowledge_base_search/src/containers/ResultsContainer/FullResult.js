import React, { Component } from 'react';
import { Icon } from 'watson-react-components';
import QuestionColumn from './QuestionColumn';
import AnswerColumn from './AnswerColumn';
import links from '../../utils/links';

class FullResult extends Component {
  generateQuestionUrl(question_id) {
    return links.stack_exchange_questions + question_id;
  }

  render() {
    const {
      title,
      subtitle,
      answer,
      authorUserId,
      authorUsername,
      userId,
      username,
      views,
      upModVotes,
      downModVotes,
      accepted,
      id
    } = this.props;

    return (
      <div className='full_result_row--div'>
        <h4>
          Discovery answers…
        </h4>
        <h5 className='base--h5'>
          Original post title
        </h5>
        <h2>
          { title }
        </h2>
        <div className='full_result_container--div'>
          <QuestionColumn
            subtitle={subtitle}
            userId={authorUserId}
            userName={authorUsername}
          />
          <AnswerColumn
            answer={answer}
            userId={userId}
            userName={username}
            views={views}
            upVotes={upModVotes}
            downVotes={downModVotes}
            accepted={accepted}
          />
        </div>
        <div className='full_result_link--div'>
          <div>
            <Icon type='link' size='small' />
          </div>
          <div>
            <h5>
              View original full thread on Stack Exchange:
            </h5>
            <a
              href={this.generateQuestionUrl(id)}
              target='_blank'
              className='base--a'
            >
              { this.generateQuestionUrl(id) }
            </a>
          </div>
        </div>
      </div>
    );
  }
}

FullResult.PropTypes = {
  accepted: React.PropTypes.number.isRequired,
  answer: React.PropTypes.string.isRequired,
  answerScore: React.PropTypes.string.isRequired,
  authorUserId: React.PropTypes.string.isRequired,
  authorUsername: React.PropTypes.string.isRequired,
  downModVotes: React.PropTypes.number.isRequired,
  id: React.PropTypes.number.isRequired,
  score: React.PropTypes.number.isRequired,
  subtitle: React.PropTypes.string.isRequired,
  tags: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  upModVotes: React.PropTypes.number.isRequired,
  userId: React.PropTypes.string.isRequired,
  userReputation: React.PropTypes.number.isRequired,
  username: React.PropTypes.string.isRequired,
  views: React.PropTypes.number.isRequired
}

export default FullResult;
