#!/bin/bash

python --version
echo "Downloading virtualenv..."
curl -O "https://pypi.python.org/packages/source/v/virtualenv/virtualenv-15.0.0.tar.gz"
echo "Unzipping virtualenv..."
tar xvfz virtualenv-15.0.0.tar.gz
echo "Setting up virtualenv..."
python virtualenv-15.0.0/virtualenv.py my_new_env
. my_new_env/bin/activate

echo "Installing dependencies..."
pip install -r server/python/requirements/production.txt

# make the directory
DIRECTORY_NAME="stackexchange_travel"
echo "Making directory '${DIRECTORY_NAME}'"
mkdir $DIRECTORY_NAME
echo "Directory created"

# Download from stackexchange
FILE_NAME="travel.stackexchange.com.7z"
DATA_LOCATION="${DIRECTORY_NAME}/${FILE_NAME}"
DOWNLOAD_URL="https://archive.org/download/stackexchange/${FILE_NAME}"
echo "Downloading files from ${DOWNLOAD_URL}"
curl -L -o "${DATA_LOCATION}" "${DOWNLOAD_URL}"
echo "Downloads Complete!"

echo "Unzip files..."
7z e -o$DIRECTORY_NAME $DATA_LOCATION

# run extraction
echo "Begin extraction"
python -u server/python/extract_stackexchange_dump.py -i ./stackexchange_travel
echo "Finished extraction!"

# run upload
echo "Beginning upload..."
python -u server/python/upload_documents.py "./stackexchange_travel/*.json"
echo "Finished uploading!"
