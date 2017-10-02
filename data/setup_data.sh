#!/bin/bash
set -e

python --version
echo "Setting up virtualenv..."
virtualenv data_setup_env
. data_setup_env/bin/activate

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r server/python/requirements/dev.txt

python -u notebooks/scripts/download_and_extract_data.py
python -u notebooks/scripts/transform_xml_to_json.py

# set the number of documents to upload to unlimited (0)
: ${DOC_UPLOAD_LIMIT:=0}
export DOC_UPLOAD_LIMIT
python -u notebooks/scripts/upload_documents.py
