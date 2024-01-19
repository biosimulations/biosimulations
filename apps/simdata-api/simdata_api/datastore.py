import logging
from datetime import datetime

import numpy as np

from simdata_api.datamodels import HDF5File
from simdata_api.internal.hdf5_utils import get_s3_hdf5_metadata, get_s3_dataset_as_ndarray
from simdata_api.internal.s3_aiobotocore import get_s3_modified_date

logger = logging.getLogger(__name__)


async def get_dataset_data(run_id: str, dataset_name: str) -> np.ndarray:
    data: np.ndarray = await get_s3_dataset_as_ndarray(
        run_id=run_id, dataset_name=dataset_name
    )
    return data


async def get_results_timestamp(run_id: str) -> datetime:
    return await get_s3_modified_date(s3_path=f"simulations/{run_id}/contents/reports.h5")


async def get_hdf5_metadata(run_id: str) -> HDF5File:
    return await get_s3_hdf5_metadata(run_id=run_id)
