import os
from datetime import datetime
from pathlib import Path

import pytest

from simdata_api.config import get_settings
from simdata_api.datamodels import ListingItem
from simdata_api.internal.s3_aiobotocore import get_s3_modified_date, download_s3_file, get_listing_of_s3_path

ROOT_DIR = Path(__file__).parent.parent.parent


@pytest.mark.skipif(len(get_settings().storage_secret) == 0,
                    reason="S3 config STORAGE_SECRET not supplied")
@pytest.mark.asyncio
async def test_download_s3_file():
    RUN_ID = "61fd573874bc0ce059643515"
    S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"
    LOCAL_PATH = Path(ROOT_DIR) / "local_data" / f"{RUN_ID}.h5"

    await download_s3_file(s3_path=S3_PATH, file_path=LOCAL_PATH)

    assert LOCAL_PATH.exists()

    os.remove(LOCAL_PATH)


@pytest.mark.skipif(len(get_settings().storage_secret) == 0,
                    reason="S3 config STORAGE_SECRET not supplied")
@pytest.mark.asyncio
async def test_get_s3_modified_date():
    RUN_ID = "61fd573874bc0ce059643515"
    S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"

    td = await get_s3_modified_date(s3_path=S3_PATH)
    assert type(td) is datetime


@pytest.mark.skipif(len(get_settings().storage_secret) == 0,
                    reason="S3 config STORAGE_SECRET not supplied")
@pytest.mark.asyncio
async def test_get_listing_of_s3_path():
    RUN_ID = "61fd573874bc0ce059643515"
    S3_PATH = f"simulations/{RUN_ID}/contents"

    files = await get_listing_of_s3_path(s3_path=S3_PATH)
    assert len(files) > 0
    assert type(files[0]) is ListingItem
