import sys
import os
import unittest
from mock import patch, MagicMock, ANY
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
mocked_collections = MagicMock()
mocked_collections.get_constants.return_value = {
  'environment_id': 'my_environment_id',
  'collection_id_regular': 'my_regular_collection_id',
  'collection_id_enriched': 'my_enriched_collection_id'
}
sys.modules['get_discovery_collections'] = mocked_collections

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
    def test_regular_query(self, discovery):
        query_opts = {'query': 'my_query'}
        mock_response = json.loads(
          """
            {
              "matching_results": 0,
              "results": []
            }
          """ # noqa
        )
        discovery.return_value = mock_response
        rv = self.app.post(
              '/api/query/regular',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        discovery.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_regular_collection_id',
          query_options=query_opts
        )
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.NaturalLanguageUnderstandingV1.analyze')
    @patch('watson_developer_cloud.DiscoveryV1.query')
    def test_enriched_query_with_2_keywords(self, discovery, nlu):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'enriched_text.keywords.text:keyword_1,keyword_2'
        }
        mock_response = json.loads(
          """
            {
              "matching_results": 0,
              "results": []
            }
          """ # noqa
        )
        mock_keyword_response = json.loads(
          """
            {
              "keywords": [
                {
                  "emotion": {
                    "sadness": 0.174379,
                    "joy": 0.66067,
                    "fear": 0.051475,
                    "disgust": 0.114401,
                    "anger": 0.044105
                  },
                  "relevance": "0.900808",
                  "sentiment": {
                    "score": 0.419889
                  },
                  "text": "keyword_1"
                },
                {
                  "emotion": {
                    "sadness": 0.174379,
                    "joy": 0.66067,
                    "fear": 0.051475,
                    "disgust": 0.114401,
                    "anger": 0.044105
                  },
                  "relevance": "0.900808",
                  "sentiment": {
                    "score": 0.419889
                  },
                  "text": "keyword_2"
                }
              ]
            }
          """
        )
        discovery.return_value = mock_response
        nlu.return_value = mock_keyword_response
        rv = self.app.post(
              '/api/query/enriched',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        nlu.assert_called_with(
          text=query_opts['query'],
          features=ANY
        )
        discovery.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_enriched_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.NaturalLanguageUnderstandingV1.analyze')
    @patch('watson_developer_cloud.DiscoveryV1.query')
    def test_enriched_query_with_1_keyword(self, discovery, nlu):
        query_opts = {'query': 'my_query'}
        expected_query_opts = {
          'query': 'enriched_text.keywords.text:keyword_1'
        }
        mock_response = json.loads(
          """
            {
              "matching_results": 0,
              "results": []
            }
          """ # noqa
        )
        mock_keyword_response = json.loads(
          """
            {
              "keywords": [
                {
                  "emotion": {
                    "sadness": 0.174379,
                    "joy": 0.66067,
                    "fear": 0.051475,
                    "disgust": 0.114401,
                    "anger": 0.044105
                  },
                  "relevance": "0.900808",
                  "sentiment": {
                    "score": 0.419889
                  },
                  "text": "keyword_1"
                }
              ]
            }
          """
        )
        discovery.return_value = mock_response
        nlu.return_value = mock_keyword_response
        rv = self.app.post(
              '/api/query/enriched',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        nlu.assert_called_with(
          text=query_opts['query'],
          features=ANY
        )
        discovery.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_enriched_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.NaturalLanguageUnderstandingV1.analyze')
    @patch('watson_developer_cloud.DiscoveryV1.query')
    def test_enriched_query_with_0_keywords(self, discovery, nlu):
        query_opts = {'query': 'my_query'}
        mock_response = json.loads(
          """
            {
              "matching_results": 0,
              "results": []
            }
          """ # noqa
        )
        mock_keyword_response = json.loads(
          """
            {
              "keywords": []
            }
          """
        )
        discovery.return_value = mock_response
        nlu.return_value = mock_keyword_response
        rv = self.app.post(
              '/api/query/enriched',
              data=json.dumps(query_opts)
             )
        actual_response = json.loads(rv.data.decode('UTF-8'))
        nlu.assert_called_with(
          text=query_opts['query'],
          features=ANY
        )
        discovery.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_enriched_collection_id',
          query_options=query_opts
        )
        self.assertEqual(actual_response, mock_response)


if __name__ == '__main__':
    unittest.main()
