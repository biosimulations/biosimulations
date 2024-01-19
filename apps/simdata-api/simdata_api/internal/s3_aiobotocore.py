import logging
from datetime import datetime
from pathlib import Path

import aiofiles
from aiobotocore.config import AioConfig
from aiobotocore.session import AioSession

logger = logging.getLogger(__name__)


async def download_s3_file(s3_path: str, file_path: Path) -> str:
    session = AioSession()
    from simdata_api.config import get_settings
    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)
    bucket_name = settings.storage_bucket

    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        obj = await s3_client.get_object(Bucket=bucket_name, Key=s3_path)
        async with aiofiles.open(file_path, mode='wb') as f:
            async for chunk in obj['Body'].iter_chunks():
                await f.write(chunk)
        settings = get_settings()
        return f"{settings.storage_endpoint_url}/{settings.storage_bucket}/{s3_path}"

async def get_s3_modified_date(s3_path: str) -> datetime:
    session = AioSession()
    from simdata_api.config import get_settings
    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)

    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        response = await s3_client.get_object(Bucket=settings.storage_bucket, Key=s3_path)
        last_modified: datetime = response['LastModified']
        return last_modified
