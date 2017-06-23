import React from 'react';
import ReactDOM from 'react-dom';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultBox />', () => {
  const onToggleFullResultMock = jest.fn();
  const props = {
    result_type: 'regular',
    result_text: 'result',
    result_rank: 1,
    is_full_result_shown: false,
    onToggleFullResult: onToggleFullResultMock
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultBox {...props} />, div);
  });

  describe('when there is no result', () => {
    let wrapper;

    const props_no_result = Object.assign({}, props, {
      result_text: null
    });

    describe('and it is the first rank', () => {
      const firstRank = 1;

      beforeEach(() => {
        const props_with_first_rank = Object.assign({}, props_no_result, {
          result_rank: firstRank
        });
        wrapper = shallow(<ResultBox {...props_with_first_rank} />);
      });

      it('has "No Results"', () => {
        const text = wrapper.text();
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

      it('does not have "No Results"', () => {
        const text = wrapper.text();
        expect(text).not.toContain('No Results');
      });
    });
  });

  describe('when the result exceeds the max_length', () => {
    const props_with_long_result = Object.assign({}, props, {
      result_text: Array(ResultBox.defaultProps.max_length + 2).join('a')
    });

    describe('and the result type is "regular"', () => {
      const props_long_standard = Object.assign({}, props_with_long_result, {
        result_type: 'regular'
      });

      it('trims the result and adds an ellipsis', () => {
        const wrapper = shallow(<ResultBox {...props_long_standard} />);
        const resultText = wrapper.find('.result_box_text--div').text();
        expect(resultText.length).toEqual(ResultBox.defaultProps.max_length + 1);
        expect(resultText).toContain('…');
      });
    });

    describe('and the result type is "passage"', () => {
      const props_long_passage = Object.assign({}, props_with_long_result, {
        result_type: 'passage'
      });

      it('does not trim the result', () => {
        const wrapper = shallow(<ResultBox {...props_long_passage} />);
        const resultText = wrapper.find('.result_box_text--div').text();
        expect(resultText.length).toEqual(ResultBox.defaultProps.max_length + 1);
        expect(resultText).not.toContain('…');
      });
    });

  });

  describe('when the "See full answer" button is clicked', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<ResultBox {...props} />);
      wrapper.find('.result_box_toggle--div button').simulate('click');
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

    it('has "Collapse answer" as the button text', () => {
      expect(wrapper.find('.result_box_toggle--div button').text())
        .toEqual('Collapse answer');
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
      expect(wrapper.find('.result_box_toggle--div button').text())
        .toEqual('Show full answer');
    });
  });
});
