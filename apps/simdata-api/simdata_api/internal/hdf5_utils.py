from functools import lru_cache
from pathlib import Path

import h5py
from h5py import Dataset
from numpy import ndarray

from .s3_utils import S3


@lru_cache()
def get_s3_dataset_as_ndarray(run_id: str, dataset_name: str) -> ndarray:
    local_path = Path(f"../local_data/{run_id}.h5")
    if not local_path.exists():
        s3 = S3()
        s3.download_s3_file(s3_path=f"simulations/{run_id}/contents/reports.h5", file_path=local_path)

    with h5py.File(name=local_path, mode="r") as f:
        dataset: Dataset = f[dataset_name]
        data: ndarray = dataset[:]
        return data


