import logging
from datetime import datetime
from urllib.parse import unquote

from fastapi import FastAPI

from simdata_api.datamodels import DatasetData, HDF5File, StatusResponse, Status
from simdata_api.datastore import get_dataset_data, get_results_timestamp, get_hdf5_metadata as get_metadata
from .log_config import setup_logging

# Set up logging at the start of your application
setup_logging()

# logger for this module
logger = logging.getLogger(__name__)

app = FastAPI(title="simdata-api", version="1.0.0")
app.dependency_overrides = {}


@app.get("/")
async def root():
    logger.info("invoked root()")
    return {"message": "Hello from simdata-api"}


@app.get(
    "/health", response_model=StatusResponse, name="Health", operation_id="get-health"
)
async def health() -> StatusResponse:
    logger.info("invoked health()")
    return StatusResponse(status=Status.ok)


@app.get(
    "/datasets/{run_id}/data",
    response_model=DatasetData,
    name="Read Dataset",
    operation_id="read-dataset",
)
async def read_dataset(run_id: str, dataset_name: str) -> DatasetData:
    logger.info(
        "invoked read_dataset(run_id=%s, dataset_name=%s)", run_id, dataset_name
    )
    dataset_name = unquote(dataset_name)
    array, attrs = await get_dataset_data(run_id=run_id, dataset_name=dataset_name)
    return DatasetData(shape=list(array.shape), values=array.flatten().tolist())


@app.get(
    "/datasets/{run_id}/modified",
    response_model=datetime,
    name="Modified datetime",
    operation_id="get-modified",
)
async def get_modified_datetime(run_id: str) -> datetime:
    logger.info("invoked get_modified_datetime(run_id=%s)", run_id)
    return await get_results_timestamp(run_id=run_id)


@app.get(
    "/datasets/{run_id}/metadata",
    response_model=HDF5File,
    name="HDF5 file metadata",
    operation_id="get-metadata",
)
async def get_hdf5_metadata(run_id: str) -> HDF5File:
    logger.info("invoked get_hdf5_metadata(run_id=%s)", run_id)
    hdf5_file = await get_metadata(run_id=run_id)
    return hdf5_file
