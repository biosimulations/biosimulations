from enum import Enum
from typing import List, Union

from pydantic import BaseModel


class DatasetData(BaseModel):
    shape: List[int]
    values: List[float]


class Status(str, Enum):
    ok = "ok"
    error = "error"


class StatusResponse(BaseModel):
    status: Status


class HDF5Attribute(BaseModel):
    key: str
    value: Union[
        int, float, str, bool, List[str], List[int], List[float], List[bool], None
    ]


class HDF5Dataset(BaseModel):
    name: str
    shape: List[int]
    attributes: List[HDF5Attribute]


class HDF5Group(BaseModel):
    name: str
    attributes: List[HDF5Attribute]
    datasets: List[HDF5Dataset]


class HDF5File(BaseModel):
    filename: str
    id: str | None = None
    uri: str | None = None
    groups: List[HDF5Group]
