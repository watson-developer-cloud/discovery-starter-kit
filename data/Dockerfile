FROM debian

RUN apt-get update && \
    apt-get install -y git ca-certificates curl build-essential \
    python python-dev python-virtualenv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

CMD git clone https://github.com/watson-developer-cloud/discovery-starter-kit && \
    cd discovery-starter-kit && \
    sh data/setup_data.sh
