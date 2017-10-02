import json
import os
import glob
import sys
import time
import logging
from watson_developer_cloud import WatsonException

if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import ( # noqa
  discovery,
  curdir,
  get_constants,
  write_progress
)

# set the DATA_TYPE the same to what was downloaded
DATA_TYPE = 'travel'

# set the DOCS_PATH to the location of the json documents relative
# to the 'data' directory
# by default, evaluates to <DATA_TYPE>/json
DOCS_PATH = os.path.join(DATA_TYPE, 'json')
# DOCS_PATH = 'sample'

# set the number of files to process (0 is all files in the DOCS_PATH)
DOC_UPLOAD_LIMIT = int(os.getenv('DOC_UPLOAD_LIMIT', 100))

DATA_DIRECTORY = os.path.abspath(os.path.join(curdir, '..', 'data'))
DOCS_DIRECTORY = os.path.join(DATA_DIRECTORY, DOCS_PATH)
LOG_FILE_PATH = os.path.join(DATA_DIRECTORY, 'upload.log')
logging.basicConfig(filename=LOG_FILE_PATH,
                    filemode='w',
                    format='%(asctime)s %(levelname)s: %(message)s',
                    level=logging.INFO)


def upload_document(file_object, environment_id, collection_id, iteration=0):
    seconds_to_sleep = 5
    document_json = json.loads(file_object.read())
    # reset the file cursor to the beginning
    file_object.seek(0)
    try:
        r = discovery.update_document(environment_id=environment_id,
                                      collection_id=collection_id,
                                      document_id=document_json['id'],
                                      file_info=file_object)
        logging.info("Response:\n%s", json.dumps(r, indent=4))
    except WatsonException as exception:
        if 'Code: 429' in str(exception):
            logging.warn(exception)
            # Rate limited - slow down and try again
            file_object.seek(0)
            logging.warn("Retrying document: %s", file_object.name)
            next_iteration = iteration + 1
            time.sleep(seconds_to_sleep * next_iteration)
            upload_document(file_object,
                            environment_id,
                            collection_id,
                            next_iteration)
        else:
            logging.error(exception)


def upload_documents(docs_directory):
    print("Docs directory: %s" % docs_directory)
    files = glob.glob(os.path.join(docs_directory, '*.json'))
    if DOC_UPLOAD_LIMIT > 0:
        files = files[:DOC_UPLOAD_LIMIT]
    total_files = len(files)
    print("Number of files to process: %d" % total_files)

    docs_uploaded = 0
    done_percent = 0
    collection_ids = [discovery_constants['collection_id']['regular'],
                      discovery_constants['collection_id']['trained']]
    total_documents = total_files * len(collection_ids)

    write_progress(docs_uploaded, total_documents)
    for file in files:
        with open(file, 'rb') as file_object:
            for collection_id in collection_ids:
                logging.info("Processing file: %s for collection: %s",
                             file_object.name,
                             collection_id)
                upload_document(
                  file_object,
                  discovery_constants['environment_id'],
                  collection_id
                )
                file_object.seek(0)
                docs_uploaded += 1
                done_percent = write_progress(docs_uploaded,
                                              total_documents,
                                              done_percent)

    logging.info("Finished uploading %d files", total_files)
    print("\nFinished uploading %d files" % total_files)


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
print('Constants retrieved!')
print(discovery_constants)
print("Log file located at: %s" % LOG_FILE_PATH)
upload_documents(DOCS_DIRECTORY)
