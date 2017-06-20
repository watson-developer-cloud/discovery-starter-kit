import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scroller, Element } from 'react-scroll';
import ResultBox from './ResultBox';
import './styles.css';

class ResultComparison extends Component {
  componentWillMount() {
    this.state = {
      passage_result_text: this.getPassageResult(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      passage_result_text: this.getPassageResult(nextProps)
    });
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

  getPassageResult(nextProps) {
    const {
      index,
      full_result_type,
      full_result_index,
      passage: {
        passage_text
      },
      passageFullResult: {
        answer
      }
    } = nextProps;

    return index === full_result_index && full_result_type === 'passage'
      ? answer
      : passage_text;
  }

  render() {
    const {
      result: {
        answer
      },
      index
    } = this.props;

    return (
      <Element name={'scroll_to_result_' + index}>
        { index === 0
          ? (
              <div className='results_comparison_header--div'>
                <h4>Standard Search</h4>
                <h4>Passage Search</h4>
              </div>
            )
          : null
        }
        <div className='results_comparison--div'>
          <ResultBox
            result_type={'regular'}
            result_text={answer}
            result_rank={index + 1}
            is_full_result_shown={
              this.isFullResultShown(index, 'regular')
            }
            onToggleFullResult={
              () => { this.toggleFullResult(index, 'regular') }
            }
          />
          <ResultBox
            result_type={'passage'}
            result_text={this.state.passage_result_text}
            result_rank={index + 1}
            is_full_result_shown={
              this.isFullResultShown(index, 'passage')
            }
            onToggleFullResult={
              () => { this.toggleFullResult(index, 'passage') }
            }
          />
        </div>
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
  full_result_type: PropTypes.string.isRequired
}

export default ResultComparison;
