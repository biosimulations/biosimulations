from urllib.parse import unquote

import numpy as np
from fastapi import FastAPI

from simdata_api.datamodels import DatasetData
from simdata_api.internal.hdf5_utils import get_s3_dataset_as_ndarray

app = FastAPI(
    title="simdata-api",
    version="1.0.0"
)
app.dependency_overrides = {}


@app.get("/")
async def root():
    return {"message": "Hello from simdata-api"}


@app.get("/health")
async def health():
    return {'status': 'ok'}


@app.get("/datasets/{run_id}")
def read_dataset(run_id: str, dataset_name: str) -> DatasetData:
    dataset_name = unquote(dataset_name)
    data: np.ndarray = get_s3_dataset_as_ndarray(run_id=run_id, dataset_name=dataset_name)
    return DatasetData(shape=list(data.shape), values=data.flatten())
