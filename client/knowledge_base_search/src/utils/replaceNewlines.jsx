import React from 'react';

export default function replaceNewlines(text) {
  if (text.indexOf('\n') > 0) {
    return text.split('\n').map((item, key, array) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={key}>
        { item }
        { key + 1 < array.length && <br /> }
      </span>
    ));
  }
  return text;
}
