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

  it('shows 4 preset queries and a "More Questions" button', () => {
    wrapper = shallow(<QuestionBarContainer {...props} />);

    const buttons = wrapper.find('.question_bar_button--button');

    expect(buttons)
      .toHaveLength(QuestionBarContainer.defaultProps.questionsShown);
  });

  describe('when the first preset query button is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...props} />);
      wrapper.find('.question_bar_button--button').at(0).simulate('click');
    });

    it('calls onSubmit with the first preset query', () => {
      expect(onQuestionClickMock).toBeCalledWith(props.presetQueries[0]);
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

  describe('when the right arrow is clicked', () => {
    beforeEach(() => {
      wrapper = wrapper = shallow(<QuestionBarContainer {...props} />);
      wrapper.find('.question_bar_arrow--button.right').simulate('click');
    });

    it('shows the left arrow button only', () => {
      const leftArrow = wrapper.find('.question_bar_arrow--button.left');
      const rightArrow = wrapper.find('.question_bar_arrow--button.right');

      expect(leftArrow).toHaveLength(1);
      expect(rightArrow).toHaveLength(0);
    });

    it('shows the next questions', () => {
      const questionButtons = wrapper.find('.question_bar_button--button');

      expect(questionButtons).toHaveLength(2);
      expect(questionButtons.at(0).text()).toEqual('five');
      expect(questionButtons.at(1).text()).toEqual('six');
    });

    describe('and then the left arrow is clicked', () => {
      beforeEach(() => {
        wrapper.find('.question_bar_arrow--button.left').simulate('click');
      });

      it('shows the right arrow button only', () => {
        const leftArrow = wrapper.find('.question_bar_arrow--button.left');
        const rightArrow = wrapper.find('.question_bar_arrow--button.right');

        expect(leftArrow).toHaveLength(0);
        expect(rightArrow).toHaveLength(1);
      });

      it('shows the original 4 questions', () => {
        const questionButtons = wrapper.find('.question_bar_button--button');

        expect(questionButtons)
          .toHaveLength(QuestionBarContainer.defaultProps.questionsShown);
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
      wrapper.find('.question_bar_button--button').nodes.forEach((button) => {
        expect(button.props.disabled).toBe(true);
      });
    });
  });
});
