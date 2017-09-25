### Discovery Starter Kit [![Build Status](https://api.travis-ci.org/watson-developer-cloud/discovery-starter-kit.svg)](https://travis-ci.org/watson-developer-cloud/discovery-starter-kit)

A repo containing the basics for setting up one of the watson developer cloud SDKs with a Q&A use case

### Knowledge Base Search

Shows the comparison on what the Watson Discovery Service can add to your data to make the search experience return more relevant results

[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/24261964d00b59942cda0befd0535f50/button.svg)](https://bluemix.net/deploy?repository=https://github.com/watson-developer-cloud/discovery-starter-kit)

When this button is clicked, it will begin the process of creating a deployment toolchain based on the master branch of the repo into Bluemix and you will have to modify the application name to the name of the host you want to put it at. The default will get mapped to {organization/user}-{repo_name}-{timestamp}.

The running demo of this `knowledge-base-search` is at [https://knowledge-base-search.mybluemix.net](https://knowledge-base-search.mybluemix.net)

After creating the toolchain, you must either run the deployment script as part of the [Continuous Delivery](https://www.ibm.com/devops/method/content/deliver/practice_continuous_delivery/) which will create the services for you, or refer to the [Services](#services) section below to create them manually.

#### Services

The deployment script found in the "Create Toolchain" should automatically create a NLU service if it doesn't exist, but an instance of Discovery will require additional configuration even when the deployment script creates it. See the section below about [creating collections and configurations](#setting-up-discovery) in Discovery. To do the manual creation of these required services, follow these steps:

1. Make a copy of `.env.example` at `.env` and fill with your service credentials by setting up new services on bluemix
  1. [Discovery](https://console.ng.bluemix.net/catalog/services/discovery?taxonomyNavigation=watson)
  1. [Natural Language Understanding](https://console.ng.bluemix.net/catalog/services/natural-language-understanding?taxonomyNavigation=watson)

### Setting up Discovery

You may use the [Watson Discovery Tooling](https://discovery-tooling.mybluemix.net) UI to complete these next steps.

Or if you prefer using python scripts aided by markdown-formatted explanation (known as [Jupyter Notebooks](http://jupyter.readthedocs.io/en/latest/index.html)), you can use the steps found in `notebooks/Setup_Discovery.ipynb` of this repo. The `notebook` section can be run locally by doing `pip install -r server/python/requirements/dev.txt` followed by `jupyter notebook` which will prompt you to open your browser to follow the steps in the interactive code guide. Each script can be run independently as each step is located in the `notebooks/scripts` directory.

1. Create 2 collections in the Watson Discovery Service. Make sure to store the names in the `.env` file and add them to the environment variables in your deployment configuration. In case you want a different collection for the passage search feature, you may provide one (otherwise it is the same as the "regular" collection). By default, they are set to:
   ```
   DISCOVERY_PASSAGES_COLLECTION_NAME=knowledge_base_regular
   DISCOVERY_REGULAR_COLLECTION_NAME=knowledge_base_regular
   DISCOVERY_TRAINED_COLLECTION_NAME=knowledge_base_trained
   ```
1. Upload sample documents to the collections you created by dragging and dropping files from the `data/sample` directory into each collection created in the Watson Discovery Tooling UI

### Running the application

Once the toolchain is created, the services are created, the Discovery Service is configured, and the data is uploaded, you can either make a commit to your repo to trigger a new build or manually run the deployment in the toolchain created above.

View your running app at the host defined by the application name defined in your toolchain setup above (which by default will be `https://{organization/user}-{repo_name}-{timestamp}.mybluemix.net`)

### Client

Client side is built with [React](https://facebook.github.io/react/)

#### Development

1. Run `npm install --prefix client/knowledge_base_search` to install the necessary dependencies.
1. Run `npm start --prefix client/knowledge_base_search` - visit http://locahost:3000/
1. To run statically through your server, run `npm run build --prefix client/knowledge_base_search` to produce static assets
1. Linter run with `npm run lint --prefix client/knowledge_base_search`
1. Unit tests run with `npm run test-unit --prefix client/knowledge_base_search`
1. Integration tests run with `npm run test-integration --prefix client/knowledge_base_search` (NOTE: `npm run build --prefix client/knowledge_base_search` must be run first)
1. Run all tests with `npm test --prefix client/knowledge_base_search`

### Server - Python

1. Install [python](https://www.python.org/) version 2.7
1. Install [virtual_env](https://virtualenv.pypa.io/en/stable/)
1. Activate `virtualenv` for this project by running the following commands from the project root directory:
    1. `virtualenv .`
    1. `source bin/activate`
1. Install dependencies `pip install -r server/python/requirements/dev.txt`
1. Start server `python server/python/server.py`
1. Visit http://localhost:5000/

#### Development

1. Linter run with `flake8`
1. Tests run with `pytest`

#### License

This sample code is licensed under the [MIT License](https://opensource.org/licenses/MIT).

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
