import os
import shutil
from pathlib import Path

import numpy as np
import pytest

from simdata_api.config import get_settings
from simdata_api.datamodels import ATTRIBUTE_VALUE_TYPE
from simdata_api.datamodels import HDF5File
from simdata_api.internal.hdf5_utils import extract_hdf5_metadata, extract_hdf5_dataset_array
from simdata_api.internal.tensorstore_utils import write_ts_dataset, write_ts_metadata_root, TS_DRIVER, KV_DRIVER, \
    read_ts_dataset

DATASET_NAME = "/simulation_1.sedml/report"
ROOT_DIR = Path(__file__).parent.parent.parent
TEST_MATRIX = [
    ('n5', 'file'), ('n5', 'gcs'),  # ('n5', 's3'),
    ('zarr', 'file'), ('zarr', 'gcs'),  # ('zarr', 's3'),
    ('zarr3', 'file'), ('zarr3', 'gcs')  # ('zarr3', 's3')
]


@pytest.mark.asyncio
@pytest.mark.parametrize("driver,kvstore_driver", TEST_MATRIX)
async def test_extract_hdf5_metadata(driver: TS_DRIVER, kvstore_driver: KV_DRIVER):
    if kvstore_driver == 'gcs' and os.path.exists(get_settings().storage_gcs_credentials_file) is False:
        pytest.skip("STORAGE_GCS_CREDENTIALS_FILE not found")

    store_path = Path("local_data") / f"hdf5_to_{driver}"
    hdf5_file_path = ROOT_DIR / "local_data" / "repressilator_copasi.h5"

    if kvstore_driver == 'file':
        store_path = ROOT_DIR / store_path

    # read HDF5File object from the HDF5 file:
    hdf5_file: HDF5File = extract_hdf5_metadata(local_file_path=hdf5_file_path)

    expected_arrays = {}
    # write the HDF5File object to the local tensorstore:
    await write_ts_metadata_root(driver=driver, kvstore_driver=kvstore_driver, kvstore_root_path=store_path,
                                 hdf5_file=hdf5_file)
    for group in hdf5_file.groups:
        for dataset in group.datasets:
            array: np.ndarray = extract_hdf5_dataset_array(local_file_path=hdf5_file_path, dataset_name=dataset.name)
            expected_arrays[dataset.name] = array
            await write_ts_dataset(driver=driver, kvstore_driver=kvstore_driver,
                                   kvstore_path=store_path / Path(dataset.name),
                                   data=array, attributes={attr.key: attr.value for attr in dataset.attributes})

    if kvstore_driver == 'file':
        assert store_path.exists()

    for group in hdf5_file.groups:
        for dataset in group.datasets:
            # read the data and verify that it matches the test data:
            array, attr = await read_ts_dataset(driver=driver, kvstore_driver=kvstore_driver,
                                                kvstore_path=store_path / Path(dataset.name))
            assert array.shape == tuple(dataset.shape)
            if driver in ['zarr3', 'n5']:
                assert attr == {attr.key: attr.value for attr in dataset.attributes}
            elif driver == 'zarr':
                assert attr == {}
            assert np.array_equiv(expected_arrays[dataset.name], array)

    if kvstore_driver == 'file':
        shutil.rmtree(store_path)


@pytest.mark.asyncio
@pytest.mark.parametrize("driver,kvstore_driver", TEST_MATRIX)
async def test_simple_dataset(driver: TS_DRIVER, kvstore_driver: KV_DRIVER):
    if kvstore_driver == 'gcs' and os.path.exists(get_settings().storage_gcs_credentials_file) is False:
        pytest.skip("STORAGE_GCS_CREDENTIALS_FILE not found")

    test_file_path = Path("local_data") / f"toy_{driver}"
    if kvstore_driver == 'file':
        test_file_path = ROOT_DIR / test_file_path

    test_array = np.random.rand(100, 200)
    test_attributes: dict[str, ATTRIBUTE_VALUE_TYPE] = {"key": "value"}

    # write test data to the local tensorstore:
    await write_ts_dataset(driver=driver, kvstore_driver=kvstore_driver, kvstore_path=test_file_path,
                           data=test_array, attributes=test_attributes)

    if kvstore_driver == 'file':
        assert test_file_path.exists()

    # read the data and verify that it matches the test data:
    array, attr = await read_ts_dataset(driver=driver, kvstore_driver=kvstore_driver, kvstore_path=test_file_path)
    assert np.array_equiv(test_array, array)
    if driver in ['zarr3', 'n5']:
        assert attr == test_attributes
    elif driver == 'zarr':
        assert attr == {}  # the TensorStore zarr driver does not support user-defined attributes

    if kvstore_driver == 'file':
        shutil.rmtree(test_file_path)
