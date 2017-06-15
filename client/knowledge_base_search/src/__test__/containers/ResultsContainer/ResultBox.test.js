import React from 'react';
import ReactDOM from 'react-dom';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultBox />', () => {
  const onToggleFullResultMock = jest.fn();
  const result_text = 'result';
  const result_score = 1.0;
  const result_type = 'result type';
  const result_rank = 1;
  const is_full_result_shown = false;
  const props = {
    result_text,
    result_score,
    result_type,
    onToggleFullResult: onToggleFullResultMock,
    result_rank,
    is_full_result_shown
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultBox {...props} />, div);
  });

  describe('when there is no result', () => {
    let wrapper;
    const noResult = null;
    const props_no_result = Object.assign({}, props, {
      result_text: noResult
    });

    describe('and it is the first rank', () => {
      const firstRank = 1;

      beforeEach(() => {
        const props_with_first_rank = Object.assign({}, props_no_result, {
          result_rank: firstRank
        });
        wrapper = shallow(<ResultBox {...props_with_first_rank} />);
      });

      it('has "No Results" and title', () => {
        const text = wrapper.text();
        expect(text).toContain(result_type);
        expect(text).toContain('No Results');
      });
    });

    describe('and it is not the first rank', () => {
      beforeEach(() => {
        const props_with_not_first_rank = Object.assign({}, props_no_result, {
          result_rank: 2
        });
        wrapper = shallow(<ResultBox {...props_with_not_first_rank} />);
      });

      it('does not have "No Results" or title', () => {
        const text = wrapper.text();
        expect(text).not.toContain(result_type);
        expect(text).not.toContain('No Results');
      });
    });
  });

  describe('when the result exceeds the max_length', () => {
    const props_with_long_result = Object.assign({}, props, {
      result_text: Array(ResultBox.defaultProps.max_length + 2).join('a')
    });

    describe('and the result type is "Discovery Standard"', () => {
      const props_long_standard = Object.assign({}, props_with_long_result, {
        result_type: 'Discovery Standard'
      });

      it('trims the result and adds an ellipsis', () => {
        const wrapper = shallow(<ResultBox {...props_long_standard} />);
        const resultText = wrapper.find('.result_answer_snippet--div').text();
        expect(resultText.length).toEqual(ResultBox.defaultProps.max_length + 1);
        expect(resultText).toContain('…');
      });
    });

    describe('and the result type is "Discovery Passage"', () => {
      const props_long_passage = Object.assign({}, props_with_long_result, {
        result_type: 'Discovery Passage'
      });

      it('does not trim the result', () => {
        const wrapper = shallow(<ResultBox {...props_long_passage} />);
        const resultText = wrapper.find('.result_answer_snippet--div').text();
        expect(resultText.length).toEqual(ResultBox.defaultProps.max_length + 1);
        expect(resultText).not.toContain('…');
      });
    });

  });

  describe('when the score exceeds the decimal_places', () => {
    const props_with_precise_score = Object.assign({}, props, {
      result_score: 5.012345
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
