#!/bin/bash

set -e

npm install --prefix client/knowledge_base_search
npm run build --prefix client/knowledge_base_search

sed s~'command: gunicorn server:app -b 0.0.0.0:$PORT'~'command: python server/python/server.py'~g ./manifest.yml > manifest.yml

if ! grep -Fxq 'DISCOVERY_PASSAGES_COLLECTION_NAME' ./manifest.yml
then
  sed $'s/env:/env:\\\n    DISCOVERY_PASSAGES_COLLECTION_NAME=knowledge_base_regular\\\n    DISCOVERY_REGULAR_COLLECTION_NAME=knowledge_base_regular\\\n    DISCOVERY_TRAINED_COLLECTION_NAME=knowledge_base_trained/g' manifest.yml > manifest.yml
fi

cat > ./requirements.txt <<EOL
-r server/python/requirements/production.txt

python notebooks/scripts/create_collection.py 'DISCOVERY_PASSAGES_COLLECTION_NAME' 'knowledge_base_regular'
python notebooks/scripts/create_collection.py 'DISCOVERY_REGULAR_COLLECTION_NAME' 'knowledge_base_regular'
python notebooks/scripts/create_collection.py 'DISCOVERY_TRAINED_COLLECTION_NAME' 'knowledge_base_trained'
