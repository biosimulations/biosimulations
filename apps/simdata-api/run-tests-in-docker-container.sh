#!/bin/bash
set -x

# installs and tests local simdata-api inside of docker container
# need to re-install because local poetry virtual environment is not mounted.

docker run \
  --rm \
  --entrypoint bash \
  --mount type=bind,source=$(pwd)/apps/simdata-api,target=/app/simdata-api \
  ghcr.io/biosimulations/simdata-api:sha-$(git rev-parse HEAD | cut -c 1-7) \
  -c "
    cd /app/simdata-api
    poetry install
    poetry run python -m pytest --verbose /app/tests/
    "
