#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker run \
  --rm \
  --entrypoint bash \
  --mount "type=bind,source=${SCRIPT_DIR}/local_data,target=/app/simdata-api/local_data" \
  ghcr.io/biosimulations/simdata-api:sha-$(git rev-parse HEAD | cut -c 1-7) \
  -c "poetry run python -m pytest --verbose"
