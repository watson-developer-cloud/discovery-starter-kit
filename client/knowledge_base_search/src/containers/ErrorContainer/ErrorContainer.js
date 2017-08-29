import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scroller, Element } from 'react-scroll';
import { Alert } from 'watson-react-components';
import './styles.css';

class ErrorContainer extends Component {
  componentDidMount() {
    scroller.scrollTo('scroll_to_error', {
      smooth: true
    });
  }

  render() {
    const { errorMessage } = this.props;

    return (
      <Element name='scroll_to_error' className='_container'>
        <Alert type='error' color='red'>
          <p className='base--p'>
            { errorMessage }
          </p>
        </Alert>
      </Element>
    );
  }
}

ErrorContainer.PropTypes = {
  errorMessage: PropTypes.string.isRequired
}

export default ErrorContainer;
