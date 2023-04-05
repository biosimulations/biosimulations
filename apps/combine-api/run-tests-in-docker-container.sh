#!/bin/bash
set -x

# installs and tests local combine-api inside of docker container
# need to re-install because local poetry virtual environment is not mounted.

docker run \
  --rm \
  --entrypoint bash \
  --mount type=bind,source=$(pwd)/apps/combine-api,target=/app/combine-api \
  ghcr.io/biosimulations/combine-api:sha-$(git rev-parse HEAD | cut -c 1-7) \
  -c "
    cd /app/combine-api
    poetry install
    poetry run python -m pytest --verbose /app/tests/
    "
