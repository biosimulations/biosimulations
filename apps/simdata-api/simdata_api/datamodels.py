from datetime import datetime
from enum import Enum
from typing import List, Union

from pydantic import BaseModel


ATTRIBUTE_VALUE_TYPE = int | float | str | bool | list[str] | list[int] | list[float] | list[bool]

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
    value: ATTRIBUTE_VALUE_TYPE


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
    id: str
    uri: str
    groups: List[HDF5Group]


class ListingItem(BaseModel):
    Key: str
    LastModified: datetime
    ETag: str
    Size: int
