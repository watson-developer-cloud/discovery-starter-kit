import sys
import os
import requests
import py7zlib

if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import ( # noqa
    curdir,
    makeSurePathExists,
    write_progress
)

# modify this data type to the dataset of your choosing
DATA_TYPE = 'travel'

data_dir = os.path.abspath(os.path.join(os.path.abspath(curdir), '..', 'data'))

file_name = "%s.stackexchange.com.7z" % DATA_TYPE
archive_file = os.path.join(data_dir, file_name)
if not(os.path.exists(archive_file)):
    url = "https://archive.org/download/stackexchange/%s" % file_name
    r = requests.get(url, stream=True)
    try:
        with open(archive_file, 'wb') as file:
            print "Downloading %s" % url
            total_length = r.headers.get('content-length')
            if total_length is None:  # no content length header
                file.write(r.content)
            else:
                dl = 0
                done_percent = 0
                total_length = int(total_length)
                write_progress(dl, total_length)
                for chunk in r:
                    file.write(chunk)
                    dl += len(chunk)
                    done_percent = write_progress(dl,
                                                  total_length,
                                                  done_percent)
    finally:
        r.close()

    print("")
    print("Archive saved to: %s" % archive_file)

print("Begin extraction of %s" % archive_file)
EXTRACTION_DIR = os.path.join(data_dir, DATA_TYPE)
makeSurePathExists(EXTRACTION_DIR)

with open(archive_file, 'rb') as in_file:
    archive = py7zlib.Archive7z(in_file)
    for name in archive.getnames():
        out_filename = os.path.join(EXTRACTION_DIR, name)
        print("Writing file: %s" % out_filename)
        with open(out_filename, 'wb') as out_file:
            out_file.write(archive.getmember(name).read())

print("Archive extraction complete! Directory: %s" % EXTRACTION_DIR)
