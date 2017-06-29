import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../../../containers/SearchContainer/SearchContainer';
import QuestionBarContainer from '../../../containers/QuestionBarContainer/QuestionBarContainer';
import ErrorContainer from '../../../containers/ErrorContainer/ErrorContainer';
import { TextInput, Icon } from 'watson-react-components';
import { shallow } from 'enzyme';
import * as questions from '../../../actions/questions';

describe('<SearchContainer />', () => {
  let wrapper;
  const onSubmitMock = jest.fn();
  const response = [
    'a question?',
    'another question?'
  ];
  // mock the fetch request to return mock data
  questions.default = jest.fn(() => {
    return Promise.resolve(response);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SearchContainer
        onSubmit={onSubmitMock}
        isFetching={false}
      />, div);
  });

  describe('when it is fetchingQuestions', () => {
    beforeEach(() => {
      wrapper = shallow(
                        <SearchContainer
                          onSubmit={onSubmitMock}
                          isFetching={false}  />
                      );

      wrapper.instance().componentDidMount();
      // don't wait
    });

    it('shows the loading spinner', () => {
      expect(wrapper.find({ type: 'loader' })).toHaveLength(1);
      expect(wrapper.find(QuestionBarContainer)).toHaveLength(0);
    });
  });


  describe('when it has fetched questions', () => {
    describe('and results are present', () => {
      beforeEach((done) => {
        wrapper = shallow(
                    <SearchContainer
                      onSubmit={onSubmitMock}
                      isFetching={false}  />
                  );
        wrapper.instance().componentDidMount();
        // "wait" for response
        setTimeout(() => {
          done();
        }, 1)
      });

      it('shows the QuestionBarContainer with expected props', () => {
        const questionBar = wrapper.find(QuestionBarContainer);

        expect(questionBar).toHaveLength(1);
        expect(questionBar.props().currentQuery).toEqual('');
        expect(questionBar.props().presetQueries)
          .toEqual(expect.arrayContaining(response));
        expect(questionBar.props().isFetching).toBe(false);
      });
    });

    describe('and an error is present', () => {
      beforeEach((done) => {
        // mock the fetch request to return an error
        questions.default = jest.fn(() => {
          return Promise.resolve({error: 'my bad'});
        });

        wrapper = shallow(
                  <SearchContainer
                    onSubmit={onSubmitMock}
                    isFetching={false}  />
                );
        wrapper.instance().componentDidMount();
        // "wait" for response
        setTimeout(() => {
          done();
        }, 1)
      });

      it('shows an ErrorContainer', () => {
        const errorContainer = wrapper.find(ErrorContainer);

        expect(errorContainer).toHaveLength(1);
        expect(errorContainer.props().errorMessage).toEqual('my bad');
      });
    });
  });

  describe('when the Custom Query tab is pressed', () => {
    beforeEach(() => {
      wrapper = shallow(
                  <SearchContainer
                    onSubmit={onSubmitMock}
                    isFetching={false}  />
                );
      wrapper.find('.tab-panels--tab.base--a').at(1).simulate('click');
    });

    it('has the text search, icon, and submit button displayed', () => {
      expect(wrapper.find('.positioned--icon')).toHaveLength(1);
      expect(wrapper.find(TextInput)).toHaveLength(1);
      expect(wrapper.find('.white--button')).toHaveLength(1);
    });
  });

  describe('when a query is submitted', () => {
    const text = 'my question';

    beforeEach(() => {
      wrapper = shallow(
                  <SearchContainer
                    onSubmit={onSubmitMock}
                    isFetching={false}  />
                );
      wrapper.setState({search_input: text});
    });

    describe('and the form is submitted', () => {
      beforeEach(() => {
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
      });

      it('calls onSubmit with the text', () => {
        expect(onSubmitMock).toBeCalledWith(text);
      });
    });
  });

  describe('when isFetching is true', () => {
    beforeEach(() => {
      wrapper = shallow(
                  <SearchContainer
                    onSubmit={onSubmitMock}
                    isFetching={true}  />
                );
    });

    it('passes "true" to the QuestionBarContainer', () => {
      expect(wrapper.find(QuestionBarContainer).props().isFetching).toBe(true);
    });

    describe('and the Custom Query tab is selected', () => {
      beforeEach(() => {
        wrapper.find('.tab-panels--tab.base--a').at(1).simulate('click');
      });

      it('disables all the inputs', () => {
        expect(wrapper.find(TextInput).props().disabled).toBe(true);
        expect(wrapper.find('.white--button').props().disabled).toBe(true);
      });
    });
  });
});
