import logging
from functools import partial
from pathlib import Path

import aiofiles.ospath
import h5py
from numpy import ndarray

from simdata_api.datamodels import HDF5Attribute, HDF5Dataset, HDF5Group, HDF5File
from .s3_aiobotocore import download_s3_file

logger = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).parent.parent.parent


async def get_s3_dataset_as_ndarray(run_id: str, dataset_name: str) -> ndarray:
    local_path = ROOT_DIR / "local_data" / f"{run_id}.h5"
    if not await aiofiles.ospath.exists(str(local_path)):
        await download_s3_file(
            s3_path=f"simulations/{run_id}/contents/reports.h5", file_path=local_path
        )

    with h5py.File(name=local_path, mode="r") as f:
        dataset: h5py.Dataset = f[dataset_name]
        data: ndarray = dataset[:]
        return data


def _visitor_func(groups, name, obj):
    if isinstance(obj, h5py.Group):
        attributes = []
        h5py_group: h5py.Group = obj
        for k, v in h5py_group.attrs.items():
            if isinstance(v, ndarray) and v.dtype.kind in "S":
                v = v.tolist()
            attributes.append(HDF5Attribute(key=k, value=v))
        group = HDF5Group(name=name, attributes=attributes, datasets=[])
        groups.append(group)
    elif isinstance(obj, h5py.Dataset):
        # temp_attr_dict = {k: v for k, v in obj.attrs.items()}
        # print(temp_attr_dict)
        h5py_dataset: h5py.Dataset = obj
        attributes = []
        for k, v in h5py_dataset.attrs.items():
            if isinstance(v, ndarray) and v.dtype.kind in "OS":
                v = v.tolist()
            attributes.append(HDF5Attribute(key=k, value=v))
        dataset = HDF5Dataset(name=name, shape=h5py_dataset.shape, attributes=attributes)
        groups[-1].datasets.append(dataset)


def extract_hdf5_metadata(local_file_path: Path) -> HDF5File:
    groups = []
    bound_visitor_func = partial(_visitor_func, groups)

    with h5py.File(local_file_path, "r") as f:
        f.visititems(bound_visitor_func)
        hdf5_file = HDF5File(filename=str(local_file_path), groups=groups, uri="", id="")

    return hdf5_file


async def get_s3_hdf5_metadata(run_id: str) -> HDF5File:
    local_path = ROOT_DIR / "local_data" / f"{run_id}.h5"
    uri: str | None = None
    if not await aiofiles.ospath.exists(str(local_path)):
        uri = await download_s3_file(
            s3_path=f"simulations/{run_id}/contents/reports.h5", file_path=local_path
        )

    hdf5_file: HDF5File = extract_hdf5_metadata(local_path)
    hdf5_file.id = run_id
    hdf5_file.uri = uri
    return hdf5_file
