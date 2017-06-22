import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../../../containers/SearchContainer/SearchContainer';
import QuestionBarContainer from '../../../containers/QuestionBarContainer/QuestionBarContainer';
import { TextInput } from 'watson-react-components';
import { shallow } from 'enzyme';

describe('<SearchContainer />', () => {
  const onSubmitMock = jest.fn();

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SearchContainer
        onSubmit={onSubmitMock}
        hasResults={false}
        isFetching={false}
      />, div);
  });

  it('has the Preset Queries shown on initial load', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}
                        isFetching={false}  />
                    );
    const questionBar = wrapper.find(QuestionBarContainer);
    expect(questionBar).toHaveLength(1);

    const presetQueries = questionBar.props().presetQueries;
    expect(presetQueries.length).toBeGreaterThan(0);
  });

  describe('when the Custom Query tab is pressed', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}
                        isFetching={false}  />
                    );

    beforeEach(() => {
      wrapper.find('.tab-panels--tab.base--a').at(1).simulate('click');
    });

    it('has the text search, icon, and submit button displayed', () => {
      expect(wrapper.find('.positioned--icon')).toHaveLength(1);
      expect(wrapper.find(TextInput)).toHaveLength(1);
      expect(wrapper.find('.white--button')).toHaveLength(1);
    });
  });

  describe('when a query is submitted', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}
                        isFetching={false}  />
                    );
    const text = 'my question';

    beforeEach(() => {
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
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
                  <SearchContainer
                    onSubmit={onSubmitMock}
                    hasResults={false}
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
