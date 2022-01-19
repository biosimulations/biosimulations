from auth import GoogleStorageAuth
from dotenv import load_dotenv
from google.cloud import storage
import os
import sys


def set_retention():
    load_dotenv("config/config.env")

    # Need to use different storage buckets for lifecycle since google only supports bucket-wide lifecycles

    dev_bucket = os.getenv("TEMP_STORAGE_BUCKET_DEV")
    prod_bucket = os.getenv("TEMP_STORAGE_BUCKET_PROD")

    dev_temp_storage_expiration_days = int(float(os.getenv('TEMP_STORAGE_MAX_AGE_DEV', 30)))
    prod_temp_storage_expiration_days = int(float(os.getenv('TEMP_STORAGE_MAX_AGE_PROD', 1)))

    with GoogleStorageAuth() as auth:
        storage_client = storage.Client()

        if dev_bucket:
            print("Setting lifecycle delete rule for temporary dev bucket ({}) to {} days ... ".format(
                dev_bucket, dev_temp_storage_expiration_days), end='')
            sys.stdout.flush()
            bucket = storage_client.get_bucket(dev_bucket)
            bucket.add_lifecycle_delete_rule(age=dev_temp_storage_expiration_days)
            bucket.patch()
            print("done.")

        if prod_bucket:
            print("Setting lifecycle delete rule for temporary prod bucket ({}) to {} days ... ".format(
                dev_bucket, prod_temp_storage_expiration_days), end='')
            sys.stdout.flush()
            bucket = storage_client.get_bucket(prod_bucket)
            bucket.add_lifecycle_delete_rule(age=prod_temp_storage_expiration_days)
            bucket.patch()
            print("done.")
