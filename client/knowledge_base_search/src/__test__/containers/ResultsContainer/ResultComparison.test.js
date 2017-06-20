import React from 'react';
import ReactDOM from 'react-dom';
import ResultComparison from '../../../containers/ResultsContainer/ResultComparison';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultComparison />', () => {
  let wrapper;
  const onSetFullResultMock = jest.fn();
  const props = {
    result: {
      answer: 'a good answer'
    },
    passage: {
      passage_text: 'a passage'
    },
    passageFullResult: {
      answer: 'a great answer'
    },
    index: 0,
    onSetFullResult: onSetFullResultMock,
    full_result_index: -1,
    full_result_type: null
  }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultComparison {...props} />, div);
  });

  it('has 2 <ResultBox /> with expected text', () => {
    wrapper = shallow(<ResultComparison {...props} />);

    const resultBoxes = wrapper.find(ResultBox);
    expect(resultBoxes).toHaveLength(2);
    expect(resultBoxes.at(0).props().result_text).toEqual('a good answer');
    expect(resultBoxes.at(1).props().result_text).toEqual('a passage');
  });

  it('has 2 titles', () => {
    wrapper = shallow(<ResultComparison {...props} />);

    const titles = wrapper.find('.results_comparison_header--div h4');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).text()).toEqual('Standard Search');
    expect(titles.at(1).text()).toEqual('Passage Search');
  });

  describe('when index is not 0', () => {
    beforeEach(() => {
      const props_with_nonzero_index = Object.assign({}, props, {
        index: 1
      });

      wrapper = shallow(<ResultComparison {...props_with_nonzero_index} />);
    });

    it('does not show titles', () => {
      const titles = wrapper.find('.results_comparison_header--div h4');

      expect(titles).toHaveLength(0);
      expect(wrapper.text()).not.toContain('Standard Search');
      expect(wrapper.text()).not.toContain('Passage Search');
    });
  });

  describe('when full_result_index is equal to index', () => {
    let wrapper;

    beforeEach(() => {
      const props_with_equal_index = Object.assign({}, props, {
        full_result_index: props.index,
        full_result_type: 'regular'
      });

      wrapper = shallow(<ResultComparison {...props_with_equal_index} />);
    });

    it('has the first <ResultBox /> is_full_result_shown = true', () => {
      const resultBoxes = wrapper.find(ResultBox);

      expect(resultBoxes.at(0).props().is_full_result_shown).toBe(true);
      expect(resultBoxes.at(1).props().is_full_result_shown).toBe(false);
    });

    describe('and full_result_type is "passage"', () => {
      beforeEach(() => {
        const props_with_enriched_type = Object.assign({}, props, {
          full_result_index: props.index,
          full_result_type: 'passage'
        });

        wrapper = shallow(<ResultComparison {...props_with_enriched_type} />);
      });

      it('has the second <ResultBox /> is_full_result_shown = true', () => {
        const resultBoxes = wrapper.find(ResultBox);

        expect(resultBoxes.at(0).props().is_full_result_shown).toBe(false);
        expect(resultBoxes.at(1).props().is_full_result_shown).toBe(true);
      });

      it('has the full passage answer shown', () => {
        const resultBoxes = wrapper.find(ResultBox);

        expect(resultBoxes.at(1).props().result_text).toEqual('a great answer');
      });
    });
  });

  describe('when a full result is being shown', () => {
    let wrapper;
    const props_with_full_result = Object.assign({}, props, {
      full_result_index: 0,
      full_result_type: 'passage'
    });

    beforeEach(() => {
      wrapper = shallow(<ResultComparison {...props_with_full_result} />);
    });

    describe('and toggleFullResult is called with equal index and type', () => {
      beforeEach(() => {
        wrapper.instance().toggleFullResult(
          props_with_full_result.full_result_index,
          props_with_full_result.full_result_type
        )
      });

      it('calls onSetFullResult with -1 and null', () => {
        expect(onSetFullResultMock).toBeCalledWith(-1, null);
      });
    });

    describe('and toggleFullResult is called with a different index', () => {
      const my_index = 1;
      const expected_type = props_with_full_result.full_result_type;

      beforeEach(() => {
        wrapper.instance().toggleFullResult(
          my_index,
          props_with_full_result.full_result_type
        )
      });

      it('calls onSetFullResult with parameters', () => {
        expect(onSetFullResultMock).toBeCalledWith(my_index, expected_type);
      });
    });

    describe('and toggleFullResult is called with a different type', () => {
      const expected_index = props_with_full_result.full_result_index;
      const my_type = 'regular';

      beforeEach(() => {
        wrapper.instance().toggleFullResult(
          props_with_full_result.full_result_index,
          my_type
        )
      });

      it('calls onSetFullResult with parameters', () => {
        expect(onSetFullResultMock).toBeCalledWith(expected_index, my_type);
      });
    });
  });
});
