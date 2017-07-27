import React from 'react';
import ReactDOM from 'react-dom';
import ResultComparison from '../../../containers/ResultsContainer/ResultComparison';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultComparison />', () => {
  let wrapper;
  const props = {
    passages: [
      {
        document_id: '1',
        passage_text: 'a passage',
        rank: 0
      },
      {
        document_id: '1',
        passage_text: 'another passage',
        rank: 1
      }
    ],
    passageFullResult: {
      id: '1',
      text: 'a good answer with a passage and another passage'
    },
    index: 0
  }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultComparison {...props} />, div);
  });

  it('has 2 <ResultBox /> with expected text containing highlighted passages', () => {
    wrapper = shallow(<ResultComparison {...props} />);

    const resultBoxes = wrapper.find(ResultBox);
    const expectedAnswer = props.passageFullResult.text;
    const expectedPassage = (
                              <span key={'text_with_highlights_1'}>
                                {'a good answer with '}
                                <span key={'passage_1'}>
                                  <span className='passage_rank--span'>
                                    {1}
                                  </span>
                                  <b>a passage</b>
                                </span>
                                <span key={'text_with_highlights_2'}>
                                  {' and '}
                                  <span key={'passage_2'}>
                                    <span className='passage_rank--span'>
                                      {2}
                                    </span>
                                    <b>another passage</b>
                                  </span>
                                  {''}
                                </span>
                              </span>
                            );
    expect(resultBoxes).toHaveLength(2);
    expect(resultBoxes.at(0).props().result_text).toEqual(expectedAnswer);
    expect(resultBoxes.at(1).props().result_text).toEqual(expectedPassage);
  });

  it('has 2 titles', () => {
    wrapper = shallow(<ResultComparison {...props} />);

    const titles = wrapper.find('.results_comparison_content--div h5');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).text()).toEqual('Standard search');
    expect(titles.at(1).text()).toEqual('Passage search');
  });

  describe('when index is not 0', () => {
    beforeEach(() => {
      const props_with_nonzero_index = Object.assign({}, props, {
        index: 1
      });

      wrapper = shallow(<ResultComparison {...props_with_nonzero_index} />);
    });

    it('does not show titles', () => {
      const titles = wrapper.find('.results_comparison_header--div h4');

      expect(titles).toHaveLength(0);
      expect(wrapper.text()).not.toContain('Standard Search');
      expect(wrapper.text()).not.toContain('Passage Search');
    });
  });

  describe('when calling highlightPassage', () => {
    describe('and there is only one passage', () => {
      const passage = {
        passage_text: 'a passage',
        rank: 0
      };
      const fullResult = 'a good answer with a passage and another passage';

      it('returns expected html', () => {
        const expectedHtml = (
                                <span key={'text_with_highlights_1'}>
                                  {'a good answer with '}
                                  <span key={'passage_1'}>
                                    <span className='passage_rank--span'>
                                      {1}
                                    </span>
                                    <b>a passage</b>
                                  </span>
                                  {' and another passage'}
                                </span>
                             );
        const actual = wrapper.instance().highlightPassage(passage, fullResult);
        expect(actual).toEqual(expectedHtml);
      });
    });
  });
});
