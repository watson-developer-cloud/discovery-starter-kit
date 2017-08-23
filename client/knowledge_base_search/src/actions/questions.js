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
    return {error: 'We are having trouble retrieving your data due to a network issue. Try checking your custom endpoints or network connections.'};
  })
};

export default questions;
