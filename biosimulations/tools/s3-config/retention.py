import boto3
import os
from dotenv import load_dotenv


def set_retention():
    load_dotenv("config/config.env")
    access_key_id = os.getenv("STORAGE_ACCESS_KEY")
    secret_access_key = os.getenv("STORAGE_SECRET")
    dev_bucket = os.getenv("STORAGE_BUCKET")
    prod_bucket = os.getenv("STORAGE_BUCKET_PROD")
    endpoint = os.getenv("STORAGE_ENDPOINT")

    combine_prefix = "temp/createdCombineArchive/"
    combine_expiration_days = 1

    s3 = boto3.resource('s3',
                        endpoint_url=endpoint,
                        aws_access_key_id=access_key_id,
                        aws_secret_access_key=secret_access_key,
                        verify=False)

    dev_bucket_lifecycle_configuration = s3.BucketLifecycleConfiguration(dev_bucket)
    prod_bucket_lifecycle_configuration = s3.BucketLifecycleConfiguration(prod_bucket)

    dev_bucket_lifecycle_configuration.put(
        LifecycleConfiguration={
            'Rules': [
                {
                    'ID': 'delete-temporary-combine-archives',
                    'Status': 'Enabled',
                    'Filter': {
                        'Prefix': combine_prefix,
                    },
                    'Expiration': {
                        'Days': 30
                    },
                },
            ]
        }
    )

    prod_bucket_lifecycle_configuration.put(
        LifecycleConfiguration={
            'Rules': [
                {
                    'ID': 'delete-temporary-combine-archives',
                    'Status': 'Enabled',
                    'Filter': {
                        'Prefix': combine_prefix,
                    },
                    'Expiration': {
                        'Days': combine_expiration_days
                    },
                },
            ]
        }
    )
