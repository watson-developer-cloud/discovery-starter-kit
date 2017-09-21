import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import QuestionBarContainer from '../../../containers/QuestionBarContainer/QuestionBarContainer';

describe('<QuestionBarContainer />', () => {
  let wrapper;

  const onQuestionClickMock = jest.fn();
  const onOffsetUpdateMock = jest.fn();
  const props = {
    presetQueries: [
      {
        question: 'one',
        is_training_query: true,
      },
      {
        question: 'two',
      },
      {
        question: 'three',
      },
      {
        question: 'four',
      },
      {
        question: 'five',
      },
      {
        question: 'six',
      },
    ],
    currentQuery: '',
    isFetchingResults: false,
    offset: 0,
    onOffsetUpdate: onOffsetUpdateMock,
    onQuestionClick: onQuestionClickMock,
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<QuestionBarContainer {...props} />, div);
  });

  it('shows 4 preset queries and a right arrow button', () => {
    wrapper = shallow(<QuestionBarContainer {...props} />);

    const buttons = wrapper.find('.question_bar--button');

    expect(buttons)
      .toHaveLength(QuestionBarContainer.defaultProps.questionsShown);
  });

  it('shows an annotation when it is a training query', () => {
    wrapper = shallow(<QuestionBarContainer {...props} />);

    const buttons = wrapper.find('.question_bar--button');

    expect(buttons.at(0).find('.question_bar--train')).toHaveLength(1);
  });

  describe('when the first preset query button is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...props} />);
      wrapper.find('.question_bar--button').at(0).simulate('click');
    });

    it('calls onSubmit with the first preset query', () => {
      expect(onQuestionClickMock).toBeCalledWith(props.presetQueries[0].question);
    });
  });

  describe('when the currentQuery is equal to one of the queries shown', () => {
    const index = 2;
    const propsWithMatchingCurrentQuery = Object.assign({}, props, {
      currentQuery: props.presetQueries[index].question,
    });
    let buttons;

    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...propsWithMatchingCurrentQuery} />);
      buttons = wrapper.find('.question_bar--button').nodes;
    });

    it('adds the "active" class to the appropriate question', () => {
      expect(buttons[index].props.className).toContain('active');

      buttons.filter((button, i) => i !== index).forEach((button) => {
        expect(button.props.className).not.toContain('active');
      });
    });

    it('disables the appropriate question', () => {
      expect(buttons[index].props.disabled).toBe(true);

      buttons.filter((button, i) => i !== index).forEach((button) => {
        expect(button.props.disabled).toBe(false);
      });
    });
  });

  describe('when right arrow is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...props} />);
      wrapper.find('.question_bar--arrow_button--right').simulate('click');
    });

    it('calls onOffsetUpdate', () => {
      expect(onOffsetUpdateMock).toBeCalledWith(4);
    });
  });

  describe('when offset is greater than questionsShown', () => {
    const propsGreaterOffset = Object.assign({}, props, {
      offset: QuestionBarContainer.defaultProps.questionsShown,
    });

    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...propsGreaterOffset} />);
    });

    it('shows the left arrow button only', () => {
      const leftArrow = wrapper.find('.question_bar--arrow_button--left');
      const rightArrow = wrapper.find('.question_bar--arrow_button--right');

      expect(leftArrow).toHaveLength(1);
      expect(rightArrow).toHaveLength(0);
    });

    it('shows the next questions', () => {
      const questionButtons = wrapper.find('.question_bar--button');

      expect(questionButtons).toHaveLength(2);
      expect(questionButtons.at(0).text()).toEqual('five');
      expect(questionButtons.at(1).text()).toEqual('six');
    });

    describe('when left arrow is clicked', () => {
      beforeEach(() => {
        wrapper.find('.question_bar--arrow_button--left').simulate('click');
      });

      it('calls onOffsetUpdate', () => {
        expect(onOffsetUpdateMock).toBeCalledWith(0);
      });
    });
  });

  describe('when isFetching is true', () => {
    const propsIsFetching = Object.assign({}, props, {
      isFetchingResults: true,
    });

    beforeEach(() => {
      wrapper = shallow(<QuestionBarContainer {...propsIsFetching} />);
    });

    it('disables all the query buttons', () => {
      wrapper.find('.question_bar--button').nodes.forEach((button) => {
        expect(button.props.disabled).toBe(true);
      });
    });
  });
});
