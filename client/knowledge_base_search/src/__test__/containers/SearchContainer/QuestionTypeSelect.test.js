import React from 'react';
import ReactDOM from 'react-dom';
import QuestionTypeSelect from '../../../containers/SearchContainer/QuestionTypeSelect';
import { shallow } from 'enzyme';

describe('<QuestionTypeSelect />', () => {
  let wrapper;
  const onSelectMock = jest.fn();
  const props = {
    onSelect: onSelectMock,
    selectedQuestion: QuestionTypeSelect.questionTypes.PRESET.value
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<QuestionTypeSelect {...props} />, div);
  });

  it('has expected question types', () => {
    wrapper = shallow(<QuestionTypeSelect {...props} />);
    const questionTypes = wrapper.find('option');

    expect(questionTypes).toHaveLength(2);
    expect(questionTypes.at(0).props().value)
      .toEqual(QuestionTypeSelect.questionTypes.PRESET.value);
    expect(questionTypes.at(1).props().value)
      .toEqual(QuestionTypeSelect.questionTypes.CUSTOM.value);
  });

  describe('when the selectedQuestion is "Preset questions"', () => {
    const propsWithPreset = Object.assign({}, props, {
      selectedQuestion: QuestionTypeSelect.questionTypes.PRESET.value
    });

    beforeEach(() => {
      wrapper = shallow(<QuestionTypeSelect {...propsWithPreset} />);
    });

    it('has "Preset questions" selected', () => {
      const select = wrapper.find('.question_type--select');

      expect(select.props().value).toEqual(QuestionTypeSelect.questionTypes.PRESET.value);
    });
  });

  describe('when the selectedQuestion is "Custom question"', () => {
    const propsWithCustom = Object.assign({}, props, {
      selectedQuestion: QuestionTypeSelect.questionTypes.CUSTOM.value
    });

    beforeEach(() => {
      wrapper = shallow(<QuestionTypeSelect {...propsWithCustom} />);
    });

    it('has "Preset questions" selected', () => {
      const select = wrapper.find('.question_type--select');

      expect(select.props().value).toEqual(QuestionTypeSelect.questionTypes.CUSTOM.value);
    });
  });

  describe('when a selection is made', () => {
    const value = 'foo';

    beforeEach(() => {
      wrapper = shallow(<QuestionTypeSelect {...props} />);
      wrapper.find('.question_type--select').simulate('change', { target: { value } });
    });

    it('calls onSelect with the value', () => {
      expect(onSelectMock).toBeCalledWith({ target: { value } });
    });
  });
});
