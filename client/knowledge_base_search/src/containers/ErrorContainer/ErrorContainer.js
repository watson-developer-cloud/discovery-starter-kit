import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scroller, Element } from 'react-scroll';
import { Alert } from 'watson-react-components';

class ErrorContainer extends Component {
  componentDidMount() {
    scroller.scrollTo('scroll_to_error', {
      smooth: true
    });
  }

  render() {
    const { results_error, enriched_results_error } = this.props;
    const errorToShow = results_error ? results_error : enriched_results_error;

    return (
      <section className='_full-width-row'>
        <Element name='scroll_to_error' className='_container'>
          <Alert type='error' color='red'>
            <p className='base--p'>
              { errorToShow }
            </p>
          </Alert>
        </Element>
      </section>
    );
  }
}

ErrorContainer.PropTypes = {
  results_error: PropTypes.string.isRequired,
  enriched_results_error: PropTypes.string.isRequired
}

export default ErrorContainer;
