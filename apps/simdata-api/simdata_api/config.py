from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

KV_DRIVER = Literal['file', 's3', 'gcs']
TS_DRIVER = Literal['zarr', 'n5', 'zarr3']


class Settings(BaseSettings):
    storage_bucket: str = "files.biosimulations.dev"
    storage_endpoint_url: str = "https://storage.googleapis.com"
    storage_region: str = "us-east4"
    storage_access_key_id: str = "GOOG..."
    storage_secret: str = "0W...kcL"
    storage_local_cache_dir: str = "/tmp/simdata_api"
    storage_gcs_credentials_file: str = "~/.config/gcloud/application_default_credentials.json"
    storage_tensorstore_driver: TS_DRIVER = "zarr3"
    storage_tensorstore_kvstore_driver: KV_DRIVER = "gcs"

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Settings()
