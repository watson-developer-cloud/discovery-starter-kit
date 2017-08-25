import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import SearchContainer from '../containers/SearchContainer/SearchContainer';
import PassagesContainer from '../containers/PassagesContainer/PassagesContainer';
import ErrorContainer from '../containers/ErrorContainer/ErrorContainer';
import ViewAllContainer from '../containers/ViewAllContainer/ViewAllContainer';
import { Icon } from 'watson-react-components';
import * as query from '../actions/query';
import * as questions from '../actions/questions';
import { shallow } from 'enzyme';

describe('<App />', () => {
  let wrapper;
  const questionsResponse = [
    'a question?',
    'another question?',
    'a third question?',
    'a fourth question?',
    'a fifth question?'
  ];
  const resultsResponse = {
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

  questions.default = jest.fn(() => {
    return Promise.resolve(questionsResponse);
  });
  query.default = jest.fn(() => {
    return Promise.resolve(resultsResponse);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('has no loading spinner, no view all, or results on initial load', () => {
    wrapper = shallow(<App />);
    expect(wrapper.find(Icon)).toHaveLength(0);
    expect(wrapper.find(PassagesContainer)).toHaveLength(0);
    expect(wrapper.find(ErrorContainer)).toHaveLength(0);
    expect(wrapper.find(ViewAllContainer)).toHaveLength(0);
  });

  it('passes expected props to the SearchContainer', () => {
    wrapper = shallow(<App />);
    const searchContainerProps = wrapper.find(SearchContainer).props();

    expect(searchContainerProps.errorMessage).toBeNull();
    expect(searchContainerProps.isFetchingQuestions).toBe(true);
    expect(searchContainerProps.isFetchingResults).toBe(false);
    expect(searchContainerProps.presetQueries).toEqual([]);
    expect(searchContainerProps.offset).toEqual(0);
  });

  describe('when toggleViewAll is invoked', () => {
    beforeEach(() => {
      wrapper = shallow(<App />);
      wrapper.instance().toggleViewAll();
    });

    it('shows the view all container with expected props', () => {
      const viewAllContainer = wrapper.find(ViewAllContainer);

      expect(viewAllContainer).toHaveLength(1);
      expect(viewAllContainer.props().isFetchingResults).toBe(false);
      expect(viewAllContainer.props().presetQueries).toEqual([]);
    });

    describe('and then the overlay is clicked', () => {
      beforeEach(() => {
        wrapper.find('.view_all_overlay--div').simulate('click');
      });

      it('hides the view all container', () => {
        expect(wrapper.find(ViewAllContainer)).toHaveLength(0);
      });
    });
  });

  describe('when question retrieval is successful', () => {
    beforeEach((done) => {
      wrapper = shallow(<App />);

      wrapper.instance().componentDidMount();
      // "wait" for response
      setTimeout(() => {
        done();
      }, 1);
    });

    it('passes expected props to the SearchContainer', () => {
      const searchContainerProps = wrapper.find(SearchContainer).props();

      expect(searchContainerProps.errorMessage).toBeNull();
      expect(searchContainerProps.isFetchingQuestions).toBe(false);
      expect(searchContainerProps.isFetchingResults).toBe(false);
      expect(searchContainerProps.presetQueries)
        .toEqual(expect.arrayContaining(questionsResponse));
      expect(searchContainerProps.offset).toEqual(0);
    });

    describe('and showViewAll is true', () => {
      beforeEach(() => {
        wrapper.setState({showViewAll: true});
      });

      it('passes expected props to the ViewAllContainer', () => {
        const viewAllContainer = wrapper.find(ViewAllContainer);

        expect(viewAllContainer).toHaveLength(1);
        expect(viewAllContainer.props().isFetchingResults).toBe(false);
        expect(viewAllContainer.props().presetQueries)
          .toEqual(expect.arrayContaining(questionsResponse));
      });
    });
  });

  describe('when question retrieval has an error', () => {
    beforeEach((done) => {
      // mock the fetch request to return an error
      questions.default = jest.fn(() => {
        return Promise.resolve({error: 'my bad'});
      });

      wrapper = shallow(<App />);
      wrapper.instance().componentDidMount();
      // "wait" for response
      setTimeout(() => {
        done();
      }, 1)
    });

    it('passes expected props to the SearchContainer', () => {
      const searchContainerProps = wrapper.find(SearchContainer).props();

      expect(searchContainerProps.errorMessage).toEqual('my bad');
      expect(searchContainerProps.isFetchingQuestions).toBe(false);
      expect(searchContainerProps.isFetchingResults).toBe(false);
      expect(searchContainerProps.presetQueries).toEqual([]);
    });
  });

  describe('when handleSearch is called with a query string', () => {
    beforeEach(() => {
      wrapper = shallow(<App />);
      wrapper.instance().handleSearch('my query');
    });

    it('shows a loading spinner', () => {
      expect(wrapper.find(Icon)).toHaveLength(1);
      expect(wrapper.find(PassagesContainer)).toHaveLength(0);
      expect(wrapper.find(ErrorContainer)).toHaveLength(0);
    });

    it('submits a query to the regular and enriched collections', () => {
      expect(query.default)
        .toBeCalledWith('enriched', {'natural_language_query': 'my query'});
      expect(query.default)
        .not.toBeCalledWith('enriched', {'filter': 'id:(1)'});
    });

    it('sets the search_input state to the input value', () => {
      expect(wrapper.instance().state.search_input).toEqual('my query');
    });

    describe('and the query is successful', () => {
      beforeEach((done) => {
        setTimeout(() => {
          done();
        }, 1)
      });

      it('shows the results container', () => {
        expect(wrapper.find(Icon)).toHaveLength(0);
        expect(wrapper.find(PassagesContainer)).toHaveLength(1);
        expect(wrapper.find(ErrorContainer)).toHaveLength(0);
      });
    });
  });

  describe('when handleSearch produces an error', () => {
    beforeEach((done) => {
      query.default = jest.fn(() => {
        return Promise.resolve({error: 'ouch'});
      });
      wrapper = shallow(<App />);
      wrapper.instance().handleSearch('my query');
      setTimeout(() => {
        done();
      }, 1);
    });

    it('shows the error container', () => {
      expect(wrapper.find(Icon)).toHaveLength(0);
      expect(wrapper.find(PassagesContainer)).toHaveLength(0);
      expect(wrapper.find(ErrorContainer)).toHaveLength(1);
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
    });
  });

  describe('onQuestionClick', () => {
    beforeEach((done) => {
      questions.default = jest.fn(() => {
        return Promise.resolve(questionsResponse);
      });
      wrapper = shallow(<App />);
      wrapper.instance().componentDidMount();
      // "wait" for response
      setTimeout(() => {
        done();
      }, 1);
    });

    describe('when invoked with a question being shown', () => {
      let originalState;
      let questionText;

      beforeEach(() => {
        originalState = Object.assign({}, wrapper.state());
        questionText = originalState.presetQueries[3];
        wrapper.instance().handleQuestionClick(questionText);
      });

      it('hides the view all container, keeps questions, and runs a search', () => {
        expect(wrapper.find(ViewAllContainer)).toHaveLength(0);
        expect(wrapper.state().search_input).toEqual(questionText);
        expect(wrapper.state().presetQueries).toEqual(originalState.presetQueries);
        expect(wrapper.state().offset).toEqual(originalState.offset);
        expect(query.default).toBeCalledWith('enriched', {
          natural_language_query: questionText
        });
      });
    });

    describe('when invoked with a question before the questions shown', () => {
      let questionText;

      beforeEach(() => {
        questionText = wrapper.state().presetQueries[1];
        wrapper.setState({offset: 4});
        wrapper.instance().handleQuestionClick(questionText);
      });

      it('pushes the question to the beginning and resets the offset', () => {
        expect(wrapper.state().presetQueries[0]).toEqual(questionText);
        expect(wrapper.state().offset).toEqual(0);
      });
    });

    describe('when invoked with a question after the questions shown', () => {
      let questionText;

      beforeEach(() => {
        questionText = wrapper.state().presetQueries[4];
        wrapper.instance().handleQuestionClick(questionText);
      });

      it('pushes the question to the beginning and resets the offset', () => {
        expect(wrapper.state().presetQueries[0]).toEqual(questionText);
        expect(wrapper.state().offset).toEqual(0);
      });
    });
  });
});
