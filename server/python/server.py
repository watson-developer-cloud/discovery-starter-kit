import os
import json
from get_discovery_collections import get_constants
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from requests.exceptions import HTTPError
from dotenv import load_dotenv, find_dotenv
import watson_developer_cloud.natural_language_understanding.features.v1 as features  # noqa
from watson_developer_cloud import DiscoveryV1, NaturalLanguageUnderstandingV1
import cf_deployment_tracker

try:
    load_dotenv(find_dotenv())
except IOError:
    print('warning: no .env file loaded')

# Emit Bluemix deployment event
cf_deployment_tracker.track()

app = Flask(
        __name__,
        static_folder="../../client/knowledge_base_search/build/static",
        template_folder="../../client/knowledge_base_search/build"
      )
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Discovery
discovery = DiscoveryV1(
              url=os.getenv('DISCOVERY_URL'),
              username=os.getenv('DISCOVERY_USERNAME'),
              password=os.getenv('DISCOVERY_PASSWORD'),
              version="2016-12-01"
            )

# NLU
nlu = NaturalLanguageUnderstandingV1(
        url=os.getenv('NLU_URL'),
        username=os.getenv('NLU_USERNAME'),
        password=os.getenv('NLU_PASSWORD'),
        version="2017-02-27"
      )

# retrieve the following:
# {
#   environment_id,
#   collection_id_regular,
#   collection_id_enriched
# }
constants = get_constants(
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


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/environments')
def get_environments():
    return jsonify(discovery.get_environments())


@app.route('/api/environments/<environment_id>')
def get_environment(environment_id):
    return jsonify(discovery.get_environment(environment_id=environment_id))


@app.route('/api/environments/<environment_id>/configurations')
def list_configurations(environment_id):
    return jsonify(
              discovery.list_configurations(
                environment_id=environment_id
              )
            )


@app.route('/api/environments/<environment_id>/configurations/<configuration_id>') # noqa
def get_configuration(environment_id, configuration_id):
    return jsonify(
              discovery.get_configuration(
                environment_id=environment_id,
                configuration_id=configuration_id
              )
            )


@app.route('/api/environments/<environment_id>/collections')
def list_collections(environment_id):
    return jsonify(discovery.list_collections(environment_id=environment_id))


@app.route('/api/environments/<environment_id>/collections/<collection_id>')
def get_collection(environment_id, collection_id):
    return jsonify(
              discovery.get_collection(
                environment_id=environment_id,
                collection_id=collection_id
              )
            )


def get_enriched_query(question):
    response = nlu.analyze(text=question, features=[features.Keywords()])
    keywords = response.get('keywords', [])
    query = ','.join(map(lambda keyword: keyword['text'], keywords))

    if len(query) > 0:
        return {'query': 'enriched_text.keywords.text:' + query}
    else:
        return {'query': question}


@app.route('/api/query/<collection_type>', methods=['POST'])
def query(collection_type):
    collection_id_key = 'collection_id_regular'
    query_options = json.loads(request.data)

    if collection_type == 'enriched':
        collection_id_key = 'collection_id_enriched'
        query_options = get_enriched_query(query_options['query'])

    return jsonify(
              discovery.query(
                environment_id=constants['environment_id'],
                collection_id=constants[collection_id_key],
                query_options=query_options
              )
            )


@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    error = 'Error processing the request'
    if isinstance(e, HTTPError):
        code = e.code
        error = str(e.message)

    return jsonify(error=error, code=code), code


if __name__ == '__main__':
    # If we are in the Bluemix environment, set port to 0.0.0.0
    # otherwise set it to localhost (127.0.0.1)
    HOST = '0.0.0.0' if os.getenv('VCAP_APPLICATION') else '127.0.0.1'
    # Get port from the Bluemix environment, or default to 5000
    PORT_NUMBER = int(os.getenv('PORT', '5000'))

    app.run(host=HOST, port=PORT_NUMBER, debug=False)
