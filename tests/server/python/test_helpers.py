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

from helpers import get_questions # noqa

constants = {
  'environment_id': 'my_environment_id',
  'collection_id': {
    'passages': 'my_passages_collection_id',
    'trained': 'my_trained_collection_id'
  }
}


class TestHelpers(unittest.TestCase):

    @patch('watson_developer_cloud.DiscoveryV1')
    def test_questions_passages(self, discovery):
        question_count = 5000
        agg = 'term(question.title,count:%s)'
        expected_agg = agg % str(question_count)
        expected_query_opts = {
          'aggregation': expected_agg,
          'count': 0
        }
        expected_value = [
          {'question': 'Can you tell a cabbie which route to take?'}
        ]
        mock_response = json.loads(
          """
            {
              "matching_results": 37314,
              "aggregations": [
                {
                  "type": "term",
                  "field": "question.title",
                  "count": 1,
                  "results": [
                    {
                      "key": "Can you tell a cabbie which route to take?",
                      "matching_results": 24
                    }
                  ]
                }
              ]
            }
          """ # noqa
        )
        discovery.query = MagicMock(return_value=mock_response)

        actual_value = get_questions(
                        discovery=discovery,
                        constants=constants,
                        question_count=question_count,
                        feature_type="passages")
        discovery.query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_passages_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_value, expected_value)

    @patch('watson_developer_cloud.DiscoveryV1')
    def test_questions_trained(self, discovery):
        question_count = 5000
        agg = 'term(question.title,count:%s)'
        expected_agg = agg % str(question_count)
        expected_query_opts = {
          'aggregation': expected_agg,
          'count': 0
        }
        expected_value = [
          {'question': 'Can you tell a cabbie which route to take?',
           'is_training_query': True}
        ]
        mock_response = json.loads(
          """
            {
              "matching_results": 37314,
              "aggregations": [
                {
                  "type": "term",
                  "field": "question.title",
                  "count": 1,
                  "results": [
                    {
                      "key": "Can you tell a cabbie which route to take?",
                      "matching_results": 24
                    }
                  ]
                }
              ]
            }
          """ # noqa
        )
        mock_training_data_response = json.loads(
          """
            {
              "environment_id": "env_id",
              "collection_id": "coll_id",
              "queries": [
                {
                  "query_id": "q_id",
                  "natural_language_query": "Can you tell a cabbie which route to take?",
                  "filter": "",
                  "examples": [
                    {
                      "document_id": "doc_id",
                      "cross_reference": "cross_id",
                      "relevance": 0
                    }
                  ]
                }
              ]
            }
          """ # noqa
        )
        discovery.query = MagicMock(return_value=mock_response)
        discovery.list_training_data = MagicMock(
          return_value=mock_training_data_response)

        actual_value = get_questions(
                        discovery=discovery,
                        constants=constants,
                        question_count=question_count,
                        feature_type="trained")
        discovery.query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_trained_collection_id',
          query_options=expected_query_opts
        )
        discovery.list_training_data.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_trained_collection_id',
        )
        self.assertEqual(actual_value, expected_value)


if __name__ == '__main__':
    unittest.main()
