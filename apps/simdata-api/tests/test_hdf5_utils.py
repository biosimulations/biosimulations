import os
from pathlib import Path

import pytest

from simdata_api.datamodels import HDF5File
from simdata_api.internal.hdf5_utils import (
    extract_hdf5_metadata,
    get_s3_dataset_as_ndarray,
    get_s3_hdf5_metadata,
)

RUN_ID = "61fd573874bc0ce059643515"
DATASET_NAME = "/simulation_1.sedml/report"
S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"
ROOT_DIR = Path(__file__).parent.parent


@pytest.mark.asyncio
async def test_get_s3_dataset_as_ndarray():
    ndarray = await get_s3_dataset_as_ndarray(run_id=RUN_ID, dataset_name=DATASET_NAME)
    assert ndarray.shape == (21, 201)

    LOCAL_PATH = ROOT_DIR / "local_data" / f"{RUN_ID}.h5"
    if LOCAL_PATH.exists():
        os.remove(LOCAL_PATH)


def test_extract_hdf5_metadata():
    test_file_path = ROOT_DIR / "local_data" / "repressilator_copasi.h5"
    hdf5_file: HDF5File = extract_hdf5_metadata(test_file_path)

    assert hdf5_file.filename == str(test_file_path)
    assert hdf5_file.uri == ""
    assert hdf5_file.id == ""


@pytest.mark.asyncio
async def test_get_s3_hdf5_metadata():
    test_file_path = ROOT_DIR / "local_data" / f"{RUN_ID}.h5"
    hdf5_file: HDF5File = await get_s3_hdf5_metadata(RUN_ID)

    # round trip test of serialization
    assert HDF5File.model_validate_json(hdf5_file.model_dump_json()) == hdf5_file

    assert hdf5_file.filename == str(test_file_path)
    assert hdf5_file.uri is not None
    assert hdf5_file.id == RUN_ID
    # Add more assertions here to check the groups, datasets, and attributes of the HDF5 file
    os.remove(test_file_path)
