import os
import json
from get_discovery_collections import get_constants
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
from watson_developer_cloud import DiscoveryV1

try:
    load_dotenv(find_dotenv())
except IOError:
    print('warning: no .env file loaded')

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

# retrieve the following:
# {
#   environment_id,
#   collection_id_regular,
#   collection_id_enriched
# }
constants = get_constants(
              discovery,
              regular_name=os.getenv('DISCOVERY_REGULAR_COLLECTION_NAME'),
              enriched_name=os.getenv('DISCOVERY_ENRICHED_COLLECTION_NAME')
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


@app.route('/api/query/<collection_type>', methods=['POST'])
def query(collection_type):
    collection_id_key = 'collection_id_regular'
    if collection_type == 'enriched':
        collection_id_key = 'collection_id_enriched'

    return jsonify(
              discovery.query(
                environment_id=constants['environment_id'],
                collection_id=constants[collection_id_key],
                query_options=json.loads(request.data)
              )
            )


if __name__ == '__main__':
    # If we are in the Bluemix environment, set port to 0.0.0.0
    # otherwise set it to localhost (127.0.0.1)
    HOST = '0.0.0.0' if os.getenv('VCAP_APPLICATION') else '127.0.0.1'
    # Get port from the Bluemix environment, or default to 5000
    PORT_NUMBER = int(os.getenv('PORT', '5000'))

    app.run(host=HOST, port=PORT_NUMBER, debug=False)
