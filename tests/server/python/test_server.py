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
        self.app = app.test_client()

    def test_index(self):
        rv = self.app.get('/')
        response_text = rv.data.decode('UTF-8')
        self.assertIn('Watson Discovery Service Starter Kit', response_text)

    @patch('watson_developer_cloud.DiscoveryV1.get_environments')
    def test_get_environments(self, discovery):
        mock_response = json.loads(
          """
            {
              "environments": [
                {
                  "created": "2017-05-01T21:32:42.900Z",
                  "description": "Watson News cluster environment",
                  "environment_id": "31b40f8c-1761-4786-aee5-6b6e90d253f6",
                  "name": "Watson News Environment",
                  "read_only": true,
                  "status": "active",
                  "updated": "2017-05-01T21:32:42.900Z"
                }
              ]
            }
          """
        )
        discovery.return_value = mock_response
        rv = self.app.get('/api/environments')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.get_environment')
    def test_get_environment(self, discovery):
        mock_response = json.loads(
          """
            {
              "created": "2017-05-01T21:32:42.900Z",
              "description": "Watson News cluster environment",
              "environment_id": "31b40f8c-1761-4786-aee5-6b6e90d253f6",
              "name": "Watson News Environment",
              "read_only": true,
              "status": "active",
              "updated": "2017-05-01T21:32:42.900Z"
            }
          """
        )
        discovery.return_value = mock_response
        rv = self.app.get('/api/environments/any_id')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.list_configurations')
    def test_list_configurations(self, discovery):
        mock_response = json.loads(
          """
            {
              "configurations": [
                {
                  "configuration_id": "dff11cb7-07ac-4f81-ba05-ca48b8ec97b2",
                  "created": "2017-05-01T21:32:42.972Z",
                  "description": "Default configuration for Watson News cluster",
                  "name": "Default Configuration",
                  "updated": "2017-05-01T21:32:42.972Z"
                }
              ]
            }
          """ # noqa
        )
        discovery.return_value = mock_response
        rv = self.app.get('/api/environments/any_id/configurations')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.get_configuration')
    def test_get_configuration(self, discovery):
        mock_response = json.loads(
          """
            {
              "configuration_id": "dff11cb7-07ac-4f81-ba05-ca48b8ec97b2",
              "created": "2017-05-01T21:32:42.972Z",
              "description": "Default configuration for Watson News cluster",
              "name": "Default Configuration",
              "updated": "2017-05-01T21:32:42.972Z"
            }
          """
        )
        discovery.return_value = mock_response
        rv = self.app.get('/api/environments/any_id/configurations/any_id')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.list_collections')
    def test_list_collections(self, discovery):
        mock_response = json.loads(
          """
            {
              "collections": [
                {
                  "collection_id": "bfc97bca-aaef-4d7c-a3cf-a1b488664174",
                  "configuration_id": "dff11cb7-07ac-4f81-ba05-ca48b8ec97b2",
                  "created": "2017-05-01T21:32:42.988Z",
                  "description": "Watson News pre-enriched collection of curated news sources",
                  "language": "en_us",
                  "name": "watson_news",
                  "status": "active",
                  "updated": "2017-05-01T21:32:42.988Z"
                }
              ]
            }
          """ # noqa
        )
        discovery.return_value = mock_response
        rv = self.app.get('/api/environments/any_id/collections')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, mock_response)

    @patch('watson_developer_cloud.DiscoveryV1.get_collection')
    def test_get_collection(self, discovery):
        mock_response = json.loads(
          """
            {
              "collection_id": "bfc97bca-aaef-4d7c-a3cf-a1b488664174",
              "configuration_id": "dff11cb7-07ac-4f81-ba05-ca48b8ec97b2",
              "created": "2017-05-01T21:32:42.988Z",
              "description": "Watson News pre-enriched collection of curated news sources",
              "document_counts": {
                "available": 17018115,
                "failed": 0,
                "processing": 0
              },
              "language": "en_us",
              "name": "watson_news",
              "status": "active",
              "updated": "2017-05-01T21:32:42.988Z"
            }
          """ # noqa
        )
        discovery.return_value = mock_response
        rv = self.app.get('/api/environments/any_id/collections/any_id')
        actual_response = json.loads(rv.data.decode('UTF-8'))
        self.assertEqual(actual_response, mock_response)

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
