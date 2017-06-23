import 'whatwg-fetch';

const query = (collection_type, query) => {
  const host = process.env.REACT_APP_SERVER || '';
  return fetch(`${host}/api/query/${collection_type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    return json;
  })
  .catch((error) => {
    console.error(error.message);
    return {error: error.message};
  })
};

export default query;
