import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../../../containers/SearchContainer/SearchContainer';
import { shallow } from 'enzyme';

describe('<SearchContainer />', () => {
  const onSubmitMock = jest.fn();

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchContainer onSubmit={onSubmitMock} />, div);
  });

  describe('when text is typed in', () => {
    const wrapper = shallow(<SearchContainer onSubmit={onSubmitMock} />);
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
    const wrapper = shallow(<SearchContainer onSubmit={onSubmitMock} />);

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
