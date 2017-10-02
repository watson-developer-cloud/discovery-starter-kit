import json
import os
import glob
import sys
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

# set the TRAINING_PATH to the location of the training data relative
# to the 'data' directory
# by default, evaluates to <DATA_TYPE>/training
TRAINING_PATH = os.path.join(DATA_TYPE, 'training')

DATA_DIRECTORY = os.path.abspath(os.path.join(curdir, '..', 'data'))
TRAINING_DIRECTORY = os.path.join(DATA_DIRECTORY, TRAINING_PATH)
LOG_FILE_PATH = os.path.join(DATA_DIRECTORY, 'training_upload.log')
logging.basicConfig(filename=LOG_FILE_PATH,
                    filemode='w',
                    format='%(asctime)s %(levelname)s: %(message)s',
                    level=logging.INFO)


def upload_training_doc(training_json, environment_id, collection_id):
    try:
        r = discovery.add_training_data_query(
                environment_id=environment_id,
                collection_id=collection_id,
                natural_language_query=training_json['natural_language_query'],
                examples=training_json['examples'])
        logging.info("Response:\n%s", json.dumps(r, indent=4))
    except WatsonException as exception:
        logging.error(exception)


def upload_training_data(training_directory):
    print("Training directory: %s" % training_directory)
    files = glob.glob(os.path.join(training_directory, '*.json'))
    total_files = len(files)
    print("Number of files to process: %d" % total_files)

    training_data_uploaded = 0
    done_percent = 0

    write_progress(training_data_uploaded, total_files)
    for file in files:
        with open(file, 'rb') as file_object:
            logging.info("Processing file: %s", file_object.name)
            upload_training_doc(
              json.loads(file_object.read()),
              discovery_constants['environment_id'],
              discovery_constants['collection_id']['trained']
            )
            training_data_uploaded += 1
            done_percent = write_progress(training_data_uploaded,
                                          total_files,
                                          done_percent)

    logging.info("Finished uploading %d files", total_files)
    print("\nFinished uploading %d files" % total_files)


print('Retrieving environment and collection constants...')
"""
retrieve the following:
{
  environment_id: env_id,
  collection_id: {
    trained: trained_id
  }
}
"""
discovery_constants = get_constants(
                        discovery,
                        trained_name=os.getenv(
                                      'DISCOVERY_TRAINED_COLLECTION_NAME',
                                      'knowledge_base_trained'
                                    )
                      )
print('Constants retrieved!')
print(discovery_constants)
print("Log file located at: %s" % LOG_FILE_PATH)
upload_training_data(TRAINING_DIRECTORY)
