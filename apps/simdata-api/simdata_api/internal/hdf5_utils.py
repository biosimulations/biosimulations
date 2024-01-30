import logging
from functools import partial
from pathlib import Path
from typing import Any

import h5py
from h5py import File
from numpy import ndarray

from simdata_api.datamodels import HDF5Attribute, HDF5Dataset, HDF5Group, HDF5File

logger = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).parent.parent.parent


def extract_hdf5_dataset_array(local_file_path: Path, dataset_name: str) -> ndarray:
    logger.info(f"extract hdf5 dataset array {dataset_name} from {local_file_path}")
    f: File | Any
    with h5py.File(name=str(local_file_path), mode="r") as f:
        dataset: h5py.Dataset = f[dataset_name]
        data: ndarray = dataset[:]
        return data


def _visitor_func(groups, name, obj):
    if isinstance(obj, h5py.Group):
        attributes = []
        h5py_group = obj
        for k, v in h5py_group.attrs.items():
            if isinstance(v, ndarray) and v.dtype.kind in "S":
                v = v.tolist()
            attributes.append(HDF5Attribute(key=k, value=v))
        group = HDF5Group(name=name, attributes=attributes, datasets=[])
        groups.append(group)
    elif isinstance(obj, h5py.Dataset):
        # temp_attr_dict = {k: v for k, v in obj.attrs.items()}
        # print(temp_attr_dict)
        h5py_dataset = obj
        attributes = []
        for k, v in h5py_dataset.attrs.items():
            if isinstance(v, ndarray) and v.dtype.kind in "OS":
                v = v.tolist()
            attributes.append(HDF5Attribute(key=k, value=v))
        dataset = HDF5Dataset(name=name, shape=h5py_dataset.shape, attributes=attributes)
        groups[-1].datasets.append(dataset)


def extract_hdf5_metadata(local_file_path: Path) -> HDF5File:
    logger.info(f"extract all hdf5 metadata from {local_file_path}")
    groups: list[HDF5Group] = []
    bound_visitor_func = partial(_visitor_func, groups)

    with h5py.File(local_file_path, "r") as f:
        f.visititems(bound_visitor_func)
        hdf5_file = HDF5File(filename=str(local_file_path), groups=groups, uri="", id="")

    return hdf5_file
