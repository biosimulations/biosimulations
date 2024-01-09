from typing import List

from pydantic import BaseModel


class DatasetData(BaseModel):
    shape: List[int]
    values: List[float]
