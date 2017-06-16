FROM debian

RUN apt-get update && \
    apt-get install -y p7zip-full git ca-certificates python && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    git clone https://github.com/watson-developer-cloud/discovery-starter-kit

CMD ['sh data/setup_data.sh']
