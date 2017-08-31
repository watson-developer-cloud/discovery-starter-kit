import 'whatwg-fetch';

const query = (collection_type, query) => {
  // when running in development mode, we have both node + python servers running
  // tell node to use the host that is specified at startup (usually localhost:5000)
  const host = process.env.REACT_APP_SERVER || '';
  return fetch(`${host}/api/query/${collection_type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.error(error.message);
    return {error: 'We are having trouble retrieving your data due to a network issue. Try checking your custom endpoints or network connections.'};
  })
};

export default query;
