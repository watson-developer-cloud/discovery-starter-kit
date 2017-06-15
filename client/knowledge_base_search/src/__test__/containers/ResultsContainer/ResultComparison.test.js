import React from 'react';
import ReactDOM from 'react-dom';
import ResultComparison from '../../../containers/ResultsContainer/ResultComparison';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import FullResult from '../../../containers/ResultsContainer/FullResult';
import { shallow } from 'enzyme';

describe('<ResultComparison />', () => {
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

  it('has 2 <ResultBox />', () => {
    const wrapper = shallow(<ResultComparison {...props} />);

    expect(wrapper.find(ResultBox)).toHaveLength(2);
    expect(wrapper.find(FullResult)).toHaveLength(0);
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

    it('shows the FullResult with regular props passed in', () => {
      const fullResult = wrapper.find(FullResult);

      expect(fullResult).toHaveLength(1);
      expect(fullResult.props().answer).toEqual('a good answer');
    });

    describe('and full_result_type is "passage"', () => {
      beforeEach(() => {
        const props_with_enriched_type = Object.assign({}, props, {
          full_result_index: props.index,
          full_result_type: 'passage'
        });

        wrapper = shallow(<ResultComparison {...props_with_enriched_type} />);
      });

      it('has <FullResult /> with passage full result passed in', () => {
        const fullResult = wrapper.find(FullResult);

        expect(fullResult).toHaveLength(1);
        expect(fullResult.props().answer).toEqual('a great answer');
      });
    });
  });

  describe('when a full result is being shown', () => {
    let wrapper;
    const props_with_full_result = Object.assign({}, props, {
      full_result_index: 0,
      full_result_type: 'enriched'
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
