import os
import sys
import json
import time

# load the proper path for discovery setup utils
if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import discovery, find_byod_environment_id  # noqa


def getEnvironmentStatusMessage(output):
    message = 'Status for "' + output.get('name') + '" '
    message += 'is "' + output.get('status') + '"'
    return message


# Running command that gets your environment from a list of environments
environments_response = discovery.get_environments()
ENVIRONMENT_ID = find_byod_environment_id(environments_response)

if not(ENVIRONMENT_ID == ''):
    # Running command that checks the status of your environment
    output = discovery.get_environment(environment_id=ENVIRONMENT_ID)
    while output.get('status') == 'pending':
        print(getEnvironmentStatusMessage(output))
        time.sleep(5)
        output = discovery.get_environment(environment_id=ENVIRONMENT_ID)

    print(getEnvironmentStatusMessage(output))
else:
    print('BYOD Environment ID not found')
    print(json.dumps(environments_response, indent=4))
