import React from 'react';
import ReactDOM from 'react-dom';
import RelatedQuestions from '../../../containers/ResultsContainer/RelatedQuestions';
import { shallow } from 'enzyme';

describe('<RelatedQuestions />', () => {
  const onSearchMock = jest.fn();
  const results = [
    {
      question: {
        title: 'My title'
      }
    }
  ];

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <RelatedQuestions
        results={results}
        onSearch={onSearchMock}
      />, div);
  });

  describe('when it has no results', () => {
    let wrapper;
    beforeEach(() => {
      const noResults = [];
      wrapper = shallow(
                  <RelatedQuestions
                    results={noResults}
                    onSearch={onSearchMock}
                  />
                );
    });

    it('has "No Related Questions"', () => {
      expect(wrapper.text()).toContain('No Related Questions');
    });
  });

  describe('when duplicate titles exist', () => {
    let wrapper;
    const duplicateQuestion = 'My duplicate question';

    beforeEach(() => {
      const duplicates = [
        { question: { title: 'first question' } },
        { question: { title: duplicateQuestion } },
        { question: { title: duplicateQuestion } }
      ];
      wrapper = shallow(
                  <RelatedQuestions
                    results={duplicates}
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
          question: {
            title: firstQuestion
          }
        },
        {
          question: {
            title: 'question 2'
          }
        },
        {
          question: {
            title: 'question 3 duplicate'
          }
        },
        {
          question: {
            title: 'question 3 duplicate'
          }
        },
        {
          question: {
            title: 'question 4'
          }
        },
        {
          question: {
            title: lastQuestion
          }
        },
        {
          question: {
            title: pastLastQuestion
          }
        }
      ];
      wrapper = shallow(
                  <RelatedQuestions
                    results={results}
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
