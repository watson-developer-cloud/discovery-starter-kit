import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../../../containers/SearchContainer/SearchContainer';
import FeatureSelect from '../../../containers/SearchContainer/FeatureSelect';
import QuestionTypeSelect from '../../../containers/SearchContainer/QuestionTypeSelect';
import QuestionBarContainer from '../../../containers/QuestionBarContainer/QuestionBarContainer';
import ErrorContainer from '../../../containers/ErrorContainer/ErrorContainer';
import { TextInput } from 'watson-react-components';
import { shallow } from 'enzyme';

describe('<SearchContainer />', () => {
  let wrapper;
  const onSubmitMock = jest.fn();
  const onOffsetUpdateMock = jest.fn();
  const onQuestionClickMock = jest.fn();
  const onViewAllClickMock = jest.fn();
  const onFeatureSelectMock = jest.fn();
  const props = {
    errorMessage: null,
    isFetchingQuestions: true,
    isFetchingResults: false,
    offset: 0,
    onFeatureSelect: onFeatureSelectMock,
    onOffsetUpdate: onOffsetUpdateMock,
    onQuestionClick: onQuestionClickMock,
    onSubmit: onSubmitMock,
    onViewAllClick: onViewAllClickMock,
    presetQueries: [],
    searchInput: '',
    selectedFeature: FeatureSelect.featureTypes.PASSAGES.value
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchContainer {...props} />, div);
  });

  describe('when it has fetched questions', () => {
    const props_questions_fetched = Object.assign({}, props, {
      isFetchingQuestions: false
    });

    describe('and questions are present', () => {
      const questions = [ 'one', 'two' ];
      const props_questions_present = Object.assign({}, props_questions_fetched, {
        presetQueries: questions
      });
      beforeEach(() => {
        wrapper = shallow(<SearchContainer {...props_questions_present} />);
      });

      it('shows the QuestionBarContainer with expected props', () => {
        const questionBarProps = wrapper.find(QuestionBarContainer).props();

        expect(wrapper.find(ErrorContainer)).toHaveLength(0);

        expect(questionBarProps.currentQuery).toEqual('');
        expect(questionBarProps.presetQueries)
          .toEqual(expect.arrayContaining(questions));
        expect(questionBarProps.isFetchingResults).toBe(false);
        expect(questionBarProps.offset).toEqual(0);
      });

      it('shows the expected text for the "View all x Questions" button', () => {
        expect(wrapper.find('.view_all--button').text())
          .toEqual('View all 2+ questions');
      });

      describe('when the "View All Questions" button is clicked', () => {
        beforeEach(() => {
          wrapper.find('.view_all--button').simulate('click');
        });

        it('calls the onViewAllClick', () => {
          expect(onViewAllClickMock).toBeCalled();
        });
      });
    });

    describe('and an error is present', () => {
      const props_with_error = Object.assign({}, props_questions_fetched, {
        errorMessage: 'whoops'
      });

      beforeEach(() => {
        wrapper = shallow(<SearchContainer {...props_with_error} />);
      });

      it('shows an ErrorContainer', () => {
        const errorContainer = wrapper.find(ErrorContainer);

        expect(wrapper.find(QuestionBarContainer)).toHaveLength(0);

        expect(errorContainer).toHaveLength(1);
        expect(errorContainer.props().errorMessage).toEqual('whoops');
      });
    });

    describe('and isFetchingResults is true', () => {
      const props_results_fetching = Object.assign({}, props_questions_fetched, {
        isFetchingResults: true
      });

      beforeEach(() => {
        wrapper = shallow(<SearchContainer {...props_results_fetching} />);
      });

      it('passes "true" to the QuestionBarContainer', () => {
        expect(wrapper.find(QuestionBarContainer).props().isFetchingResults)
          .toBe(true);
      });

      it('disables the "View All Questions" button', () => {
        expect(wrapper.find('.view_all--button').props().disabled).toBe(true);
      });

      describe('and "Custom questions" type is selected', () => {
        beforeEach(() => {
          selectQuestionType(wrapper, QuestionTypeSelect.questionTypes.CUSTOM);
        });

        it('disables all the inputs', () => {
          expect(wrapper.find(TextInput).props().disabled).toBe(true);
          expect(wrapper.find('.white--button').props().disabled).toBe(true);
        });
      });
    });
  });

  describe('when "Custom questions" type is selected', () => {
    beforeEach(() => {
      wrapper = shallow(<SearchContainer {...props} />);
      selectQuestionType(wrapper, QuestionTypeSelect.questionTypes.CUSTOM);
    });

    it('has the text search, icon, and submit button displayed', () => {
      expect(wrapper.find('.positioned--icon')).toHaveLength(1);
      expect(wrapper.find(TextInput)).toHaveLength(1);
      expect(wrapper.find('.white--button')).toHaveLength(1);
    });
  });

  describe('when the form is submitted with text', () => {
    const text = 'my question';

    beforeEach(() => {
      wrapper = shallow(<SearchContainer {...props} />);
      wrapper.setState({searchInput: text});
      wrapper.find('form').simulate('submit', { preventDefault: () => {}});
    });

    it('calls onSubmit with the text', () => {
      expect(onSubmitMock).toBeCalledWith(text);
    });
  });

  function selectQuestionType(wrapper, type) {
    wrapper.instance().handleOnQuestionTypeSelect({
      target: {
        value: type.value
      }
    });
  }
});
