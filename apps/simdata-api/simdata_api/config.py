from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    storage_bucket: str = "files.biosimulations.dev"
    storage_endpoint_url: str = "https://storage.googleapis.com"
    storage_region: str = "unused_region"
    storage_access_key_id: str = "GOOG1EONFYVUYORAUYCZF6U4DOJ662KRZBGFFROVRDJRDIZRCP3R4ZP4UWZEI"
    storage_secret: str = "0WWTDgbnVovzNpBOHnBl9e0iULEJbyddZSIbAkcL"
    local_file_path: Path = "../local_data"


@lru_cache
def get_settings():
    return Settings()
