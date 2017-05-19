import React from 'react';
import ReactDOM from 'react-dom';
import AnswerColumn from '../../../containers/ResultsContainer/AnswerColumn';
import { shallow } from 'enzyme';

describe('<AnswerColumn />', () => {
  const answer = 'answer';
  const userId = 'userId';
  const userName = 'userName';
  const views = 1;
  const downVotes = 2;
  const upVotes = 3;
  const accepted = true;
  const props = {
    answer,
    userId,
    userName,
    views,
    downVotes,
    upVotes,
    accepted
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <AnswerColumn
        {...props}
      />, div);
  });

  describe('when accepted is "true"', () => {
    const propsAccepted = Object.assign({}, props, {
      accepted: true
    });
    const wrapper = shallow(<AnswerColumn {...propsAccepted} />);

    it('has "YES" for accepted', () => {
      expect(wrapper.find('.answer_metadata--div').text()).toContain('YES');
    });
  });

  describe('when accepted is "false"', () => {
    const propsNotAccepted = Object.assign({}, props, {
      accepted: false
    });
    const wrapper = shallow(<AnswerColumn {...propsNotAccepted} />);

    it('has "NO" for accepted', () => {
      expect(wrapper.find('.answer_metadata--div').text()).toContain('NO');
    });
  });
});
