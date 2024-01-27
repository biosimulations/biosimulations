FROM python:3.11-slim

# build and install poetry app
RUN pip install poetry
RUN poetry config virtualenvs.in-project true

# copy project files
WORKDIR /app
COPY pyproject.toml poetry.lock README.md pytest.ini /app/
COPY simdata_api /app/simdata_api
COPY tests /app/tests
COPY local_data /app/local_data

# install dependencies (with dev dependencies for in-place testing)
RUN poetry install

#RUN poetry run python -m pytest

# activate poetry virtualenv
ENV PATH="/app/.venv/bin:$PATH"
ENV CONFIG_ENV_FILE="/app/config/config.env"
ENV SECRET_ENV_FILE="/app/secret/secret.env"
ENV STORAGE_GCS_CREDENTIALS_FILE="/app/secret/gcs_credentials.json"
ENV STORAGE_LOCAL_CACHE_DIR="/app/scratch"

VOLUME /app/secret
VOLUME /app/config
VOLUME /app/scratch

# activate the poetry virtualenv each new non-interative shell
RUN echo "source /app/.venv/bin/activate" >> /etc/bash.bashrc

# run the app
CMD ["uvicorn", "simdata_api.main:app", "--host", "0.0.0.0", "--port", "3333" ]
