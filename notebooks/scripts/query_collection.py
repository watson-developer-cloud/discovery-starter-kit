import sys
import os
import json

if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import discovery, get_constants # noqa

# please provide the query to test
QUESTION = "Will my passport number change when I renew it?"

# please provide the number of documents the query should return
MAX_DOCUMENTS = 10

REGULAR_COLLECTION_NAME = os.getenv('DISCOVERY_REGULAR_COLLECTION_NAME',
                                    'knowledge_base_regular')
TRAINED_COLLECTION_NAME = os.getenv('DISCOVERY_TRAINED_COLLECTION_NAME',
                                    'knowledge_base_trained')

# please provide the collection desired
DESIRED_COLLECTION_NAME = REGULAR_COLLECTION_NAME

"""
retrieve the following:
{
  environment_id: env_id,
  collection_id: {
    regular: regular_id,
    trained: trained_id
  }
}
"""
discovery_constants = get_constants(
                        discovery,
                        regular_name=REGULAR_COLLECTION_NAME,
                        trained_name=TRAINED_COLLECTION_NAME,
                      )
COLLECTION_ID = discovery_constants['collection_id']['regular']
if DESIRED_COLLECTION_NAME == TRAINED_COLLECTION_NAME:
    COLLECTION_ID = discovery_constants['collection_id']['trained']

qopts = {'natural_language_query': QUESTION, 'count': MAX_DOCUMENTS}

# Invoke search using Discovery query API
output = discovery.query(environment_id=discovery_constants['environment_id'],
                         collection_id=COLLECTION_ID,
                         query_options=qopts)
try:
    print ("No. of rows : %d" % output.get('matching_results'))
    print ("Results : %s" % json.dumps(output['results'], indent=4))
except:
    print ('Command:')
    print ('discovery.query()')
    print ('Response:')
    print (output)
