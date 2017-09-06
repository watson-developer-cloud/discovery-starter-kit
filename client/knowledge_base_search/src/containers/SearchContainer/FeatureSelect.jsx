import React, { Component } from 'react';
import { string, func, element } from 'prop-types';
import classNames from 'classnames';
import './styles.css';

class FeatureSelect extends Component {
  // a map of the features shown in this starter kit
  static featureTypes = {
    // Passage search - finds relevant passages across all documents
    PASSAGES: {
      value: 'passages',
      text: 'Passage Search',
    },
    // Relevancy training - uses user-input training data to improve relevancy
    TRAINED: {
      value: 'trained',
      text: 'Relevancy',
    },
  }

  isSelected(value) {
    return this.props.selectedFeature === value;
  }

  render() {
    const {
      onFeatureSelect,
      questionTypeSelector,
    } = this.props;

    return (
      <ul className="feature_select--list">
        <li className="feature_select--list_item">
          { questionTypeSelector }
        </li>
        {
          Object.keys(FeatureSelect.featureTypes).map((featureKey) => {
            const { value, text } = FeatureSelect.featureTypes[featureKey];

            return (
              <li
                key={value}
                className="feature_select--list_item"
              >
                <button
                  type="button"
                  value={value}
                  className={
                    classNames('feature_select--list_button', {
                      'feature_select--list_button--active': this.isSelected(value),
                    })
                  }
                  onClick={onFeatureSelect}
                >
                  { text }
                </button>
              </li>
            );
          })
        }
      </ul>
    );
  }
}

FeatureSelect.propTypes = {
  onFeatureSelect: func.isRequired,
  selectedFeature: string.isRequired,
  questionTypeSelector: element.isRequired,
};

export default FeatureSelect;
