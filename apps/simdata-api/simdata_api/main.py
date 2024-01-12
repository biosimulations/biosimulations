from datetime import datetime
from urllib.parse import unquote

import numpy as np
from fastapi import FastAPI

from simdata_api.datamodels import DatasetData, StatusResponse, Status
from simdata_api.internal.hdf5_utils import get_s3_dataset_as_ndarray, get_results_timestamps

app = FastAPI(
    title="simdata-api",
    version="1.0.0"
)
app.dependency_overrides = {}


@app.get("/")
async def root():
    return {"message": "Hello from simdata-api"}


@app.get("/health", response_model=StatusResponse, name="Health", operation_id="get-health")
async def health() -> StatusResponse:
    return StatusResponse(status=Status.ok)


@app.get("/datasets/{run_id}", response_model=DatasetData, name="Read Dataset", operation_id="read-dataset")
def read_dataset(run_id: str, dataset_name: str) -> DatasetData:
    dataset_name = unquote(dataset_name)
    data: np.ndarray = get_s3_dataset_as_ndarray(run_id=run_id, dataset_name=dataset_name)
    return DatasetData(shape=list(data.shape), values=data.flatten())

@app.get("/datasets/{run_id}/modified", response_model=datetime, name="Modified datetime", operation_id="get-modified")
def get_modified_datetime(run_id: str) -> datetime:
    return get_results_timestamps(run_id=run_id)
