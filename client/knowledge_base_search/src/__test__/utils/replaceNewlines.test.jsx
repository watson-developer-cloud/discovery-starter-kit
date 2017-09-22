import React from 'react';
import replaceNewlines from '../../utils/replaceNewlines';

describe('replaceNewlines', () => {
  it('returns expected html', () => {
    const expected = [
      (
        <span key={0}>
          {'text'}
          <br />
        </span>
      ),
      (
        <span key={1}>
          {'newline'}
          { false }
        </span>
      ),
    ];
    const actual = replaceNewlines('text\nnewline');

    expect(actual).toEqual(expected);
  });
});
