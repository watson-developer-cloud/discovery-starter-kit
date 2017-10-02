# Always prefer setuptools over distutils
from setuptools import setup
# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='discovery-starter-kit',
    version='1.0.0',
    description='Watson Discovery Service Starter Kit',
    long_description=long_description,
    url='https://github.com/watson-developer-cloud/discovery-starter-kit',
    license='MIT'
)
