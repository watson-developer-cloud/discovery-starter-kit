import requests
import json
import os
import glob
import sys
from dotenv import load_dotenv, find_dotenv
from helpers import get_constants
from watson_developer_cloud import DiscoveryV1
import time

try:
    load_dotenv(find_dotenv())
except IOError:
    print('warning: no .env file loaded')

discovery = DiscoveryV1(
              url=os.getenv('DISCOVERY_URL'),
              username=os.getenv('DISCOVERY_USERNAME'),
              password=os.getenv('DISCOVERY_PASSWORD'),
              version='2017-01-01'
            )

print('Retrieving environment and collection constants...')
# retrieve the following:
# {
#   environment_id,
#   collection_id_regular,
#   collection_id_enriched
# }
discovery_constants = get_constants(
                        discovery,
                        regular_name=os.getenv(
                                      'DISCOVERY_REGULAR_COLLECTION_NAME',
                                      'knowledge_base_regular'
                                    ),
                        enriched_name=os.getenv(
                                      'DISCOVERY_ENRICHED_COLLECTION_NAME',
                                      'knowledge_base_enriched'
                                    )
                      )
print('Constants retrieved!')
print(discovery_constants)

collections_url = os.getenv('DISCOVERY_URL')
collections_url += '/v1/environments/'
collections_url += discovery_constants['environment_id']
collections_url += '/collections/'
seconds_to_sleep = 5


def upload_document(file_object, collection_id, current_iteration):
    # normally we would just use discovery
    # but the update document method isn't implemented
    document_json = json.loads(file_object.read())
    # reset the file cursor to the beginning
    file_object.seek(0)
    auth = (os.getenv('DISCOVERY_USERNAME'), os.getenv('DISCOVERY_PASSWORD'))
    querystring = {'version': '2017-01-01'}
    discovery_path = collections_url
    discovery_path += collection_id
    discovery_path += '/documents/'
    discovery_path += str(document_json['id'])
    files = {'file': file_object}
    r = requests.request(
          method='POST',
          url=discovery_path,
          files=files,
          auth=auth,
          params=querystring
        )
    # reset the file cursor to the beginning
    file_object.seek(0)
    response_json = r.json()
    if r.status_code != 202:
        # sleep and retry
        print(response_json)
        print('Retrying document: ' + file_object.name)
        next_iteration = current_iteration + 1
        time.sleep(seconds_to_sleep * next_iteration)
        upload_document(file_object, collection_id, next_iteration)
    else:
        print(response_json)


def upload_documents(sample_docs_glob):
    print('Sample Docs Directory: ' + sample_docs_glob)
    print('Number of files to process:' +
          str(len(glob.glob(sample_docs_glob))))
    for file in glob.glob(sample_docs_glob):
        file_object = open(file, 'rb')
        print('Processing file: ' + file_object.name + ' for "regular"')
        upload_document(
          file_object,
          discovery_constants['collection_id_regular'],
          0
        )
        print('Processing file: ' + file_object.name + ' for "enriched"')
        upload_document(
          file_object,
          discovery_constants['collection_id_enriched'],
          0
        )
        file_object.close()


if __name__ == '__main__':
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        path = os.path.abspath(
          os.path.join(
            os.path.dirname(__file__),
            '..',
            '..',
            'data',
            'sample',
            '*.json'
          )
        )
    upload_documents(path)
