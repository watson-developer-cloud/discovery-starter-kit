import os
from flask import Flask, jsonify
from dotenv import load_dotenv, find_dotenv
from watson_developer_cloud import DiscoveryV1

try:
    load_dotenv(find_dotenv())
except IOError:
    print('warning: no .env file loaded')

app = Flask(__name__)

# Discovery
discovery = DiscoveryV1(
              url=os.getenv('DISCOVERY_BASE_URL'),
              username=os.getenv('DISCOVERY_USERNAME'),
              password=os.getenv('DISCOVERY_PASSWORD'),
              version="2016-12-01"
            )


@app.route('/')
def index():
    return 'Watson Discovery Service Starter Kit'


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


if __name__ == '__main__':

    app.run()
