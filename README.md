### Discovery Starter Kit

A repo containing the basics for setting up one of the watson developer cloud SDKs with a use case

### Python

1. Install [python](https://www.python.org/) version 2.7
1. Install [virtual_env](https://virtualenv.pypa.io/en/stable/)
1. Activate `virtualenv`
  1. `virtualenv .` in project root directory
  1. `bin/activate` in project root directory
1. Install dependencies `pip install -r server/python/requirements/dev.txt`
1. Make a copy of `.env.example` at `.env` and fill with your service credentials by setting up new services on bluemix
  1. (Discovery)[https://console.ng.bluemix.net/catalog/services/discovery?taxonomyNavigation=watson]
  1. (Natural Language Understanding)[https://console.ng.bluemix.net/catalog/services/natural-language-understanding?taxonomyNavigation=watson]
1. Start server `python server/python/server.py`
1. Visit http://localhost:5000/
