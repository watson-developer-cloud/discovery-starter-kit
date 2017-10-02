import 'whatwg-fetch';

const questions = (featureType) => {
  // when running in development mode, we have both node + python servers running
  // tell node to use the host that is specified at startup (usually localhost:5000)
  const host = process.env.REACT_APP_SERVER || '';
  return fetch(`${host}/api/questions/${featureType}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .catch(() => ({
      error: 'We are having trouble retrieving your data due to a network issue. Try checking your custom endpoints or network connections.',
    }));
};

export default questions;
