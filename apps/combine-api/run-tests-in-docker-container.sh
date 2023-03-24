#!/bin/bash

docker run \
  --rm \
  --entrypoint bash \
  --mount type=bind,source=$(pwd)/apps/combine-api,target=/app/apps/combine-api \
  ghcr.io/biosimulations/combine-api:sha-$(git rev-parse HEAD | cut -c 1-7) \
  -c "
    pipenv install --dev --system --deploy
    pip uninstall -y matplotlib
    pip install matplotlib==3.2.0
    mv src src-ignore
    export PYTHONPATH=apps/combine-api
    /bin/bash /xvfb-startup.sh python -m pytest \
      --verbose \
      --cov apps/combine-api/combine_api/ --cov-report=xml \
      apps/combine-api/tests/
  "
