import os
from pathlib import Path

import pytest

from simdata_api.internal.hdf5_utils import get_s3_dataset_as_ndarray

RUN_ID="61fd573874bc0ce059643515"
DATASET_NAME="/simulation_1.sedml/report"
S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"


@pytest.mark.asyncio
async def test_get_s3_dataset_as_ndarray():
    ndarray = get_s3_dataset_as_ndarray(run_id=RUN_ID, dataset_name=DATASET_NAME)
    assert ndarray.shape == (21, 201)

    LOCAL_STORAGE_PATH = "../local_data"
    LOCAL_PATH = Path(f"{LOCAL_STORAGE_PATH}/{RUN_ID}.h5")
    if LOCAL_PATH.exists():
        os.remove(LOCAL_PATH)
