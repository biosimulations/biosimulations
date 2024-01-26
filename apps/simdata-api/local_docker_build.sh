#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker build --tag ghcr.io/biosimulations/simdata-api:sha-$(git rev-parse HEAD | cut -c 1-7) ${SCRIPT_DIR}
