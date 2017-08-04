import os
import sys
import json
import time
import glob

# load the proper path for discovery setup utils
if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import ( # noqa
  discovery,
  find_byod_environment_id,
  find_collection_id,
  curdir
)

ENVIRONMENT_ID = find_byod_environment_id(discovery.get_environments())

# retrieve the regular collection name from the .env file or default
COLLECTION_NAME = os.getenv('DISCOVERY_REGULAR_COLLECTION_NAME',
                            'knowledge_base_regular')
COLLECTION_ID = find_collection_id(
                  discovery.list_collections(environment_id=ENVIRONMENT_ID),
                  COLLECTION_NAME)

# Please make sure your documents are in data/sample directory or modify this
SAMPLE_DOCUMENT_GLOB = os.path.join(curdir, 'data', 'sample', '*.json')
print(SAMPLE_DOCUMENT_GLOB)
SAMPLE_DOCUMENT = glob.glob(SAMPLE_DOCUMENT_GLOB)[0]

with open(SAMPLE_DOCUMENT, 'r') as fileinfo:
    output = discovery.update_document(environment_id=ENVIRONMENT_ID,
                                       collection_id=COLLECTION_ID,
                                       document_id='some_user_controlled_id',
                                       file_info=fileinfo)

print('Update document response:')
print(json.dumps(output, indent=4))

# check if the document is ready yet
while output.get('status') == 'processing':
    print('Still processing document id: ' + output.get('document_id'))
    time.sleep(5)
    output = discovery.get_document(environment_id=ENVIRONMENT_ID,
                                    collection_id=COLLECTION_ID,
                                    document_id=output.get('document_id'))
    print('Get document status response:')
    print(json.dumps(output, indent=4))

# query the collection
query_opts = {}
query_response = discovery.query(environment_id=ENVIRONMENT_ID,
                                 collection_id=COLLECTION_ID,
                                 query_options=query_opts)
print('Query response:')
print(json.dumps(query_response, indent=4))

# remove the document
output = discovery.delete_document(environment_id=ENVIRONMENT_ID,
                                   collection_id=COLLECTION_ID,
                                   document_id=output.get('document_id'))
print('Remove document response:')
print(json.dumps(output, indent=4))
