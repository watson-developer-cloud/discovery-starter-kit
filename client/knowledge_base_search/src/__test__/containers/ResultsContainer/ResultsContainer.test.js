import React from 'react';
import ReactDOM from 'react-dom';
import ResultsContainer from '../../../containers/ResultsContainer/ResultsContainer';
import ResultComparison from '../../../containers/ResultsContainer/ResultComparison';
import RelatedQuestions from '../../../containers/ResultsContainer/RelatedQuestions';
import { shallow } from 'enzyme';

describe('<ResultsContainer />', () => {
  const results = {
    matching_results: 1,
    results: [
      {
        answer: 'a good answer',
        question: {
          title: 'a question title'
        }
      }
    ]
  };
  const enriched_results = {
    matching_results: 1,
    results: [
      {
        answer: 'a great answer',
        question: {
          title: 'a question title'
        }
      }
    ],
    passages: [
      {
        document_id: '1',
        passage_text: 'a great passage',
        passage_score: 1.0
      }
    ]
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ResultsContainer
        results={results}
        enriched_results={enriched_results}
      />, div);
  });

  it('has 1 ResultComparison and 1 RelatedQuestions in it', () => {
    const wrapper = shallow(<ResultsContainer
                              results={results}
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.find(ResultComparison)).toHaveLength(1);
    expect(wrapper.find(RelatedQuestions)).toHaveLength(1);
  });

  it('passes enriched_results to the RelatedQuestions', () => {
    const wrapper = shallow(<ResultsContainer
                              results={results}
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.find(RelatedQuestions).props().results)
      .toEqual(enriched_results.results);
  });

  describe('when both result sets have 0 results', () => {
    let wrapper;

    beforeEach(() => {
      const no_results = {
        'matching_results': 0,
        'results': []
      };
      wrapper = shallow(<ResultsContainer
                          results={no_results}
                          enriched_results={no_results}
                        />);
    });

    it('shows "No Results"', () => {
      expect(wrapper.find(ResultComparison)).toHaveLength(0);
      expect(wrapper.find(RelatedQuestions)).toHaveLength(0);
      expect(wrapper.find('h2').text()).toEqual('No Results');
    });
  });

  describe('when enriched_results is empty', () => {
    let wrapper;

    beforeEach(() => {
      const no_enriched_results = {
        matching_results: 0,
        results: [],
        passages: []
      };
      wrapper = shallow(<ResultsContainer
                          results={results}
                          enriched_results={no_enriched_results}
                        />);
    });

    it('passes results to RelatedQuestions', () => {
      expect(wrapper.find(RelatedQuestions).props().results)
        .toEqual(results.results);
    });
  });

  describe('when more results exist than currently shown', () => {
    let wrapper;

    beforeEach(() => {
      const more_than_one_result = {
        'matching_results': 2,
        'results': [
          {
            'answer': 'a good answer'
          },
          {
            'answer': 'another good answer'
          }
        ]
      };
      wrapper = shallow(<ResultsContainer
                          results={more_than_one_result}
                          enriched_results={enriched_results}
                        />);
    });

    it('shows a "Show More Results" button', () => {
      expect(wrapper.find('.show_results--div button').text())
        .toEqual('Show More Results');
    });

    describe('when the "Show More Results" button is clicked', () => {
      beforeEach(() => {
        wrapper.find('.show_results--div button').simulate('click');
      });

      it('increments the total_results_shown', () => {
        expect(wrapper.instance().state.total_results_shown).toEqual(2);
      });

      it('shows more results', () => {
        expect(wrapper.find(ResultComparison)).toHaveLength(2);
        expect(wrapper.find(RelatedQuestions)).toHaveLength(1);
      });
    });
  });
});
