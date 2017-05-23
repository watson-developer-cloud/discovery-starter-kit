import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scroller, Element } from 'react-scroll';
import { Icon } from 'watson-react-components';
import QuestionColumn from './QuestionColumn';
import AnswerColumn from './AnswerColumn';
import links from '../../utils/links';

class FullResult extends Component {
  componentDidMount() {
    // wait for transition before calculating scroll position
    setTimeout(() => {
      scroller.scrollTo('scroll_to_answer_' + this.props.id, {
        smooth: true
      });
    }, this.props.transitionTimeout);
  }

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
      <Element name={'scroll_to_answer_' + id} className='full_result_row--div'>
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
      </Element>
    );
  }
}

FullResult.PropTypes = {
  transitionTimeout: PropTypes.number.isRequired,
  accepted: PropTypes.number.isRequired,
  answer: PropTypes.string.isRequired,
  answerScore: PropTypes.string.isRequired,
  authorUserId: PropTypes.string.isRequired,
  authorUsername: PropTypes.string.isRequired,
  downModVotes: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  subtitle: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  upModVotes: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  userReputation: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired
}

export default FullResult;
