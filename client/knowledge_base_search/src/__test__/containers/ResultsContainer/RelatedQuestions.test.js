import React from 'react';
import ReactDOM from 'react-dom';
import RelatedQuestions from '../../../containers/ResultsContainer/RelatedQuestions';
import { shallow } from 'enzyme';

describe('<RelatedQuestions />', () => {
  const onSearchMock = jest.fn();
  const enriched_results = [
    {
      title: 'My title'
    }
  ];

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <RelatedQuestions
        enriched_results={enriched_results}
        onSearch={onSearchMock}
      />, div);
  });

  describe('when duplicate titles exist', () => {
    let wrapper;
    const duplicateQuestion = 'My duplicate question';

    beforeEach(() => {
      const duplicates = [
        { title: 'first question'},
        { title: duplicateQuestion },
        { title: duplicateQuestion }
      ];
      wrapper = shallow(
                  <RelatedQuestions
                    enriched_results={duplicates}
                    onSearch={onSearchMock}
                  />
                );
    });

    it('removes the duplicate titles', () => {
      expect(wrapper.find('button[value="' + duplicateQuestion + '"]'))
        .toHaveLength(1);
    });
  });

  describe('when showing related questions', () => {
    let wrapper;
    const firstQuestion = 'first question';
    const lastQuestion = 'question 5';
    const pastLastQuestion = 'question 6';

    beforeEach(() => {
      const results = [
        {
          title: firstQuestion
        },
        {
          title: 'question 2'
        },
        {
          title: 'question 3 duplicate'
        },
        {
          title: 'question 3 duplicate'
        },
        {
          title: 'question 4'
        },
        {
          title: lastQuestion
        },
        {
          title: pastLastQuestion
        }
      ];
      wrapper = shallow(
                  <RelatedQuestions
                    enriched_results={results}
                    onSearch={onSearchMock}
                  />
                );
    });

    it('does not show the first question', () => {
      expect(wrapper.find('button[value="' + firstQuestion + '"]'))
        .toHaveLength(0);
    });

    it('has max_related_questions number of question buttons', () => {
      expect(wrapper.find('button'))
        .toHaveLength(RelatedQuestions.defaultProps.max_related_questions);
    });

    it('contains the last question', () => {
      expect(wrapper.find('button[value="' + lastQuestion + '"]'))
        .toHaveLength(1);
    });

    it('does not contain questions past the lastQuestion', () => {
      expect(wrapper.find('button[value="' + pastLastQuestion + '"]'))
        .toHaveLength(0);
    });

    describe('when a button is clicked', () => {
      beforeEach(() => {
        wrapper.find('button[value="' + lastQuestion + '"]')
          .simulate('click', { target: { value: lastQuestion } } );
      });

      it('calls onSearch with the question', () => {
        expect(onSearchMock).toBeCalledWith(lastQuestion);
      });
    });
  });
});
