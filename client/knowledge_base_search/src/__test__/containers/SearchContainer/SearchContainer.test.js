import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../../../containers/SearchContainer/SearchContainer';
import { TextInput } from 'watson-react-components';
import { shallow, mount } from 'enzyme';
import { Pane } from 'watson-react-components';

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

  it('has the random query buttons displayed on initial load', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}
                        isFetching={false}  />
                    );
    expect(wrapper.find('.clickable-tabs')).toHaveLength(1);
    expect(wrapper.find('.clickable-tab')).toHaveLength(5);
  });

  describe('when the Custom Query tab is pressed', () => {
    const wrapper = mount(
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
      expect(wrapper.find('.text-input--input')).toHaveLength(1);
      expect(wrapper.find('.white--button')).toHaveLength(1);
    });
  });

  describe('when a random query button is pressed', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}
                        isFetching={false}  />
                    );

    beforeEach(() => {
      wrapper.find('.clickable-tab').at(0).simulate('click');
    });

    it('calls onSubmit with one of the random queries', () => {
      expect(onSubmitMock).toBeCalledWith(expect.any(String));
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

    describe('and the Preset Queries tab is selected', () => {
      it('disables all the random query buttons', () => {
        wrapper.find('.clickable-tab').nodes.forEach(function(button) {
          expect(button.props.disabled).toBe(true);
        });
      });
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
