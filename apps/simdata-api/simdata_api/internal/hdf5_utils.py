import logging
from datetime import datetime
from functools import lru_cache, partial
from pathlib import Path

import h5py
from numpy import ndarray

from simdata_api.datamodels import HDF5Attribute, HDF5Dataset, HDF5Group, HDF5File
from .s3_utils import S3

logger = logging.getLogger(__name__)


@lru_cache()
def get_s3_dataset_as_ndarray(run_id: str, dataset_name: str) -> ndarray:
    local_path = Path(f"../local_data/{run_id}.h5")
    if not local_path.exists():
        s3 = S3()
        s3.download_s3_file(
            s3_path=f"simulations/{run_id}/contents/reports.h5", file_path=local_path
        )

    with h5py.File(name=local_path, mode="r") as f:
        dataset: h5py.Dataset = f[dataset_name]
        data: ndarray = dataset[:]
        return data


def get_results_timestamps(run_id: str) -> datetime:
    s3 = S3()
    return s3.get_s3_modified_date(s3_path=f"simulations/{run_id}/contents/reports.h5")


def visitor_func(groups, name, obj):
    if isinstance(obj, h5py.Group):
        attributes = []
        for k, v in obj.attrs.items():
            if isinstance(v, ndarray) and v.dtype.kind in "SU":
                v = v.tolist()
            attributes.append(HDF5Attribute(key=k, value=v))
        group = HDF5Group(name=name, attributes=attributes, datasets=[])
        groups.append(group)
    elif isinstance(obj, h5py.Dataset):
        # temp_attr_dict = {k: v for k, v in obj.attrs.items()}
        # print(temp_attr_dict)
        attributes = []
        for k, v in obj.attrs.items():
            if isinstance(v, ndarray) and v.dtype.kind in "OSU":
                v = v.tolist()
            attributes.append(HDF5Attribute(key=k, value=v))
        dataset = HDF5Dataset(name=name, shape=obj.shape, attributes=attributes)
        groups[-1].datasets.append(dataset)


def extract_hdf5_metadata(file_path: Path) -> HDF5File:
    groups = []
    bound_visitor_func = partial(visitor_func, groups)

    with h5py.File(file_path, "r") as f:
        f.visititems(bound_visitor_func)
        hdf5_file = HDF5File(filename=str(file_path), groups=groups)

    return hdf5_file


@lru_cache()
def get_s3_hdf5_metadata(run_id: str) -> HDF5File:
    local_path = Path(f"../local_data/{run_id}.h5")
    uri: str | None = None
    if not local_path.exists():
        s3 = S3()
        uri = s3.download_s3_file(
            s3_path=f"simulations/{run_id}/contents/reports.h5", file_path=local_path
        )

    hdf5_file: HDF5File = extract_hdf5_metadata(local_path)
    hdf5_file.id = run_id
    hdf5_file.uri = uri
    return hdf5_file
