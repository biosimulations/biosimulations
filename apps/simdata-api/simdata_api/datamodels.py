from pydantic import BaseModel
from typing import Optional, List

class DatasetData(BaseModel):
    index: Optional[List[str]]
    values: Optional[List[float]]
