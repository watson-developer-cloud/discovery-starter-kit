import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { Icon } from 'watson-react-components';
import App from '../App';
import SearchContainer from '../containers/SearchContainer/SearchContainer';
import PassagesContainer from '../containers/PassagesContainer/PassagesContainer';
import TrainingContainer from '../containers/TrainingContainer/TrainingContainer';
import ErrorContainer from '../containers/ErrorContainer/ErrorContainer';
import ViewAllContainer from '../containers/ViewAllContainer/ViewAllContainer';
import FeatureSelect from '../containers/SearchContainer/FeatureSelect';
import * as query from '../actions/query';
import * as questions from '../actions/questions';


describe('<App />', () => {
  let wrapper;
  const questionsResponse = [
    {
      question: 'a question?',
    },
    {
      question: 'another question?',
    },
    {
      question: 'a third question?',
    },
    {
      question: 'a fourth question?',
    },
    {
      question: 'a fifth question?',
    },
  ];
  const passagesResponse = {
    matching_results: 10,
    results: [
      {
        id: '1',
        text: 'one',
      },
    ],
    passages: [
      {
        document_id: '1',
        passage_text: 'passage',
      },
    ],
  };

  questions.default = jest.fn(() => Promise.resolve(questionsResponse));
  query.default = jest.fn(() => Promise.resolve(passagesResponse));

  function selectFeature(type) {
    wrapper.instance().handleFeatureSelect({
      target: {
        value: type.value,
      },
    });
  }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('has no loading spinner, no view all, or results on initial load', () => {
    wrapper = shallow(<App />);
    expect(wrapper.find(Icon)).toHaveLength(0);
    expect(wrapper.find(PassagesContainer)).toHaveLength(0);
    expect(wrapper.find(TrainingContainer)).toHaveLength(0);
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

  describe('when retrieveQuestions is successful', () => {
    beforeEach((done) => {
      wrapper = shallow(<App />);

      wrapper.instance().retrieveQuestions(wrapper.state().selectedFeature);
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
        wrapper.setState({ showViewAll: true });
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

  describe('when retrieveQuestions has an error', () => {
    beforeEach((done) => {
      // mock the fetch request to return an error
      questions.default = jest.fn(() => Promise.resolve({ error: 'my bad' }));

      wrapper = shallow(<App />);
      wrapper.instance().retrieveQuestions(wrapper.state().selectedFeature);
      // "wait" for response
      setTimeout(() => {
        done();
      }, 1);
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

    it('calls the query action', () => {
      expect(query.default)
        .toBeCalledWith('passages', { natural_language_query: 'my query' });
    });

    it('sets the search_input state to the input value', () => {
      expect(wrapper.instance().state.search_input).toEqual('my query');
    });

    describe('and the query is successful', () => {
      beforeEach((done) => {
        // "wait" for response
        setTimeout(() => {
          done();
        }, 1);
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
      query.default = jest.fn(() => Promise.resolve({ error: 'ouch' }));
      wrapper = shallow(<App />);
      wrapper.instance().handleSearch('my query');
      setTimeout(() => {
        done();
      }, 1);
    });

    it('shows the error container', () => {
      expect(wrapper.find(Icon)).toHaveLength(0);
      expect(wrapper.find(PassagesContainer)).toHaveLength(0);
      expect(wrapper.find(TrainingContainer)).toHaveLength(0);
      expect(wrapper.find(ErrorContainer)).toHaveLength(1);
    });
  });

  describe('when the passage search contains only some of the source documents', () => {
    const responseWithExtra = {
      matching_results: 10,
      results: [],
      passages: [
        {
          document_id: '1',
          passage_text: 'passage',
        },
      ],
    };

    beforeEach((done) => {
      query.default = jest.fn(() => Promise.resolve(responseWithExtra));
      wrapper = shallow(<App />);
      wrapper.instance().handleSearch('foo');
      // "wait" for response
      setTimeout(() => {
        done();
      }, 1);
    });

    it('submits another query to the passages collection to retrieve missing documents', () => {
      expect(query.default).toBeCalledWith('passages', { filter: 'id:(1)' });
    });
  });

  describe('onQuestionClick', () => {
    beforeEach((done) => {
      questions.default = jest.fn(() => Promise.resolve(questionsResponse));
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
        questionText = originalState.presetQueries[3].question;
        wrapper.instance().handleQuestionClick(questionText);
      });

      it('hides the view all container, keeps questions, and runs a search', () => {
        expect(wrapper.find(ViewAllContainer)).toHaveLength(0);
        expect(wrapper.state().search_input).toEqual(questionText);
        expect(wrapper.state().presetQueries).toEqual(originalState.presetQueries);
        expect(wrapper.state().offset).toEqual(originalState.offset);
        expect(query.default).toBeCalledWith('passages', {
          natural_language_query: questionText,
        });
      });
    });

    describe('when invoked with a question before the questions shown', () => {
      let questionText;

      beforeEach(() => {
        questionText = wrapper.state().presetQueries[1].question;
        wrapper.setState({ offset: 4 });
        wrapper.instance().handleQuestionClick(questionText);
      });

      it('pushes the question to the beginning and resets the offset', () => {
        expect(wrapper.state().presetQueries[0].question).toEqual(questionText);
        expect(wrapper.state().offset).toEqual(0);
      });
    });

    describe('when invoked with a question after the questions shown', () => {
      let questionText;

      beforeEach(() => {
        questionText = wrapper.state().presetQueries[4].question;
        wrapper.instance().handleQuestionClick(questionText);
      });

      it('pushes the question to the beginning and resets the offset', () => {
        expect(wrapper.state().presetQueries[0].question).toEqual(questionText);
        expect(wrapper.state().offset).toEqual(0);
      });
    });
  });

  describe('when "Passages" feature is selected', () => {
    beforeEach(() => {
      wrapper = shallow(<App />);
      selectFeature(FeatureSelect.featureTypes.PASSAGES);
    });

    it('sets the selectedFeature to "passages"', () => {
      expect(wrapper.instance().state.selectedFeature)
        .toEqual(FeatureSelect.featureTypes.PASSAGES.value);
    });

    describe('and retrieveQuestions is invoked', () => {
      beforeEach((done) => {
        questions.default.mockClear();
        wrapper.instance().retrieveQuestions(wrapper.state().selectedFeature);
        // "wait" for response
        setTimeout(() => {
          done();
        }, 1);
      });

      it('fetches the passages questions', () => {
        expect(questions.default).toBeCalledWith(FeatureSelect.featureTypes.PASSAGES.value);
      });
    });

    describe('and handleSearch is called with a query string', () => {
      beforeEach(() => {
        query.default.mockClear();
        wrapper.instance().handleSearch('my query');
      });

      it('submits a query to the passages collection', () => {
        expect(query.default)
          .toBeCalledWith('passages', { natural_language_query: 'my query' });
        expect(query.default)
          .not.toBeCalledWith('trained', { natural_language_query: 'my query' });
        expect(query.default)
          .not.toBeCalledWith('regular', { natural_language_query: 'my query' });
      });

      describe('and the query is successful', () => {
        beforeEach((done) => {
          // "wait" for response
          setTimeout(() => {
            done();
          }, 1);
        });

        it('shows the passages container', () => {
          expect(wrapper.find(Icon)).toHaveLength(0);
          expect(wrapper.find(PassagesContainer)).toHaveLength(1);
          expect(wrapper.find(TrainingContainer)).toHaveLength(0);
          expect(wrapper.find(ErrorContainer)).toHaveLength(0);
        });
      });
    });
  });

  describe('when "Relevancy" feature is selected', () => {
    beforeEach(() => {
      wrapper = shallow(<App />);
      selectFeature(FeatureSelect.featureTypes.TRAINED);
    });

    it('sets the selectedFeature to "trained"', () => {
      expect(wrapper.instance().state.selectedFeature)
        .toEqual(FeatureSelect.featureTypes.TRAINED.value);
    });

    describe('and retrieveQuestions is invoked', () => {
      beforeEach((done) => {
        questions.default.mockClear();
        wrapper.instance().retrieveQuestions(wrapper.state().selectedFeature);
        // "wait" for response
        setTimeout(() => {
          done();
        }, 1);
      });

      it('fetches the trained questions', () => {
        expect(questions.default).toBeCalledWith(FeatureSelect.featureTypes.TRAINED.value);
      });
    });

    describe('and handleSearch is called with a query string', () => {
      beforeEach(() => {
        query.default.mockClear();
        wrapper.instance().handleSearch('my query');
      });

      it('submits a query to the trained collection', () => {
        expect(query.default)
          .toBeCalledWith('trained', { natural_language_query: 'my query' });
        expect(query.default)
          .not.toBeCalledWith('passages', { natural_language_query: 'my query' });
      });

      describe('and the query is successful', () => {
        beforeEach((done) => {
          // "wait" for response
          setTimeout(() => {
            done();
          }, 1);
        });

        it('shows the training container', () => {
          expect(wrapper.find(Icon)).toHaveLength(0);
          expect(wrapper.find(PassagesContainer)).toHaveLength(0);
          expect(wrapper.find(TrainingContainer)).toHaveLength(1);
          expect(wrapper.find(ErrorContainer)).toHaveLength(0);
        });
      });
    });
  });
});
