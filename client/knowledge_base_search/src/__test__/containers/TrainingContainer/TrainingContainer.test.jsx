import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import TrainingContainer from '../../../containers/TrainingContainer/TrainingContainer';
import TrainingComparison from '../../../containers/TrainingContainer/TrainingComparison';
import ShowMoreResults from '../../../views/ShowMoreResults/ShowMoreResults';

describe('<TrainingContainer />', () => {
  let wrapper;
  const props = {
    regularResults: {
      matching_results: 4,
      results: [
        {
          id: '1',
          text: 'regular_1',
        },
        {
          id: '2',
          text: 'regular_2',
        },
        {
          id: '3',
          text: 'regular_3',
        },
        {
          id: '4',
          text: 'regular_4',
        },
      ],
    },
    trainedResults: {
      matching_results: 4,
      results: [
        {
          id: '2',
          text: 'trained_1',
        },
        {
          id: '1',
          text: 'trained_2',
        },
        {
          id: '5',
          text: 'trained_3',
        },
        {
          id: '3',
          text: 'trained_4',
        },
      ],
    },
    searchContainerHeight: 0,
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TrainingContainer {...props} />, div);
  });

  it('has 3 <TrainingComparison /> and 1 <ShowMoreResults />', () => {
    wrapper = shallow(<TrainingContainer {...props} />);

    expect(wrapper.find(TrainingComparison)).toHaveLength(3);
    expect(wrapper.find(ShowMoreResults)).toHaveLength(1);
  });

  describe('original rank', () => {
    beforeEach(() => {
      wrapper = shallow(<TrainingContainer {...props} />);
    });

    it('passes expected original rank for the first trained result', () => {
      const firstResult = wrapper.find(TrainingComparison).at(0).props().trainedResult;

      expect(firstResult.originalRank).toEqual(2);
    });

    it('passes expected original rank for the third trained result', () => {
      const firstResult = wrapper.find(TrainingComparison).at(2).props().trainedResult;

      expect(firstResult.originalRank).toEqual(0);
    });
  });

  describe('when <ShowMoreResults /> is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<TrainingContainer {...props} />);
      wrapper.find(ShowMoreResults).simulate('click');
    });

    it('has 4 <TrainingComparison /> and 0 <ShowMoreResults />', () => {
      expect(wrapper.find(TrainingComparison)).toHaveLength(4);
      expect(wrapper.find(ShowMoreResults)).toHaveLength(0);
    });
  });

  describe('when regularResults > trainedResults', () => {
    const propsMoreRegular = Object.assign({}, props, {
      regularResults: {
        matching_results: 5,
        results: props.regularResults.results.concat({ text: 'regular_5' }),
      },
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingContainer {...propsMoreRegular} />);
    });

    describe('and the <ShowMoreResults /> is clicked', () => {
      beforeEach(() => {
        wrapper.find(ShowMoreResults).simulate('click');
      });

      it('has 4 <TrainingComparison /> and 1 <ShowMoreResults />', () => {
        expect(wrapper.find(TrainingComparison)).toHaveLength(4);
        expect(wrapper.find(ShowMoreResults)).toHaveLength(1);
      });
    });
  });

  describe('when trainedResults > regularResults', () => {
    const propsMoreRegular = Object.assign({}, props, {
      trainedResults: {
        matching_results: 5,
        results: props.trainedResults.results.concat({ text: 'trained_5' }),
      },
    });

    beforeEach(() => {
      wrapper = shallow(<TrainingContainer {...propsMoreRegular} />);
    });

    describe('and the <ShowMoreResults /> is clicked', () => {
      beforeEach(() => {
        wrapper.find(ShowMoreResults).simulate('click');
      });

      it('has 4 <TrainingComparison /> and 1 <ShowMoreResults />', () => {
        expect(wrapper.find(TrainingComparison)).toHaveLength(4);
        expect(wrapper.find(ShowMoreResults)).toHaveLength(1);
      });
    });
  });
});
