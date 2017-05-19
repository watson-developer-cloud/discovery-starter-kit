import React from 'react';
import ReactDOM from 'react-dom';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultBox />', () => {
  const onShowFullAnswerMock = jest.fn();
  const result = {
    'answer': 'result',
    'score': 1.0
  };
  const result_type = 'result type';

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ResultBox
        result={result}
        result_type={result_type}
        onShowFullAnswer={onShowFullAnswerMock}
      />, div);
  });

  describe('when the result exceeds the max_length', () => {
    const long_result = Object.assign({}, result, {
      'answer': Array(ResultBox.defaultProps.max_length + 2).join('a')
    });

    it('trims the result and adds an ellipsis', () => {
      const wrapper = shallow(
                        <ResultBox
                          result={long_result}
                          result_type={result_type}
                          onShowFullAnswer={onShowFullAnswerMock}
                        />
                      );
      const resultText = wrapper.find('.result_answer_snippet--div').text();
      expect(resultText.length).toEqual(ResultBox.defaultProps.max_length + 1);
      expect(resultText).toContain('…');
    });
  });

  describe('when the score exceeds the decimal_places', () => {
    const really_precise_score_result = Object.assign({}, result, {
      'score': 5.012345
    });

    it('rounds the score', () => {
      const wrapper = shallow(
                        <ResultBox
                          result={really_precise_score_result}
                          result_type={result_type}
                          onShowFullAnswer={onShowFullAnswerMock}
                        />
                      );
      const scoreText = wrapper.find('.result_rank_right--div').text();
      expect(scoreText).toEqual('Relevance Score 5.01');
    });
  });

  describe('when the "See full answer" button is clicked', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
                  <ResultBox
                    result={result}
                    result_type={result_type}
                    onShowFullAnswer={onShowFullAnswerMock}
                  />
                );
      wrapper.find('.result_full_answer--div button').simulate('click');
    });

    it('calls the onShowFullAnswer method', () => {
      expect(onShowFullAnswerMock).toBeCalled();
    });
  });
});
