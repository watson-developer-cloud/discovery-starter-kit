import React from 'react';
import ReactDOM from 'react-dom';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultBox />', () => {
  const onToggleFullResultMock = jest.fn();
  const result = {
    'answer': 'result',
    'score': 1.0
  };
  const result_type = 'result type';
  const result_rank = 1;
  const is_full_result_shown = false;
  const props = {
    result,
    result_type,
    onToggleFullResult: onToggleFullResultMock,
    result_rank,
    is_full_result_shown
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultBox {...props} />, div);
  });

  describe('when the result exceeds the max_length', () => {
    const long_result = Object.assign({}, result, {
      'answer': Array(ResultBox.defaultProps.max_length + 2).join('a')
    });
    const props_with_long_result = Object.assign({}, props, {
      'result': long_result
    });

    it('trims the result and adds an ellipsis', () => {
      const wrapper = shallow(<ResultBox {...props_with_long_result} />);
      const resultText = wrapper.find('.result_answer_snippet--div').text();
      expect(resultText.length).toEqual(ResultBox.defaultProps.max_length + 1);
      expect(resultText).toContain('…');
    });
  });

  describe('when the score exceeds the decimal_places', () => {
    const really_precise_score_result = Object.assign({}, result, {
      'score': 5.012345
    });
    const props_with_precise_score = Object.assign({}, props, {
      'result': really_precise_score_result
    });

    it('rounds the score', () => {
      const wrapper = shallow(<ResultBox {...props_with_precise_score} />);
      const scoreText = wrapper.find('.result_rank_right--div').text();
      expect(scoreText).toEqual('Relevance Score 5.01');
    });
  });

  describe('when the "See full answer" button is clicked', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<ResultBox {...props} />);
      wrapper.find('.result_full_answer--div button').simulate('click');
    });

    it('calls the onShowFullAnswer method', () => {
      expect(onToggleFullResultMock).toBeCalled();
    });
  });

  describe('when is_full_result_shown is true', () => {
    let wrapper;

    beforeEach(() => {
      const props_with_full_result_true = Object.assign({}, props, {
        is_full_result_shown: true
      });
      wrapper = shallow(<ResultBox {...props_with_full_result_true} />);
    });

    it('has "Hide full answer" as the button text', () => {
      expect(wrapper.find('.result_full_answer--div button').text())
        .toEqual('Hide full answer');
    });
  });

  describe('when is_full_result_shown is false', () => {
    let wrapper;

    beforeEach(() => {
      const props_with_full_result_false = Object.assign({}, props, {
        is_full_result_shown: false
      });
      wrapper = shallow(<ResultBox {...props_with_full_result_false} />);
    });

    it('has "Show full answer" as the button text', () => {
      expect(wrapper.find('.result_full_answer--div button').text())
        .toEqual('Show full answer');
    });
  });
});
