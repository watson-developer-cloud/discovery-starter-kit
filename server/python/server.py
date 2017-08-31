import os
import sys
import json
from helpers import get_constants, get_questions
from flask import Flask, jsonify, render_template, request
from flask_sslify import SSLify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from requests.exceptions import HTTPError
from dotenv import load_dotenv, find_dotenv
import watson_developer_cloud.natural_language_understanding.features.v1 as features  # noqa
from watson_developer_cloud import DiscoveryV1, NaturalLanguageUnderstandingV1
import cf_deployment_tracker

try:
    load_dotenv(find_dotenv())
except IOError:
    print('warning: no .env file loaded')

# Emit Bluemix deployment event if not a demo deploy
if not(os.getenv('DEMO_DEPLOY')):
    cf_deployment_tracker.track()

app = Flask(
        __name__,
        static_folder="../../client/knowledge_base_search/build/static",
        template_folder="../../client/knowledge_base_search/build"
      )

# force SSL
sslify = SSLify(app)

# Limit requests
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=['240 per minute', '4 per second'],
    headers_enabled=True
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

"""
retrieve the following:
{
  environment_id: env_id,
  collection_id: {
    passages: passages_id,
    regular: regular_id,
    trained: trained_id
  }
}
"""
constants = get_constants(
              discovery,
              passages_name=os.getenv(
                            'DISCOVERY_PASSAGES_COLLECTION_NAME',
                            'knowledge_base_regular'
                          ),
              regular_name=os.getenv(
                            'DISCOVERY_REGULAR_COLLECTION_NAME',
                            'knowledge_base_regular'
                          ),
              trained_name=os.getenv(
                            'DISCOVERY_TRAINED_COLLECTION_NAME',
                            'knowledge_base_trained'
                          )
            )
try:
    total_questions = int(os.getenv('DISCOVERY_QUESTION_COUNT', 5000))
except ValueError:
    sys.exit('DISCOVERY_QUESTION_COUNT not an integer, terminating...')

passages_question_cache = get_questions(
                            discovery=discovery,
                            constants=constants,
                            question_count=total_questions,
                            feature_type='passages')
trained_question_cache = get_questions(
                            discovery=discovery,
                            constants=constants,
                            question_count=total_questions,
                            feature_type='trained')


@app.route('/')
@limiter.exempt
def index():
    return render_template('index.html')


@app.route('/api/query/<collection_type>', methods=['POST'])
def query(collection_type):
    query_options = json.loads(request.data)
    query_options['return'] = 'text'

    if collection_type == 'passages':
        query_options['passages'] = True

    # retrieve more results for regular so that we can compare original rank
    if collection_type == 'regular':
        query_options['count'] = 100

    return jsonify(
              discovery.query(
                environment_id=constants['environment_id'],
                collection_id=constants['collection_id'][collection_type],
                query_options=query_options
              )
            )


@app.route('/api/questions/<feature_type>', methods=['GET'])
def questions(feature_type):
    if feature_type == 'passages':
        return jsonify(passages_question_cache)
    else:
        return jsonify(trained_question_cache)


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(
            error="API Rate Limit exceeded: %s" % e.description,
            code=429), 429


@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    error = 'Error processing the request'
    if isinstance(e, HTTPError):
        code = e.code
        error = str(e.message)

    return jsonify(error=error, code=code), code


if __name__ == '__main__':
    # If we are in the Bluemix environment
    PRODUCTION = True if os.getenv('VCAP_APPLICATION') else False
    # set port to 0.0.0.0, otherwise set it to localhost (127.0.0.1)
    HOST = '0.0.0.0' if PRODUCTION else '127.0.0.1'
    # Get port from the Bluemix environment, or default to 5000
    PORT_NUMBER = int(os.getenv('PORT', '5000'))

    app.run(host=HOST, port=PORT_NUMBER, debug=not(PRODUCTION))
