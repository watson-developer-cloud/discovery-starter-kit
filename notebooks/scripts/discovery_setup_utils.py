import os
import sys
import errno
from watson_developer_cloud import DiscoveryV1
from dotenv import load_dotenv, find_dotenv

# setup import path to helpers
curdir = os.getcwd()
if '__file__' in globals():
    curdir = os.path.join(os.path.abspath(__file__), '..', '..')
project_dir = os.path.abspath(
  os.path.join(
    curdir,
    '..',
    'server',
    'python'
  )
)
sys.path.insert(0, project_dir)

from helpers import ( # noqa
  find_byod_environment_id,
  find_collection_id,
  get_constants
)

try:
    load_dotenv(find_dotenv())
except IOError:
    print('warning: no .env file loaded')

# loading credentials
URL = os.getenv('DISCOVERY_URL')
USERNAME = os.getenv('DISCOVERY_USERNAME')
PASSWORD = os.getenv('DISCOVERY_PASSWORD')
VERSION = '2017-01-01'

# Initialize Discovery Service using Watson Developer Cloud Python SDK
discovery = DiscoveryV1(
  url=URL,
  username=USERNAME,
  password=PASSWORD,
  version=VERSION
)


def makeSurePathExists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise


def write_progress(items_complete, total_items, previous_complete_percent=0):
    symbol = '='
    progress_symbols = 50
    new_complete_percent = int(items_complete * 100 / total_items)
    complete = int(items_complete * progress_symbols / total_items)
    # don't overload the write buffer
    if new_complete_percent > previous_complete_percent:
        sys.stdout.write("\r[%s%s] %d%%" % (symbol * complete,
                                            ' ' * (progress_symbols-complete),
                                            new_complete_percent))
        sys.stdout.flush()
    return new_complete_percent
