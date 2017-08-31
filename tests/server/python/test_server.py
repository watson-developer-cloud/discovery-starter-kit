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
  'collection_id': {
    'passages': 'my_passages_collection_id',
    'regular': 'my_regular_collection_id',
    'trained': 'my_trained_collection_id'
  }
}
helpers.get_questions.return_value = [
  {'question': 'Can you tell a cabbie which route to take?'}
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
    def test_query_regular(self, query):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'my_query',
          'return': 'text',
          'count': 100
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
    def test_query_passages(self, query):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'my_query',
          'return': 'text',
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
              '/api/query/passages',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_passages_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.query')
    def test_query_trained(self, query):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'my_query',
          'return': 'text'
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
              '/api/query/trained',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_trained_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_response, mock_response)

    def test_questions_passages(self):
        expected_response = [
          {'question': 'Can you tell a cabbie which route to take?'}
        ]
        rv = self.app.get('/api/questions/passages')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, expected_response)

    def test_questions_trained(self):
        expected_response = [
          {'question': 'Can you tell a cabbie which route to take?'}
        ]
        rv = self.app.get('/api/questions/trained')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, expected_response)


if __name__ == '__main__':
    unittest.main()
