import json
import os
import sys
from watson_developer_cloud import WatsonException

if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import discovery, curdir, get_constants # noqa

print('Retrieving environment and collection constants...')
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
                        regular_name=os.getenv(
                                      'DISCOVERY_REGULAR_COLLECTION_NAME',
                                      'knowledge_base_regular'
                                    ),
                        trained_name=os.getenv(
                                      'DISCOVERY_TRAINED_COLLECTION_NAME',
                                      'knowledge_base_trained'
                                    )
                      )
ENVIRONMENT_ID = discovery_constants['environment_id']
COLLECTION_ID = discovery_constants['collection_id']['trained']

try:
    collection_response = discovery.get_collection(
                            environment_id=ENVIRONMENT_ID,
                            collection_id=COLLECTION_ID)
    print(json.dumps(collection_response['training_status'], indent=4))
except WatsonException as exception:
    print("discovery get_collection response:")
    print(exception)
