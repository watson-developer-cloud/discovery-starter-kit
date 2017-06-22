import React from 'react';
import ReactDOM from 'react-dom';
import QuestionBarContainer from '../../../containers/QuestionBarContainer/QuestionBarContainer';
import { shallow } from 'enzyme';

describe('<QuestionBarContainer />', () => {
  let wrapper;

  const onQuestionClickMock = jest.fn();
  const props = {
    presetQueries: [ 'one', 'two', 'three', 'four', 'five', 'six' ],
    currentQuery: '',
    isFetching: false,
    onQuestionClick: onQuestionClickMock
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<QuestionBarContainer {...props} />, div);
  });

  it('shows 5 preset queries and a "More Questions" button', () => {
    wrapper = shallow(<QuestionBarContainer {...props} />);

    const buttons = wrapper.find('.question_bar_button--button');

    expect(buttons)
      .toHaveLength(QuestionBarContainer.defaultProps.questionsShown + 1);
  });

  describe('when the first preset query button is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...props} />);
      wrapper.find('.question_bar_button--button').at(0).simulate('click');
    });

    it('calls onSubmit with the first preset query', () => {
      expect(onQuestionClickMock).toBeCalledWith(props.presetQueries[0], 0);
    });
  });

  describe('when the currentQuery is equal to one of the queries shown', () => {
    const index = 2;
    const props_with_matching_currentQuery = Object.assign({}, props, {
      currentQuery: props.presetQueries[index]
    });

    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...props_with_matching_currentQuery} />);
    });

    it('adds the "active" class to the appropriate question', () => {
      const buttons = wrapper.find('.question_bar_button--button').nodes;
      expect(buttons[index].props.className).toContain('active');

      buttons.filter((button, i) => {
        return i !== index;
      }).forEach((button) => {
        expect(button.props.className).not.toContain('active');
      });
    });
  });

  describe('when the "More Questions" button is clicked', () => {
    beforeEach(() => {
      wrapper = wrapper = shallow(<QuestionBarContainer {...props} />);
      wrapper.find('.question_bar_button--button.right').simulate('click');
    });

    it('shows the "Previous Questions" button', () => {
      const previousButton = wrapper.find('.question_bar_button--button.left');
      const moreButton = wrapper.find('.question_bar_button--button.right');

      expect(previousButton).toHaveLength(1);
      expect(previousButton.text()).toEqual('Previous Questions');

      expect(moreButton).toHaveLength(0);
    });

    it('shows the next question', () => {
      const buttons = wrapper.find('.question_bar_button--button');
      expect(buttons.at(1).text()).toEqual('six');
    });

    describe('and then the "Previous Questions" button is clicked', () => {
      beforeEach(() => {
        wrapper.find('.question_bar_button--button.left').simulate('click');
      });

      it('shows the original 5 questions', () => {
        const buttons = wrapper.find('.question_bar_button--button');
        const moreButton = buttons
          .at(QuestionBarContainer.defaultProps.questionsShown);

        expect(moreButton.text()).toEqual('More Questions');
        expect(buttons)
          .toHaveLength(QuestionBarContainer.defaultProps.questionsShown + 1);
      });
    });
  });

  describe('when isFetching is true', () => {
    const props_is_fetching = Object.assign({}, props, {
      isFetching: true
    });

    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...props_is_fetching} />);
    });

    it('disables all the query buttons', () => {
      wrapper.find('.question_bar_button--button').nodes.filter((button) => {
        const buttonText = button.props.children;
        return buttonText !== 'More Questions' &&
               buttonText !== 'Previous Questions';
      }).forEach((button) => {
        expect(button.props.disabled).toBe(true);
      });
    });
  });
});
