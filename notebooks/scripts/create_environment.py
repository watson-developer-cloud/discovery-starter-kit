import os
import sys
import json

# load the proper path for discovery setup utils
if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import discovery, find_byod_environment_id  # noqa

# please provide any custom name of the environment below
ENVIRONMENT_NAME = 'byod'

# Size of the enviroment to create.
# For trial, use 0. For other plans see documentation
ENVIRONMENT_SIZE = 0

environment_id = ''
output = discovery.get_environments()
try:
    environment_id = find_byod_environment_id(output)
except:
    print ('Command:')
    print ('discovery.get_environments')
    print ('Response:')
    print (json.dumps(output, indent=4))

if not(environment_id == ''):
    print 'Environment already exists with ID ' + environment_id + '.'
    print json.dumps(output, indent=4)
else:
    # Running command that creates a environment
    output = discovery.create_environment(name=ENVIRONMENT_NAME,
                                          description="Default environment",
                                          size=ENVIRONMENT_SIZE)
    print('New Environment created:')
    print(json.dumps(output, indent=4))
