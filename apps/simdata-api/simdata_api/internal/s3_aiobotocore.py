import logging
from datetime import datetime
from pathlib import Path

import aiofiles
from aiobotocore.config import AioConfig
from aiobotocore.session import AioSession
from botocore.exceptions import ClientError

from simdata_api.config import get_settings
from simdata_api.datamodels import ListingItem

logger = logging.getLogger(__name__)


async def download_s3_file(s3_path: str, file_path: Path) -> str:
    logger.info(f"Downloading {s3_path} to {file_path}")
    session = AioSession()

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


async def upload_file_to_s3(file_path: Path, s3_path: str) -> str:
    logger.info(f"Uploading {file_path} to {s3_path}")
    session = AioSession()

    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)
    bucket_name = settings.storage_bucket

    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        async with aiofiles.open(file_path, mode='rb') as f:
            await s3_client.put_object(Bucket=bucket_name, Key=s3_path, Body=await f.read())
        return f"{settings.storage_endpoint_url}/{settings.storage_bucket}/{s3_path}"


async def upload_bytes_to_s3(file_contents: bytes, s3_path: str) -> str:
    logger.info(f"Uploading {len(file_contents)} bytes to {s3_path}")
    session = AioSession()

    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)
    bucket_name = settings.storage_bucket

    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        await s3_client.put_object(Bucket=bucket_name, Key=s3_path, Body=file_contents)
        return f"{settings.storage_endpoint_url}/{settings.storage_bucket}/{s3_path}"


# download file contents from s3 as bytes
async def get_s3_file_contents(s3_path: str) -> bytes:
    logger.info(f"Downloading {s3_path} as bytes")
    session = AioSession()
    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)

    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        try:
            obj = await s3_client.get_object(Bucket=settings.storage_bucket, Key=s3_path)
            contents: bytes = await obj['Body'].read()
            return contents
        except ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                logger.info(f"failed to retrieve file content: {str(e)}")
                raise FileNotFoundError(f"File {s3_path} not found in S3")
            else:
                logger.exception(e)
                raise e


async def get_s3_modified_date(s3_path: str) -> datetime:
    logger.info(f"Retrieving LastModified from {s3_path}")
    session = AioSession()
    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)

    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        try:
            response = await s3_client.get_object(Bucket=settings.storage_bucket, Key=s3_path)
            last_modified: datetime = response['LastModified']
            return last_modified
        except ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                logger.info(f"failed to retrieve modified date: {str(e)}")
                raise FileNotFoundError(f"File {s3_path} not found in S3")
            else:
                logger.exception(e)
                raise e


async def get_listing_of_s3_path(s3_path: str) -> list[ListingItem]:
    logger.info(f"Retrieving file list from {s3_path}")
    session = AioSession()
    settings = get_settings()
    config = AioConfig(connect_timeout=1, read_timeout=1)

    files: list[ListingItem] = []
    async with session.create_client(
            service_name='s3',
            config=config,
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret) as s3_client:
        paginator = s3_client.get_paginator("list_objects")
        async for result in paginator.paginate(Bucket=settings.storage_bucket, Prefix=s3_path):
            for c in result.get('Contents', []):
                last_modified: datetime = c['LastModified']
                key: str = c['Key']
                size: int = c['Size']
                etag: str = c['ETag']
                files.append(ListingItem(Key=key, LastModified=last_modified, Size=size, ETag=etag))

        return files
