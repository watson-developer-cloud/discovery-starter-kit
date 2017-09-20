import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import FeatureSelect from '../../../containers/SearchContainer/FeatureSelect';

describe('<FeatureSelect />', () => {
  let wrapper;
  const onFeatureSelectMock = jest.fn();
  const props = {
    onFeatureSelect: onFeatureSelectMock,
    selectedFeature: FeatureSelect.featureTypes.PASSAGES.value,
    isFetchingResults: false,
  };

  function getButtonClickEvent(button) {
    return { target: { value: button.props().value } };
  }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<FeatureSelect {...props} />, div);
  });

  it('has the expected features', () => {
    wrapper = shallow(<FeatureSelect {...props} />);

    expect(wrapper.find('.feature_select--list_item')).toHaveLength(2);
  });

  describe('when the selectedFeature is "Passage Search"', () => {
    const propsWithPassage = Object.assign({}, props, {
      selectedFeature: FeatureSelect.featureTypes.PASSAGES.value,
    });

    beforeEach(() => {
      wrapper = shallow(<FeatureSelect {...propsWithPassage} />);
    });

    it('has "Passage Search" highlighted', () => {
      const highlightedFeature = wrapper.find('.feature_select--list_button--active');

      expect(highlightedFeature.text()).toEqual(FeatureSelect.featureTypes.PASSAGES.text);
    });
  });

  describe('when the selectedFeature is "Relevancy"', () => {
    const propsWithRelevancy = Object.assign({}, props, {
      selectedFeature: FeatureSelect.featureTypes.TRAINED.value,
    });

    beforeEach(() => {
      wrapper = shallow(<FeatureSelect {...propsWithRelevancy} />);
    });

    it('has "Relevancy" highlighted', () => {
      const highlightedFeature = wrapper.find('.feature_select--list_button--active');

      expect(highlightedFeature.text()).toEqual(FeatureSelect.featureTypes.TRAINED.text);
    });
  });

  describe('when the first feature is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<FeatureSelect {...props} />);
      const button = wrapper.find('.feature_select--list_button').at(0);
      button.simulate('click', getButtonClickEvent(button));
    });

    it('calls onSelect with "passages"', () => {
      expect(onFeatureSelectMock).toBeCalledWith({
        target: {
          value: FeatureSelect.featureTypes.PASSAGES.value,
        },
      });
    });
  });

  describe('when the second feature is clicked', () => {
    beforeEach(() => {
      wrapper = shallow(<FeatureSelect {...props} />);
      const button = wrapper.find('.feature_select--list_button').at(1);
      button.simulate('click', getButtonClickEvent(button));
    });

    it('calls onSelect with "relevancy"', () => {
      expect(onFeatureSelectMock).toBeCalledWith({
        target: {
          value: FeatureSelect.featureTypes.TRAINED.value,
        },
      });
    });
  });

  describe('when using the FeatureSelection tabs', () => {
    let passagesTab;
    let relevancyTab;

    function renderWithProps(propSet) {
      wrapper = shallow(<FeatureSelect {...propSet} />);
      passagesTab = wrapper.find('.feature_select--list_button').at(0);
      relevancyTab = wrapper.find('.feature_select--list_button').at(1);
    }

    beforeEach(() => {
      renderWithProps(props);
    });

    describe('when the app is not fetching results', () => {
      it('does not disable tab selection', () => {
        expect(passagesTab.props().disabled).toBe(false);
        expect(relevancyTab.props().disabled).toBe(false);
      });
    });

    describe('when the app is fetching results to a question', () => {
      const propsFetchingResults = Object.assign({}, props, {
        isFetchingResults: true,
      });

      beforeEach(() => {
        renderWithProps(propsFetchingResults);
      });

      it('disables tab selection', () => {
        expect(passagesTab.props().disabled).toBe(true);
        expect(relevancyTab.props().disabled).toBe(true);
      });
    });
  });
});
