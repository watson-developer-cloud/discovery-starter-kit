import sys
import os
import glob
import json

# load the proper path for discovery setup utils
if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))
from discovery_setup_utils import curdir  # noqa

DATA_TYPE = 'travel'
TRAINING_DIR = os.path.join(os.path.abspath(curdir),
                            '..',
                            'data',
                            DATA_TYPE,
                            'training')

TRAINING_DOCUMENT_GLOB = os.path.join(TRAINING_DIR, '*.json')
with open(glob.glob(TRAINING_DOCUMENT_GLOB)[0]) as training_doc:
    print(json.dumps(json.loads(training_doc.read()), indent=4))
