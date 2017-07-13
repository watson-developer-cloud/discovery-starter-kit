import React from 'react';
import ReactDOM from 'react-dom';
import ResultsContainer from '../../../containers/ResultsContainer/ResultsContainer';
import ResultComparison from '../../../containers/ResultsContainer/ResultComparison';
import { shallow } from 'enzyme';

describe('<ResultsContainer />', () => {
  const results = {
    matching_results: 3,
    results: [
      {
        answer: 'a good answer'
      },
      {
        answer: 'a good answer 2'
      },
      {
        answer: 'a good answer 3'
      }
    ]
  };
  const enriched_results = {
    matching_results: 3,
    results: [
      {
        id: '1',
        answer: 'a great answer',
      },
      {
        id: '2',
        answer: 'a great answer 2',
      },
      {
        id: '3',
        answer: 'a great answer 3',
      }
    ],
    passages: [
      {
        document_id: '1',
        passage_text: 'a great passage'
      },
      {
        document_id: '2',
        passage_text: 'a great passage 2'
      },
      {
        document_id: '3',
        passage_text: 'a great passage 3'
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

  it('has 3 ResultComparison in it', () => {
    const wrapper = shallow(<ResultsContainer
                              results={results}
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.find(ResultComparison)).toHaveLength(3);
  });

  it('findPassageResult returns the full result given a passage', () => {
    const wrapper = shallow(<ResultsContainer
                              results={results}
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.instance().findPassageResult(enriched_results.passages[0]))
      .toEqual(enriched_results.results[0]);
  });

  describe('when both result sets have 0 results', () => {
    let wrapper;

    beforeEach(() => {
      const no_results = {
        matching_results: 0,
        results: []
      };
      const no_results_passages = {
        matching_results: 0,
        results: [],
        passages: []
      }
      wrapper = shallow(<ResultsContainer
                          results={no_results}
                          enriched_results={no_results_passages}
                        />);
    });

    it('shows "No Results"', () => {
      expect(wrapper.find(ResultComparison)).toHaveLength(0);
      expect(wrapper.find('h2').text()).toEqual('No Results');
    });
  });

  describe('when more results exist than currently shown', () => {
    let wrapper;

    beforeEach(() => {
      const more_than_one_result = {
        matching_results: 4,
        results: [
          {
            answer: 'a good answer'
          },
          {
            answer: 'a good answer 2'
          },
          {
            answer: 'a good answer 3'
          },
          {
            answer: 'a good answer 4'
          }
        ]
      };
      wrapper = shallow(<ResultsContainer
                          results={more_than_one_result}
                          enriched_results={enriched_results}
                        />);
    });

    it('shows a "Show more results" button', () => {
      expect(wrapper.find('.show_results--div button').text())
        .toEqual('Show more results');
    });

    describe('when the "Show more results" button is clicked', () => {
      beforeEach(() => {
        wrapper.find('.show_results--div button').simulate('click');
      });

      it('increments the total_results_shown', () => {
        expect(wrapper.instance().state.total_results_shown).toEqual(4);
      });

      it('shows more results', () => {
        expect(wrapper.find(ResultComparison)).toHaveLength(4);
      });

      it('does not show the "Show more results" button anymore', () => {
        expect(wrapper.find('.show_results--div button')).toHaveLength(0);
      });
    });
  });

  describe('when there are more passages than results', () => {
    let wrapper;

    beforeEach(() => {
      const more_than_one_passage = {
        matching_results: 1,
        results: [
          {
            answer: 'a great answer'
          }
        ],
        passages: [
          {
            document_id: '1',
            passage_text: 'a great passage'
          },
          {
            document_id: '2',
            passage_text: 'another great passage'
          },
          {
            document_id: '3',
            passage_text: 'another great passage'
          },
          {
            document_id: '4',
            passage_text: 'another great passage'
          }
        ]
      };

      wrapper = shallow(<ResultsContainer
                          results={results}
                          enriched_results={more_than_one_passage}
                        />);
    });

    it('shows the "Show More Results" button', () => {
      const buttonSelector = '.show_results--div button';
      const showMoreButton = wrapper.find(buttonSelector);
      expect(showMoreButton).toHaveLength(1);

      showMoreButton.simulate('click');

      expect(wrapper.find(buttonSelector)).toHaveLength(0);
    });
  });
});
