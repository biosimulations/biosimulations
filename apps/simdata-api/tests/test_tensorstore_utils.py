import shutil
from pathlib import Path

import numpy as np
import pytest
import tensorstore as ts

from simdata_api.datamodels import HDF5Dataset, HDF5File
from simdata_api.internal.hdf5_utils import extract_hdf5_metadata
from simdata_api.internal.tensorstore_utils import write_dataset, write_metadata_root, TS_DRIVER, read_from_local_ts

RUN_ID = "61fd573874bc0ce059643515"
DATASET_NAME = "/simulation_1.sedml/report"
S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"
ROOT_DIR = Path(__file__).parent.parent


@pytest.mark.asyncio
@pytest.mark.parametrize("driver", ['n5', 'zarr', 'zarr3'])
async def test_extract_hdf5_metadata(driver: TS_DRIVER):
    zarr_file_path = ROOT_DIR / "local_data" / f"hdf5_to_{driver}"
    hdf5_file_path = ROOT_DIR / "local_data" / "repressilator_copasi.h5"

    # read HDF5File object from the HDF5 file:
    hdf5_file: HDF5File = extract_hdf5_metadata(hdf5_file_path)

    # write the HDF5File object to the local tensorstore:
    await write_metadata_root(driver=driver, kvstore_driver='file', kvstore_root_path=zarr_file_path, hdf5_file=hdf5_file)
    assert zarr_file_path.exists()

    for group in hdf5_file.groups:
        for dataset in group.datasets:
            # read the data and verify that it matches the test data:
            array, attr = await read_from_local_ts(driver=driver, kvstore_driver='file', kvstore_path=zarr_file_path/Path(dataset.name))
            assert array.shape == tuple(dataset.shape)
            if driver in ['zarr3', 'n5']:
                assert attr == {attr.key: attr.value for attr in dataset.attributes}
            elif driver == 'zarr':
                assert attr == {}

    shutil.rmtree(zarr_file_path)


@pytest.mark.asyncio
@pytest.mark.parametrize("driver", ['n5', 'zarr', 'zarr3'])
async def test_simple_dataset(driver: TS_DRIVER):
    test_file_path = ROOT_DIR / "local_data" / f"toy_{driver}"

    test_array = np.random.rand(100, 200)
    test_attributes = {"key": "value"}

    # write test data to the local tensorstore:
    await write_dataset(driver=driver, kvstore_driver='file', kvstore_path=test_file_path,
                        data=test_array, attributes=test_attributes)
    assert test_file_path.exists()

    # read the data and verify that it matches the test data:
    array, attr = await read_from_local_ts(driver=driver, kvstore_driver='file', kvstore_path=test_file_path)
    assert np.array_equiv(test_array, array)
    if driver in ['zarr3', 'n5']:
        assert attr == test_attributes
    elif driver == 'zarr':
        assert attr == {}  # the TensorStore zarr driver does not support user-defined attributes

    shutil.rmtree(test_file_path)
