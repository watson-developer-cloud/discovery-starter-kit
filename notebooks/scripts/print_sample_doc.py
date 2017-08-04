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

SAMPLE_DOCUMENT_GLOB = os.path.join(
                        os.path.abspath(curdir),
                        '..',
                        'data',
                        'sample',
                        '*.json'
                      )
with open(glob.glob(SAMPLE_DOCUMENT_GLOB)[0]) as sample_doc:
    print(json.dumps(json.loads(sample_doc.read()), indent=4))
