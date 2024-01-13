import logging
from datetime import datetime
from pathlib import Path

import boto3
from mypy_boto3_s3 import S3Client
from mypy_boto3_s3.type_defs import HeadObjectOutputTypeDef

from simdata_api.config import get_settings

logger = logging.getLogger(__name__)


class S3:
    s3_client: S3Client
    bucket_name: str

    def __init__(self):
        settings = get_settings()
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=settings.storage_endpoint_url,
            aws_access_key_id=settings.storage_access_key_id,
            aws_secret_access_key=settings.storage_secret,
        )
        self.bucket_name = settings.storage_bucket

    def download_s3_file(self, s3_path: str, file_path: Path) -> str:
        self.s3_client.download_file(
            Bucket=self.bucket_name, Key=s3_path, Filename=str(file_path)
        )
        settings = get_settings()
        return f"{settings.storage_endpoint_url}/{settings.storage_bucket}/{s3_path}"

    def get_s3_modified_date(self, s3_path: str) -> datetime:
        attrs: HeadObjectOutputTypeDef = self.s3_client.head_object(
            Bucket=self.bucket_name, Key=s3_path
        )
        modified: datetime = attrs.get("LastModified")
        return modified
