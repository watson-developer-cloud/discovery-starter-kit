import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import TrainingComparison from '../../../containers/TrainingContainer/TrainingComparison';
import ResultContainer from '../../../containers/ResultContainer/ResultContainer';

describe('<TrainingComparison />', () => {
  let wrapper;
  const props = {
    regularResult: {
      text: 'regular',
    },
    trainedResult: {
      text: 'trained',
      originalRank: 2,
    },
    index: 0,
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
      index: 1,
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingComparison {...propsWithGreaterIndex} />);
    });

    it('has 2 <ResultContainer /> with no titles', () => {
      expect(wrapper.find('h5')).toHaveLength(0);
      expect(wrapper.find(ResultContainer)).toHaveLength(2);
    });
  });

  describe('when the trainingRank is better than the originalRank', () => {
    const propsWithGreaterTrainingRank = Object.assign({}, props, {
      index: 0,
      trainedResult: {
        text: '',
        originalRank: 2,
      },
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingComparison {...propsWithGreaterTrainingRank} />);
    });

    it('says that Watson moved the rank up', () => {
      const rankDisplay = wrapper.find('.training_comparison--rank-up');
      expect(rankDisplay).toHaveLength(1);
    });
  });


  describe('when the originalRank is better than the trainingRank', () => {
    const propsWithGreaterOriginalRank = Object.assign({}, props, {
      index: 2,
      trainedResult: {
        text: '',
        originalRank: 1,
      },
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingComparison {...propsWithGreaterOriginalRank} />);
    });

    it('says that Watson moved the rank down', () => {
      const rankDisplay = wrapper.find('.training_comparison--rank-down');
      expect(rankDisplay).toHaveLength(1);
    });
  });

  describe('when the originalRank is equal to the trainingRank', () => {
    const propsWithEqualRanks = Object.assign({}, props, {
      index: 1,
      trainedResult: {
        text: '',
        originalRank: 2,
      },
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingComparison {...propsWithEqualRanks} />);
    });

    it('does not have a rerank message', () => {
      const rankUpDisplay = wrapper.find('.training_comparison--rank-up');
      const rankDownDisplay = wrapper.find('.training_comparison--rank-down');
      expect(rankUpDisplay).toHaveLength(0);
      expect(rankDownDisplay).toHaveLength(0);
    });
  });
});
