import React from 'react';
import replaceNewlines from '../../utils/replaceNewlines';

describe('replaceNewlines', () => {
  it('returns expected html', () => {
    const expected = [
      (
        <span key={'newline_0'}>
          {'text'}
          <br />
        </span>
      ),
      (
        <span key={'newline_1'}>
          {'newline'}
          { false }
        </span>
      )
    ];
    const actual = replaceNewlines('text\nnewline');

    expect(actual).toEqual(expected);
  });
});
