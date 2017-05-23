### Discovery Starter Kit

A repo containing the basics for setting up one of the watson developer cloud SDKs with a use case

### Client

Client side is built with [React](https://facebook.github.io/react/)

#### Development

1. Run `npm start --prefix client/knowledge_base_search` - visit http://locahost:3000/
1. To run statically through your server, run `npm run build --prefix client/knowledge_base_search` to produce static assets

### Server - Python

1. Install [python](https://www.python.org/) version 2.7
1. Install [virtual_env](https://virtualenv.pypa.io/en/stable/)
1. Activate `virtualenv`
  1. `virtualenv .` in project root directory
  1. `source bin/activate` in project root directory
1. Install dependencies `pip install -r server/python/requirements/dev.txt`
1. Make a copy of `.env.example` at `.env` and fill with your service credentials by setting up new services on bluemix
  1. [Discovery](https://console.ng.bluemix.net/catalog/services/discovery?taxonomyNavigation=watson)
  1. [Natural Language Understanding](https://console.ng.bluemix.net/catalog/services/natural-language-understanding?taxonomyNavigation=watson)
1. Start server `python server/python/server.py`
1. Visit http://localhost:5000/

#### Development

1. Linter run with `flask8`
1. Tests run with `pytest`

### Setting up the Data

After setting up python and the Bluemix services, run `python server/python/upload_documents.py`

It will take all the documents in the `data/sample` directory and push them into both "regular" and "enriched" collections as named by the `DISCOVERY_REGULAR_COLLECTION_NAME` and `DISCOVERY_ENRICHED_COLLECTION_NAME` in your `.env` file

## Privacy Notice

Sample web applications that include this package may be configured to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service on each deployment:

* Python package version
* Python repository URL
* Application Name (`application_name`)
* Application GUID (`application_id`)
* Application instance index number (`instance_index`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `setup.py` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.
