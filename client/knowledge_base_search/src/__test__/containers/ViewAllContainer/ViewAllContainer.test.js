import React from 'react';
import ReactDOM from 'react-dom';
import ViewAllContainer from '../../../containers/ViewAllContainer/ViewAllContainer';
import { shallow } from 'enzyme';

describe('<ViewAllContainer />', () => {
  let wrapper;
  const onQuestionClickMock = jest.fn();
  const onCloseClickMock = jest.fn();
  const props = {
    isFetchingResults: false,
    onQuestionClick: onQuestionClickMock,
    onCloseClick: onCloseClickMock,
    presetQueries: []
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewAllContainer {...props} />, div);
  });

  describe('when the "Close" button is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<ViewAllContainer {...props} />);
      wrapper.find('.close_view_all--button').simulate('click');
    });

    it('calls the onCloseClick handler', () => {
      expect(onCloseClickMock).toBeCalled();
    });
  });

  describe('when there are presetQueries', () => {
    const queries = [ 'one', 'two' ];

    const props_with_queries = Object.assign({}, props, {
      presetQueries: queries
    });

    beforeEach(() => {
      wrapper = shallow(<ViewAllContainer {...props_with_queries} />);
    });

    it('renders all queries as enabled buttons', () => {
      const questionButtons = wrapper.find('.view_all_question--button');

      expect(questionButtons).toHaveLength(queries.length);
      questionButtons.nodes.forEach((button) => {
        expect(button.props.disabled).toBe(false);
      });
    });

    describe('and isFetchingResults is true', () => {
      const props_fetching_results = Object.assign({}, props_with_queries, {
        isFetchingResults: true
      });

      beforeEach(() => {
        wrapper = shallow(<ViewAllContainer {...props_fetching_results} />);
      });

      it('renders all queries as disabled buttons', () => {
        const questionButtons = wrapper.find('.view_all_question--button');

        expect(questionButtons).toHaveLength(queries.length);
        questionButtons.nodes.forEach((button) => {
          expect(button.props.disabled).toBe(true);
        });
      });
    });

    describe('and the first button is clicked', () => {
      beforeEach(() => {
        wrapper.find('.view_all_question--button').at(0).simulate('click');
      });

      it('calls onQuestionClick with the first query', () => {
        expect(onQuestionClickMock).toBeCalledWith(queries[0]);
      });
    });
  });
});
