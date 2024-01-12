import os
from datetime import datetime
from pathlib import Path
from urllib.parse import quote
from json import dumps as json_dumps

import pytest
from fastapi.testclient import TestClient

from simdata_api.datamodels import HDF5File, StatusResponse, Status
from simdata_api.main import app

client = TestClient(app)


@pytest.mark.asyncio
async def test_root():
    response = client.get("/")
    data = response.json()
    assert data == {"message": "Hello from simdata-api"}


@pytest.mark.asyncio
async def test_health():
    response = client.get("/health")
    data = response.json()
    assert StatusResponse.model_validate_json(response.content.decode('utf-8')) == StatusResponse(status=Status.ok)
    assert StatusResponse.model_validate_strings(data) == StatusResponse(status=Status.ok)


@pytest.mark.asyncio
async def test_read_dataset():
    RUN_ID = "61fd573874bc0ce059643515"
    DATASET_NAME = quote("/simulation_1.sedml/report", safe="")
    url = f"/datasets/{RUN_ID}?dataset_name={DATASET_NAME}"
    response = client.get(url)
    data = response.json()
    assert response.status_code == 200
    assert data['shape'] == [21, 201]

    LOCAL_STORAGE_PATH = "../local_data"
    LOCAL_PATH = Path(f"{LOCAL_STORAGE_PATH}/{RUN_ID}.h5")
    if LOCAL_PATH.exists():
        os.remove(LOCAL_PATH)


@pytest.mark.asyncio
async def test_get_modified():
    RUN_ID = "61fd573874bc0ce059643515"
    url = f"/datasets/{RUN_ID}/modified"
    response = client.get(url)
    data = response.json()
    assert response.status_code == 200
    assert type(data) == str
    assert datetime.fromisoformat(data) is not None


@pytest.mark.asyncio
async def test_get_metadata():
    RUN_ID = "61fd573874bc0ce059643515"
    url = f"/datasets/{RUN_ID}/metadata"
    response = client.get(url)
    data = response.json()
    assert response.status_code == 200
    assert type(data) == dict
    hdf5_file = HDF5File.model_validate_json(json_dumps(data))
    hdf5_file = HDF5File.model_validate_json(response.content.decode('utf-8'))
    assert hdf5_file.filename == f"../local_data/{RUN_ID}.h5"
    assert hdf5_file.uri is not None
    assert hdf5_file.id == RUN_ID
    if Path(data['filename']).exists():
        os.remove(data['filename'])
