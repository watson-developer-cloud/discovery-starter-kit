import React from 'react';
import ReactDOM from 'react-dom';
import PassagesContainer from '../../../containers/PassagesContainer/PassagesContainer';
import PassageComparison from '../../../containers/PassagesContainer/PassageComparison';
import { shallow } from 'enzyme';

describe('<PassagesContainer />', () => {
  const enriched_results = {
    matching_results: 3,
    results: [
      {
        id: '1',
        text: 'a great answer with a great passage',
      },
      {
        id: '2',
        text: 'a great answer 2 with a great passage 2',
      },
      {
        id: '3',
        text: 'a great answer 3 with a great passage 3',
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
      <PassagesContainer
        enriched_results={enriched_results}
      />, div);
  });

  it('has 3 <PassageComparison /> in it', () => {
    const wrapper = shallow(<PassagesContainer
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.find(PassageComparison)).toHaveLength(3);
  });

  it('findPassageResult returns the full result given a document_id', () => {
    const wrapper = shallow(<PassagesContainer
                              enriched_results={enriched_results}
                            />);
    const document_id = enriched_results.passages[0].document_id;
    expect(wrapper.instance().findPassageResult(document_id))
      .toEqual(enriched_results.results[0]);
  });

  describe('when enriched_results has 0 results', () => {
    let wrapper;

    beforeEach(() => {
      const no_results_passages = {
        matching_results: 0,
        results: [],
        passages: []
      }
      wrapper = shallow(<PassagesContainer
                          enriched_results={no_results_passages}
                        />);
    });

    it('shows "No Results"', () => {
      expect(wrapper.find(PassageComparison)).toHaveLength(0);
      expect(wrapper.find('h2').text()).toEqual('No Results');
    });
  });

  describe('when more results exist than currently shown', () => {
    let wrapper;

    beforeEach(() => {
      const more_than_three_results = {
        matching_results: 4,
        results: [
          {
            id: '1',
            text: 'a great answer with a great passage',
          },
          {
            id: '2',
            text: 'a great answer 2 with a great passage 2',
          },
          {
            id: '3',
            text: 'a great answer 3 with a great passage 3',
          },
          {
            id: '4',
            text: 'a great answer 4 with a great passage 4',
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
          },
          {
            document_id: '4',
            passage_text: 'a great passage 4'
          }
        ]
      };
      wrapper = shallow(<PassagesContainer
                          enriched_results={more_than_three_results}
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
        expect(wrapper.find(PassageComparison)).toHaveLength(4);
      });

      it('does not show the "Show more results" button anymore', () => {
        expect(wrapper.find('.show_results--div button')).toHaveLength(0);
      });
    });
  });
});
