#!/bin/bash

python --version
echo "Downloading virtualenv..."
curl -O https://pypi.python.org/packages/source/v/virtualenv/virtualenv-15.0.0.tar.gz
echo "Unzipping virtualenv..."
tar xvfz virtualenv-15.0.0.tar.gz
echo "Setting up virtualenv..."
python virtualenv-15.0.0/virtualenv.py my_new_env
. my_new_env/bin/activate

echo "Installing dependencies..."
pip install -r server/python/requirements/production.txt

# make the directory
echo "Making directory 'stackexchange_travel'"
mkdir stackexchange_travel
echo "Directory created"

# Download from stackexchange
FILE_NAME="travel.stackexchange.com.7z"
DOWNLOAD_URL="https://archive.org/download/stackexchange/${FILE_NAME}"
echo "Downloading files from ${DOWNLOAD_URL}"
curl --connect-timeout 5 --max-time 10 --retry 5 --retry-delay 0 --retry-max-time 60 -k -sL -o./stackexchange_travel "${DOWNLOAD_URL}"
echo "Downloads Complete!"

echo "Unzip files..."
7z e $FILE_NAME

# run extraction
echo "Begin extraction"
python -u server/python/extract_stackexchange_dump.py -i ./stackexchange_travel
echo "Finished extraction!"

# run upload
echo "Beginning upload..."
python -u server/python/upload_documents.py "./stackexchange_travel/*.json"
echo "Finished uploading!"
