import React from 'react';
import ReactDOM from 'react-dom';
import TrainingContainer from '../../../containers/TrainingContainer/TrainingContainer';
import TrainingComparison from '../../../containers/TrainingContainer/TrainingComparison';
import ShowMoreResults from '../../../views/ShowMoreResults/ShowMoreResults';
import { shallow } from 'enzyme';

describe('<TrainingContainer />', () => {
  let wrapper;
  const props = {
    regularResults: {
      matching_results: 4,
      results: [
        {
          text: 'regular_1'
        },
        {
          text: 'regular_2'
        },
        {
          text: 'regular_3'
        },
        {
          text: 'regular_4'
        },
      ]
    },
    trainedResults: {
      matching_results: 4,
      results: [
        {
          text: 'trained_1'
        },
        {
          text: 'trained_2'
        },
        {
          text: 'trained_3'
        },
        {
          text: 'trained_4'
        }
      ]
    }
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
        results: props.regularResults.results.concat({ text: 'regular_5' })
      }
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
        results: props.trainedResults.results.concat({ text: 'trained_5' })
      }
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
