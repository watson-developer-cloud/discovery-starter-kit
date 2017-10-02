# Bluemix Container for Data Setup

You need `docker` CLI and `bluemix` (`bx` for short) CLI installed.

Follow steps on [Bluemix Container Service CLI](https://console.bluemix.net/docs/containers/cs_cli_install.html#cs_cli_install) to get the CLI setup and logged in.

Then also make sure you have the [Bluemix Container Registry CLI](https://console.bluemix.net/docs/services/Registry/index.html) installed as well.

Replace `<your_org>`, `<container_name>`, and `<memory_size>`(see [Available memory sizes](#available-memory-sizes))

## Setup

1. Create a `.env` file from the `.env.example` with the proper credentials for your instance
1. `docker build -t registry.ng.bluemix.net/<your_org>/discovery-starter-kit ./data`
1. `bluemix cr namespace-add <your_org>` (if you haven't already created a namespace)
1. `docker push registry.ng.bluemix.net/<your_org>/discovery-starter-kit`
1. `bluemix ic run --env-file .env -m <memory_size> --name <container_name> registry.ng.bluemix.net/<your_org>/discovery-starter-kit:latest`
1. Track your container logs by running `bluemix ic logs -f <container_name>`
1. SSH into your running container by running `bluemix ic exec -t -i <container_name> /bin/bash`

## Cleanup

1. Remove the container using `bluemix ic rm <container_name>`
1. If finished with the docker image, remove the image with `bluemix ic rm registry.ng.bluemix.net/<your_org>/discovery-starter-kit`

### Available memory sizes:

- Pico (64 MB memory, 4 GB disk space)
- Nano (128 MB memory, 8 GB disk space)
- Micro (256 MB memory, 16 GB disk space)
- Tiny (512 MB memory, 32 GB disk space)
- Small (1024 MB memory, 64 GB disk space)
- Medium (2048 MB memory, 128 GB disk space)
- Large (4096 MB memory, 256 GB disk space)
- X-Large (8192 MB memory, 512 GB disk space)
- 2X-Large (16384 MB memory, 1 TB disk space)

If you do not set a size for your container, each container instance is created with 256 MB.
**Important**: Enter the container memory in MB without the unit label. For example, if you want to create a pico container, enter `-m 64`.

See [CLI Reference](https://console.bluemix.net/docs/containers/container_cli_reference_cfic.html#container_cli_reference) for more details on available commands and options
