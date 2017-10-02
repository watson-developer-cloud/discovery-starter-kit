import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import ViewAllContainer from '../../../containers/ViewAllContainer/ViewAllContainer';

describe('<ViewAllContainer />', () => {
  let wrapper;
  const onQuestionClickMock = jest.fn();
  const onCloseClickMock = jest.fn();
  const props = {
    isFetchingResults: false,
    onQuestionClick: onQuestionClickMock,
    onCloseClick: onCloseClickMock,
    presetQueries: [],
    isTrained: true,
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

  describe('when there is a presetQuery with a training query', () => {
    const propsWithTrainingQuery = Object.assign({}, props, {
      presetQueries: [
        {
          question: 'question',
          is_training_query: true,
        },
      ],
    });

    beforeEach(() => {
      wrapper = shallow(<ViewAllContainer {...propsWithTrainingQuery} />);
    });

    it('shows an annotation when it is a training query', () => {
      const buttons = wrapper.find('.view_all_question--button');

      expect(buttons.at(0).find('.view_all--train')).toHaveLength(1);
    });
  });

  describe('when there are presetQueries', () => {
    const { questionsPerPage } = ViewAllContainer.defaultProps;
    const questionButtonSelector = '.view_all_question--button';
    const queries = [...Array(questionsPerPage + 1)].map((el, i) => ({ question: `query_${i}` }));

    const propsWithQueries = Object.assign({}, props, {
      presetQueries: queries,
    });

    beforeEach(() => {
      wrapper = shallow(<ViewAllContainer {...propsWithQueries} />);
    });

    it('renders only first set of questions as enabled buttons', () => {
      const questionButtons = wrapper.find(questionButtonSelector);

      expect(questionButtons).toHaveLength(questionsPerPage);
      questionButtons.nodes.forEach((button) => {
        expect(button.props.disabled).toBe(false);
      });
    });

    describe('and isFetchingResults is true', () => {
      const propsFetchingResults = Object.assign({}, propsWithQueries, {
        isFetchingResults: true,
      });

      beforeEach(() => {
        wrapper = shallow(<ViewAllContainer {...propsFetchingResults} />);
      });

      it('renders only first set of questions as disabled buttons', () => {
        const questionButtons = wrapper.find(questionButtonSelector);

        expect(questionButtons).toHaveLength(questionsPerPage);
        questionButtons.nodes.forEach((button) => {
          expect(button.props.disabled).toBe(true);
        });
      });
    });

    describe('and the first button is clicked', () => {
      beforeEach(() => {
        wrapper.find(questionButtonSelector).at(0).simulate('click');
      });

      it('calls onQuestionClick with the first query', () => {
        expect(onQuestionClickMock).toBeCalledWith(queries[0].question);
      });
    });

    describe('and loadMore is triggered without a filter', () => {
      beforeEach(() => {
        wrapper.instance().loadMore();
      });

      it('shows more questions', () => {
        const questionButtons = wrapper.find(questionButtonSelector);

        expect(questionButtons).toHaveLength(queries.length);
      });
    });

    describe('and handleOnInput is triggered with a filter matching nothing', () => {
      beforeEach(() => {
        wrapper.instance().handleOnInput({ target: { value: 'foo' } });
      });

      it('shows something indicating no results matched', () => {
        expect(wrapper.find('.view_all_questions_no_results--span'))
          .toHaveLength(1);
      });
    });

    describe('and handleOnInput is triggered with a filter matching less', () => {
      beforeEach(() => {
        wrapper.instance().handleOnInput({ target: { value: '50' } });
      });

      it('filters the question set and does not show a no results message', () => {
        const questionButtons = wrapper.find(questionButtonSelector);

        expect(questionButtons).toHaveLength(1);
        expect(questionButtons.text()).toEqual('query_50');

        expect(wrapper.find('.view_all_questions_no_results--span'))
          .toHaveLength(0);
      });

      describe('and then loadMore is triggered', () => {
        beforeEach(() => {
          wrapper.instance().loadMore();
        });

        it('does not show more questions', () => {
          const questionButtons = wrapper.find(questionButtonSelector);

          expect(questionButtons).toHaveLength(1);
          expect(questionButtons.text()).toEqual('query_50');
        });
      });
    });

    describe('and loadMore is triggered with a filter matching more', () => {
      beforeEach(() => {
        wrapper.instance().handleOnInput({ target: { value: 'QUERY' } });
        wrapper.instance().loadMore();
      });

      it('shows more questions', () => {
        const questionButtons = wrapper.find(questionButtonSelector);

        expect(questionButtons).toHaveLength(queries.length);
      });
    });
  });
});
