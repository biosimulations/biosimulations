from pathlib import Path

import h5py
import numpy as np
from fastapi import FastAPI
from h5py import Dataset

from .datamodels import DatasetData

app = FastAPI(
  title="simdata-api",
  version="1.0.0"
)


@app.get("/")
async def root():
  return {"message": "Hello World"}


@app.get("/health")
async def health():
  return {'status': 'ok'}


@app.get("/datasets/{run_id}/{dataset_name}")
async def read_dataset(run_id: str, dataset_name: str) -> DatasetData:
  h5_path = await get_local_hdf5_file(run_id)
  with h5py.File(h5_path, "r") as f:
    dataset: Dataset = f[dataset_name]
    data = dataset[:]
    print(f"dataset type is {type(dataset)}")
    print(f"data type is {type(data)}")
    return DatasetData(values=list(data))


async def get_local_hdf5_file(run_id: str) -> Path:
  h5_path = Path(f"../local_data/{run_id}.h5")
  if h5_path.exists():
    return h5_path
  else:
    raise ValueError(f"Run {run_id} does not exist")
