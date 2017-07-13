import sys
import os
import unittest
from mock import patch, MagicMock
import json
project_dir = os.path.abspath(
  os.path.join(
    os.path.dirname(__file__),
    '..',
    '..',
    '..',
    'server',
    'python'
  )
)
sys.path.insert(0, project_dir)

# Mock service interaction for unit tests
helpers = MagicMock()
helpers.get_constants.return_value = {
  'environment_id': 'my_environment_id',
  'collection_id_regular': 'my_regular_collection_id',
  'collection_id_enriched': 'my_enriched_collection_id'
}
helpers.get_questions.return_value = [
  'Can you tell a cabbie which route to take?'
]
sys.modules['helpers'] = helpers

from server import app # noqa


class TestServer(unittest.TestCase):

    def setUp(self):
        app.debug = True
        self.app = app.test_client()

    def test_index(self):
        rv = self.app.get('/')
        response_text = rv.data.decode('UTF-8')
        self.assertIn('Knowledge Base Search', response_text)

    @patch('watson_developer_cloud.DiscoveryV1.query')
    def test_regular_query(self, query):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'my_query',
          'return': 'answer'
        }
        mock_response = json.loads(
          """
            {
              "matching_results": 0,
              "results": []
            }
          """ # noqa
        )
        query.return_value = mock_response
        rv = self.app.post(
              '/api/query/regular',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_regular_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.query')
    def test_enriched_query(self, query):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'my_query',
          'return': 'answer',
          'passages': True
        }
        mock_response = json.loads(
          """
            {
              "matching_results": 0,
              "results": []
            }
          """ # noqa
        )
        query.return_value = mock_response
        rv = self.app.post(
              '/api/query/enriched',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_enriched_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_response, mock_response)

    def test_questions(self):
        expected_response = [
          'Can you tell a cabbie which route to take?'
        ]
        rv = self.app.get('/api/questions')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, expected_response)


if __name__ == '__main__':
    unittest.main()
