import React from 'react';

export default function replaceNewlines(text) {
  if (text.indexOf('\n') > 0){
    text = text.split('\n').map((item, key, array) => {
      return (
        <span key={`newline_${key}`}>
          { item }
          { key + 1 < array.length && <br /> }
        </span>
      )
    });
  }
  return text;
};
