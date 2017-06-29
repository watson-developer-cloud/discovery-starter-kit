import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import ResultsContainer from '../containers/ResultsContainer/ResultsContainer';
import ErrorContainer from '../containers/ErrorContainer/ErrorContainer';
import { Icon } from 'watson-react-components';
import * as query from '../actions/query';
import * as questions from '../actions/questions';
import { shallow } from 'enzyme';

describe('<App />', () => {
  questions.default = jest.fn(() => {
    return Promise.resolve([]);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('has no loading spinner or results on initial load', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Icon)).toHaveLength(0);
    expect(wrapper.find(ResultsContainer)).toHaveLength(0);
    expect(wrapper.find(ErrorContainer)).toHaveLength(0);
  });

  describe('when the query is loading', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<App />);
      wrapper.setState({fetching: true});
    });

    it('shows a loading spinner', () => {
      expect(wrapper.find(Icon)).toHaveLength(1);
      expect(wrapper.find(ResultsContainer)).toHaveLength(0);
      expect(wrapper.find(ErrorContainer)).toHaveLength(0);
    });
  });

  describe('when the query has loaded', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<App />);
      wrapper.setState({results_fetched: true});
    });

    describe('and results are returned', () => {
      beforeEach(() => {
        wrapper.setState({results: [{'key': 'value'}]});
      });

      it('shows the results container', () => {
        expect(wrapper.find(Icon)).toHaveLength(0);
        expect(wrapper.find(ResultsContainer)).toHaveLength(1);
        expect(wrapper.find(ErrorContainer)).toHaveLength(0);
      });
    });

    describe('and there is an error', () => {
      beforeEach(() => {
        wrapper.setState({results_error: 'error'});
      });

      it('shows the error container', () => {
        expect(wrapper.find(Icon)).toHaveLength(0);
        expect(wrapper.find(ResultsContainer)).toHaveLength(0);
        expect(wrapper.find(ErrorContainer)).toHaveLength(1);
      });
    });
  });

  describe('when handleSearch is called with a query string', () => {
    const response = {
      matching_results: 10,
      results: [
        {
          id: 1,
          answer: 'one'
        }
      ],
      passages: [
        {
          document_id: 1
        }
      ]
    };
    let wrapper;

    beforeEach(() => {
      query.default = jest.fn((fetch) => { return Promise.resolve(response); });
      wrapper = shallow(<App />);
      wrapper.instance().handleSearch('my query');
    });

    it('submits a query to the regular and enriched collections', () => {
      expect(query.default)
        .toBeCalledWith('enriched', {'natural_language_query': 'my query'});
      expect(query.default)
        .toBeCalledWith('regular', {'natural_language_query': 'my query'});
      expect(query.default)
        .not.toBeCalledWith('enriched', {'filter': 'id:(1)'});
    });

    it('sets the search_input state to the input value', () => {
      expect(wrapper.instance().state.search_input).toEqual('my query');
    });
  });

  describe('when retrieveMissingPassages contains only some passages', () => {
    const responseWithExtra = {
      matching_results: 10,
      results: [],
      passages: [
        {
          document_id: 1
        }
      ]
    };
    let wrapper;

    beforeEach(() => {
      query.default = jest.fn((fetch) => {
        return Promise.resolve(responseWithExtra);
      });
      wrapper = shallow(<App />);
      wrapper.instance().retrieveMissingPassages(responseWithExtra);
    });

    it('submits another query to the enriched collection for missing ids', () => {
      expect(query.default).toBeCalledWith('enriched', {'filter': 'id:(1)'});
    })
  });
});
