import React from 'react';
import ReactDOM from 'react-dom';
import ResultsContainer from '../../../containers/ResultsContainer/ResultsContainer';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import RelatedQuestions from '../../../containers/ResultsContainer/RelatedQuestions';
import { shallow } from 'enzyme';

describe('<ResultsContainer />', () => {
  const results = {
    'matching_results': 0,
    'results': [
      {
        'answer': 'a good answer'
      }
    ]
  };
  const enriched_results = {
    'matching_results': 0,
    'results': [
      {
        'answer': 'a great answer'
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

  it('has 2 ResultBox and 1 RelatedQuestions in it', () => {
    const wrapper = shallow(<ResultsContainer
                              results={results}
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.find(ResultBox)).toHaveLength(2);
    expect(wrapper.find(RelatedQuestions)).toHaveLength(1);
  });
});
