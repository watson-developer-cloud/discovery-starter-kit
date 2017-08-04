import os
import sys
import json

# load the proper path for discovery setup utils
if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import (
  discovery,
  find_byod_environment_id,
  find_collection_id
) # noqa

# retrieve the regular collection name from the .env file or default
COLLECTION_NAME = os.getenv('DISCOVERY_REGULAR_COLLECTION_NAME',
                            'knowledge_base_regular')

# retrieve our environment id
ENVIRONMENT_ID = find_byod_environment_id(discovery.get_environments())
print('Environment ID: ' + ENVIRONMENT_ID)

# Check to see if collection already exists
collection_id = ''
output = discovery.list_collections(environment_id=ENVIRONMENT_ID)

try:
    collection_id = find_collection_id(output, COLLECTION_NAME)
    print('Collection ID: ' + collection_id)
except:
    print ('Command:')
    print ('discovery.list_collections')
    print ('Response:')
    print (json.dumps(output, indent=4))

if not(collection_id == ''):
    print 'Collection "' + COLLECTION_NAME + '" already exists.'
    print json.dumps(output, indent=4)
else:
    # Run the command to create a new collection
    output = discovery.create_collection(environment_id=ENVIRONMENT_ID,
                                         name=COLLECTION_NAME)
    print ('Collection creation response:')
    print (json.dumps(output, indent=4))
