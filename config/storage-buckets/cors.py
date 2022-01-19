from auth import GoogleStorageAuth
from dotenv import load_dotenv
from google.cloud import storage
import os
import sys

DEV_CORS_SETTINGS = [{
    "origin": ["*"],
    "method": ["*"],
    "maxAgeSeconds": 3600
}]

# TODO narrow origins for prod
PROD_CORS_SETTINGS = [{
    "origin": ["*"],
    "method": ["*"],
    "maxAgeSeconds": 3600
}]


def set_cors():
    load_dotenv("config/config.env")

    dev_bucket = os.getenv("STORAGE_BUCKET")
    prod_bucket = os.getenv("STORAGE_BUCKET_PROD")
    temp_dev_bucket = os.getenv("TEMP_STORAGE_BUCKET_DEV")
    temp_prod_bucket = os.getenv("TEMP_STORAGE_BUCKET_PROD")

    with GoogleStorageAuth() as auth:
        s3 = storage.Client()

        if dev_bucket:
            print("Setting CORS for dev bucket ({}) to {} ... ".format(dev_bucket, DEV_CORS_SETTINGS), end='')
            sys.stdout.flush()
            bucket = s3.get_bucket(dev_bucket)
            bucket.cors = DEV_CORS_SETTINGS
            bucket.patch()
            print("done.")

        if temp_dev_bucket:
            print("Setting CORS for temp dev bucket ({}) to {} ... ".format(temp_dev_bucket, DEV_CORS_SETTINGS), end='')
            sys.stdout.flush()
            bucket = s3.get_bucket(temp_dev_bucket)
            bucket.cors = DEV_CORS_SETTINGS
            bucket.patch()
            print("done.")

        if prod_bucket:
            print("Setting CORS for prod bucket ({}) to {} ... ".format(prod_bucket, PROD_CORS_SETTINGS), end='')
            sys.stdout.flush()
            bucket = s3.get_bucket(prod_bucket)
            bucket.cors = PROD_CORS_SETTINGS
            bucket.patch()
            print("done.")

        if temp_prod_bucket:
            print("Setting CORS for temp bucket ({}) to {} ... ".format(temp_prod_bucket, PROD_CORS_SETTINGS), end='')
            sys.stdout.flush()
            bucket = s3.get_bucket(temp_prod_bucket)
            bucket.cors = PROD_CORS_SETTINGS
            bucket.patch()
            print("done.")


if __name__ == "__main__":
    set_cors()
