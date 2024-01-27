import logging
from datetime import datetime
from urllib.parse import unquote

from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware

from simdata_api.datamodels import DatasetData, HDF5File, StatusResponse, Status
from simdata_api.datastore import get_dataset_data, get_results_timestamp, get_hdf5_metadata as get_metadata
from .log_config import setup_logging

# Set up logging at the start of your application
setup_logging()

# logger for this module
logger = logging.getLogger(__name__)

app = FastAPI(title="simdata-api", version="1.0.0")
app.dependency_overrides = {}
# enable cross-origin resource sharing (CORS)
origins = [
    'http://127.0.0.1:4200',
    'http://127.0.0.1:4201',
    'http://127.0.0.1:4202',
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'https://biosimulators.org',
    'https://www.biosimulators.org',
    'https://biosimulators.dev',
    'https://www.biosimulators.dev',
    'https://run.biosimulations.dev',
    'https://run.biosimulations.org',
    'https://biosimulations.dev',
    'https://biosimulations.org',
    'https://bio.libretexts.org',
]
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello from simdata-api"}


@app.get(
    "/health", response_model=StatusResponse, name="Health", operation_id="get-health"
)
async def health() -> StatusResponse:
    return StatusResponse(status=Status.ok)


@app.get(
    "/datasets/{run_id}/data",
    response_model=DatasetData,
    name="Read Dataset",
    operation_id="read-dataset",
    responses={
        404: {"description": "Dataset not found"},
    }
)
async def read_dataset(run_id: str, dataset_name: str) -> DatasetData:
    try:
        dataset_name = unquote(dataset_name)
        array, attrs = await get_dataset_data(run_id=run_id, dataset_name=dataset_name)
        return DatasetData(shape=list(array.shape), values=array.flatten().tolist())
    except FileNotFoundError as e:
        logger.warning(f"failed to retrieve dataset: {str(e)}")
        raise HTTPException(status_code=404, detail="Dataset not found")


@app.get(
    "/datasets/{run_id}/modified",
    response_model=datetime,
    name="Modified datetime",
    operation_id="get-modified",
    responses={
        404: {"description": "Dataset not found"},
    }
)
async def get_modified_datetime(run_id: str) -> datetime:
    try:
        return await get_results_timestamp(run_id=run_id)
    except FileNotFoundError as e:
        logger.warning(f"failed to retrieve modified date: {str(e)}")
        raise HTTPException(status_code=404, detail="Dataset not found")


@app.get(
    "/datasets/{run_id}/metadata",
    response_model=HDF5File,
    name="HDF5 file metadata",
    operation_id="get-metadata",
    responses={
        404: {"description": "Dataset not found"},
    }
)
async def get_hdf5_metadata(run_id: str) -> HDF5File:
    try:
        hdf5_file = await get_metadata(run_id=run_id)
        return hdf5_file
    except FileNotFoundError as e:
        logger.warning(msg=f"failed to retrieve metadata: {str(e)}")
        raise HTTPException(status_code=404, detail="Dataset not found")
