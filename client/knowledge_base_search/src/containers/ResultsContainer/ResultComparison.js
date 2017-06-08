import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { scroller, Element } from 'react-scroll';
import ResultBox from './ResultBox';
import FullResult from './FullResult';
import './styles.css';

class ResultComparison extends Component {
  componentWillMount() {
    this.state = {
      full_result: null
    }
  }

  componentDidMount() {
    scroller.scrollTo('scroll_to_result_' + this.props.index, {
      smooth: true
    });
  }

  toggleFullResult = (index, type) => {
    this.isFullResultShown(index, type)
      ? this.props.onSetFullResult(-1, null)
      : this.props.onSetFullResult(index, type);
  }

  isFullResultShown(index, type) {
    const { full_result_type, full_result_index } = this.props;

    return full_result_type === type && full_result_index === index;
  }

  getFullResult() {
    const { full_result_type, result, passageFullResult } = this.props;

    return full_result_type === 'passage' ? passageFullResult : result;
  }

  render() {
    const {
      result,
      passage,
      index,
      full_result_index,
      full_result_type,
      fullResultTransitionTimeout
    } = this.props;

    return (
      <Element name={'scroll_to_result_' + index}>
        <div className='results_comparison--div'>
          <ResultBox
            result_type={'Discovery Passage'}
            result_rank={index + 1}
            result_text={passage.passage_text}
            result_score={passage.passage_score}
            is_full_result_shown={
              this.isFullResultShown(index, 'passage')
            }
            onToggleFullResult={
              () => { this.toggleFullResult(index, 'passage') }
            }
          />
          <ResultBox
            result_type={'Discovery Standard'}
            result_rank={index + 1}
            result_text={result.answer}
            result_score={result.score}
            is_full_result_shown={
              this.isFullResultShown(index, 'regular')
            }
            onToggleFullResult={
              () => { this.toggleFullResult(index, 'regular') }
            }
          />
        </div>
        <CSSTransitionGroup
          transitionName='full_result'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={fullResultTransitionTimeout}
        >
          {
            full_result_index === index
              ? (
                  <FullResult
                    key={full_result_index + '_' + full_result_type}
                    transitionTimeout={fullResultTransitionTimeout}
                    {...this.getFullResult()}
                  />
                )
              : null
          }
        </CSSTransitionGroup>
      </Element>
    );
  }
}

ResultComparison.PropTypes = {
  result: PropTypes.object.isRequired,
  passage: PropTypes.object.isRequired,
  passageFullResult: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onSetFullResult: PropTypes.func.isRequired,
  full_result_index: PropTypes.number.isRequired,
  full_result_type: PropTypes.string.isRequired,
  fullResultTransitionTimeout: PropTypes.number.isRequired
}

ResultComparison.defaultProps = {
  fullResultTransitionTimeout: 300
}

export default ResultComparison;
