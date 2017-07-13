import 'whatwg-fetch';

const questions = () => {
  const host = process.env.REACT_APP_SERVER || '';
  return fetch(`${host}/api/questions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.error(error.message);
    return {error: error.message};
  })
};

export default questions;
