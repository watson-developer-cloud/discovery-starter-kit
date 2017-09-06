import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import ResultContainer from '../../../containers/ResultContainer/ResultContainer';

describe('<ResultContainer />', () => {
  const props = {
    resultText: 'result',
    resultRank: 1,
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultContainer {...props} />, div);
  });

  describe('when there is no result', () => {
    let wrapper;

    const propsNoResult = Object.assign({}, props, {
      resultText: null,
    });

    describe('and it is the first rank', () => {
      const firstRank = 1;

      beforeEach(() => {
        const propsWithFirstRank = Object.assign({}, propsNoResult, {
          resultRank: firstRank,
        });
        wrapper = shallow(<ResultContainer {...propsWithFirstRank} />);
      });

      it('has "No Results"', () => {
        const text = wrapper.text();
        expect(text).toContain('No Results');
      });
    });

    describe('and it is not the first rank', () => {
      beforeEach(() => {
        const propsWithNotFirstRank = Object.assign({}, propsNoResult, {
          resultRank: 2,
        });
        wrapper = shallow(<ResultContainer {...propsWithNotFirstRank} />);
      });

      it('does not have "No Results"', () => {
        const text = wrapper.text();
        expect(text).not.toContain('No Results');
      });
    });
  });
});
