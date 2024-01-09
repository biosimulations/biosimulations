FROM python:3.11-slim

# build and install poetry app
RUN pip install poetry
RUN poetry config virtualenvs.in-project true

# copy project files
WORKDIR /app
COPY . /app

# install dependencies
RUN poetry install --no-dev

EXPOSE 8000

# activate poetry virtualenv
ENV PATH="/app/.venv/bin:$PATH"

# activate the poetry virtualenv each new non-interative shell
RUN echo "source /app/.venv/bin/activate" >> /etc/bash.bashrc

# run the app
CMD ["uvicorn", "simdata_api.main:app"]
