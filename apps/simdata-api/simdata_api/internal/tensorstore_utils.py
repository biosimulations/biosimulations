from pathlib import Path
from typing import Dict, List, Literal

import numpy as np
import tensorstore as ts
from tensorstore import TensorStore, Spec as TensorStoreSpec

from simdata_api.datamodels import HDF5File, HDF5Group, HDF5Dataset

DATA_TYPE = 'float64'
COMPRESSION = 'gzip'

KV_DRIVER = Literal['file', 's3', 'gcs']
TS_DRIVER = Literal['zarr', 'n5', 'zarr3']


async def write_metadata_root(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_root_path: Path, hdf5_file: HDF5File) -> None:
    # for each group in the HDF5File object, create a group in the tensorstore
    for group in hdf5_file.groups:
        await _write_metadata_group(driver, kvstore_driver, kvstore_root_path, group)


async def _write_metadata_group(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_root_path: Path, hdf5_group: HDF5Group) -> None:
    # for each dataset in the HDF5Group object, create a dataset in the tensorstore
    for dataset in hdf5_group.datasets:
        await _write_metadata_dataset(driver, kvstore_driver, kvstore_root_path, dataset)


async def _write_metadata_dataset(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_root_path: Path, hdf5_dataset: HDF5Dataset) -> None:
    shape = tuple(hdf5_dataset.shape)
    attrs = {attr.key: attr.value for attr in hdf5_dataset.attributes}
    ts_spec: TensorStoreSpec = _get_ts_spec(driver, kvstore_driver, kvstore_root_path / hdf5_dataset.name, shape, attrs)
    dataset: TensorStore = await ts.open(ts_spec)
    data = np.zeros(shape=shape, dtype=float) # should be a no-op because fill is zero
    await dataset.write(data)


async def read_from_local_ts(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path) -> (np.ndarray, Dict[str, str | list[str]]):
    spec = _get_basic_spec(driver, kvstore_driver, kvstore_path)
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


def _get_basic_spec(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path):
    spec = {}
    spec['driver'] = driver
    spec['kvstore'] = {}
    spec['kvstore']['driver'] = kvstore_driver
    spec['kvstore']['path'] = str(kvstore_path)
    return spec


def _get_ts_spec(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path, shape: tuple, attrs: Dict[str, str] = None) -> TensorStoreSpec:
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
    spec['kvstore']['driver'] = kvstore_driver
    spec['kvstore']['path'] = str(kvstore_path)
    spec['metadata'] = metadata
    spec['create'] = True
    spec['delete_existing'] = True

    return TensorStoreSpec(spec)


async def write_dataset(driver: TS_DRIVER, kvstore_driver: KV_DRIVER, kvstore_path: Path, data: np.ndarray,
                        attributes: Dict[str,str|List[str]]) -> None:
    shape = data.shape
    ts_spec: TensorStoreSpec = _get_ts_spec(driver, kvstore_driver, kvstore_path, shape, attributes)
    dataset: TensorStore = await ts.open(ts_spec)
    await dataset.write(data)


