import logging
import os
from pathlib import Path

import numpy as np
import tensorstore as ts
from tensorstore import TensorStore, Spec as TensorStoreSpec

from simdata_api.config import get_settings, KV_DRIVER, TS_DRIVER
from simdata_api.datamodels import ATTRIBUTE_VALUE_TYPE, HDF5File, HDF5Group, HDF5Dataset

DATA_TYPE = 'float64'
COMPRESSION = 'gzip'

logger = logging.getLogger(__name__)


async def write_ts_metadata_root(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_root_path: Path,
                                 hdf5_file: HDF5File) -> None:
    # for each group in the HDF5File object, create a group in the tensorstore
    for group in hdf5_file.groups:
        await _write_ts_metadata_group(driver, kvstore_driver, kvstore_root_path, group)


async def _write_ts_metadata_group(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_root_path: Path,
                                   hdf5_group: HDF5Group) -> None:
    # for each dataset in the HDF5Group object, create a dataset in the tensorstore
    if hdf5_group.attributes:
        # TODO: write attributes to group without dataset array
        pass
    for dataset in hdf5_group.datasets:
        await _write_ts_metadata_dataset(driver, kvstore_driver, kvstore_root_path, dataset)


async def _write_ts_metadata_dataset(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_root_path: Path,
                                     hdf5_dataset: HDF5Dataset) -> None:
    logger.info(f"write metadata and fake zeros array to {driver} store {str(kvstore_root_path / hdf5_dataset.name)}")
    shape = tuple(hdf5_dataset.shape)
    attrs = {attr.key: attr.value for attr in hdf5_dataset.attributes}
    ts_spec: TensorStoreSpec = _get_ts_spec(driver, kvstore_driver, kvstore_root_path / hdf5_dataset.name, shape, attrs)
    dataset: TensorStore = await ts.open(ts_spec)
    data = np.zeros(shape=shape, dtype=float)  # should be a no-op because fill is zero
    await dataset.write(data)


async def read_ts_dataset(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path) -> tuple[
    np.ndarray, dict[str, str | list[str]]]:
    logger.info(f"read array and metadata from {driver} store {kvstore_path}")
    spec = _get_basic_spec(driver, kvstore_driver, kvstore_path)
    try:
        dataset: TensorStore = await ts.open(spec)
        array: np.ndarray = await dataset.read(order='C')
        spec: dict = dataset.spec().to_json()
        # test if dictionary spec['metadata']['attributes'] exists checking also for missing 'metadata' key:
        if 'metadata' in spec and 'attributes' in spec['metadata']:
            # return array and the value of the key 'attributes':
            return array, spec['metadata']['attributes']
        else:
            # return array and an empty dictionary:
            return array, {}
    except ValueError as e:
        if str(e).find("NOT_FOUND") >= 0:
            raise FileNotFoundError(f"File {kvstore_path} not found in {kvstore_driver} store")
        else:
            logger.exception(e)
            raise e


def _get_basic_spec(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path):
    settings = get_settings()

    spec = {}
    spec['driver'] = driver
    spec['kvstore'] = {}
    spec['kvstore']['driver'] = kvstore_driver
    spec['kvstore']['path'] = str(kvstore_path)
    if kvstore_driver == 'file':
        pass
    elif kvstore_driver == 's3':
        spec['kvstore']['bucket'] = settings.storage_bucket
        spec['kvstore']['endpoint'] = settings.storage_endpoint_url  # +"/storage/v1/b"
        spec['kvstore']['host_header'] = "storage.googleapi.com"
        spec['kvstore']['aws_region'] = settings.storage_region
        os.environ['AWS_ACCESS_KEY_ID'] = settings.storage_access_key_id
        os.environ['AWS_SECRET_ACCESS_KEY'] = settings.storage_secret
        os.environ['TENSORSTORE_VERBOSE_LOGGING'] = 'curl,s3'
        os.environ['TENSORSTORE_CURL_VERBOSE'] = '1'
    elif kvstore_driver == 'gcs':
        spec['kvstore']['bucket'] = settings.storage_bucket
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = settings.storage_gcs_credentials_file
    else:
        raise ValueError(f'Unknown kvstore_driver: {kvstore_driver}')

    return spec


def _get_ts_spec(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path, shape: tuple,
                 attrs: dict[str, ATTRIBUTE_VALUE_TYPE] = None) -> TensorStoreSpec:
    spec = _get_basic_spec(driver, kvstore_driver, kvstore_path)
    metadata = {}

    if driver == 'zarr':
        metadata['shape'] = shape
        spec['dtype'] = 'float64'
    elif driver == 'zarr3':
        metadata['shape'] = shape
        spec['dtype'] = 'float64'
        if attrs:
            metadata['attributes'] = attrs
    elif driver == 'n5':
        metadata['compression'] = {'type': 'gzip'}
        metadata['dataType'] = 'float64'
        metadata['dimensions'] = shape
        metadata['blockSize'] = shape
        if attrs:
            metadata['attributes'] = attrs
    else:
        raise ValueError(f'Unknown driver: {driver}')

    spec['driver'] = driver
    spec['metadata'] = metadata
    spec['create'] = True
    spec['delete_existing'] = True

    return TensorStoreSpec(spec)


async def write_ts_dataset(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path, data: np.ndarray,
                           attributes: ATTRIBUTE_VALUE_TYPE) -> None:
    logger.info(f"write array and metadata to {driver} store {kvstore_path}")
    shape = data.shape
    ts_spec: TensorStoreSpec = _get_ts_spec(driver, kvstore_driver, kvstore_path, shape, attributes)
    dataset: TensorStore = await ts.open(ts_spec)
    await dataset.write(data)
