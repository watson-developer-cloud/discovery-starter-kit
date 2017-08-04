import React from 'react';
import ReactDOM from 'react-dom';
import ResultContainer from '../../../containers/ResultContainer/ResultContainer';
import { shallow } from 'enzyme';

describe('<ResultContainer />', () => {
  const props = {
    result_text: 'result',
    result_rank: 1
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultContainer {...props} />, div);
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
        wrapper = shallow(<ResultContainer {...props_with_first_rank} />);
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
        wrapper = shallow(<ResultContainer {...props_with_not_first_rank} />);
      });

      it('does not have "No Results"', () => {
        const text = wrapper.text();
        expect(text).not.toContain('No Results');
      });
    });
  });
});
