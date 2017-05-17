import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../../../containers/SearchContainer/SearchContainer';
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
      />, div);
  });

  it('has a header, TextInput, and button on initial load', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}  />
                    );
    expect(wrapper.find('.header--input')).toHaveLength(1);
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find('.white--button')).toHaveLength(1);
  });

  it('has does not have a header or button after results fetched', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={true}  />
                    );
    expect(wrapper.find('.header--input')).toHaveLength(0);
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find('.white--button')).toHaveLength(0);
  });

  describe('when text is typed in', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}  />
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

  describe('when the random query button is pressed', () => {
    const wrapper = shallow(
                      <SearchContainer
                        onSubmit={onSubmitMock}
                        hasResults={false}  />
                    );

    beforeEach(() => {
      wrapper.find('.random-query--button').simulate('click');
    });

    describe('and the form is submitted', () => {
      beforeEach(() => {
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
      });

      it('calls onSubmit with one of the random queries', () => {
        expect(onSubmitMock).toBeCalledWith(expect.any(String));
      });
    });
  });
});
