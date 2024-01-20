from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    storage_bucket: str = "files.biosimulations.dev"
    storage_endpoint_url: str = "https://storage.googleapis.com"
    storage_region: str = "us-east4"
    storage_access_key_id: str = (
        "GOOG1EONFYVUYORAUYCZF6U4DOJ662KRZBGFFROVRDJRDIZRCP3R4ZP4UWZEI"
    )
    storage_secret: str = "0WWTDgbnVovzNpBOHnBl9e0iULEJbyddZSIbAkcL"
    storage_local_cache_dir: str = "/tmp/simdata_api"
    storage_credentials_file: str = "/Users/schaff/Documents/workspace/biosimulations/apps/simdata-api/google_storage_credentials.json"

@lru_cache
def get_settings():
    return Settings()
