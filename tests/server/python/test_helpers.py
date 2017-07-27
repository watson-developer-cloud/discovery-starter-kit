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
  'collection_id_regular': 'my_regular_collection_id',
  'collection_id_enriched': 'my_enriched_collection_id'
}


class TestHelpers(unittest.TestCase):

    @patch('watson_developer_cloud.DiscoveryV1')
    @unittest.skip('function NoneType error for get_passage_search_questions')
    def test_questions(self, discovery):
        question_count = 5000
        agg = 'term(question.title,count:%s).min(answer_metadata.length)'
        expected_agg = agg % str(question_count)
        expected_query_opts = {
          'aggregation': expected_agg,
          'count': 0
        }
        expected_value = [
          'Can you tell a cabbie which route to take?'
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
                      "matching_results": 24,
                      "aggregations": [
                        {
                          "type": "min",
                          "field": "answer_metadata.length",
                          "value": 501
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          """ # noqa
        )
        discovery.query = MagicMock(return_value=mock_response)

        actual_value = get_questions(discovery, constants, question_count)
        discovery.query.assert_called_with(
          environment_id='my_environment_id',
          collection_id='my_regular_collection_id',
          query_options=expected_query_opts
        )
        self.assertEqual(actual_value, expected_value)


if __name__ == '__main__':
    unittest.main()
