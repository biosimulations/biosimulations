from datetime import datetime
from enum import Enum
from typing import List, Literal, Optional

from pydantic import BaseModel


class DatasetData(BaseModel):
    shape: List[int]
    values: List[float]


class Status(str, Enum):
    ok = "ok"
    error = "error"


class StatusResponse(BaseModel):
    status: Status
