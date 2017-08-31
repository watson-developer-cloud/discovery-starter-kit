import React from 'react';
import ReactDOM from 'react-dom';
import TrainingComparison from '../../../containers/TrainingContainer/TrainingComparison';
import ResultContainer from '../../../containers/ResultContainer/ResultContainer';
import { shallow } from 'enzyme';

describe('<TrainingComparison />', () => {
  let wrapper;
  const props = {
    regularResult: {
      text: 'regular'
    },
    trainedResult: {
      text: 'trained'
    },
    index: 0
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TrainingComparison {...props} />, div);
  });

  it('has 2 <ResultContainer /> with titles', () => {
    wrapper = shallow(<TrainingComparison {...props} />);
    const titles = wrapper.find('h5');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).text()).toEqual('Standard search');
    expect(titles.at(1).text()).toEqual('Trained search');
    expect(wrapper.find(ResultContainer)).toHaveLength(2);
  });

  describe('when index is > 0', () => {
    const propsWithGreaterIndex = Object.assign({}, props, {
      index: 1
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingComparison {...propsWithGreaterIndex} />);
    });

    it('has 2 <ResultContainer /> with no titles', () => {
      expect(wrapper.find('h5')).toHaveLength(0);
      expect(wrapper.find(ResultContainer)).toHaveLength(2);
    });
  });
});
