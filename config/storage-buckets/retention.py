import os
from google.cloud import storage
from dotenv import load_dotenv
from auth import GoogleStorageAuth

def set_retention():
    load_dotenv("config/config.env")
    
    # Need to use different storage buckets for lifecycle since google only supports bucket wide lifecycle

    dev_bucket = os.getenv("TEMP_STORAGE_BUCKET_DEV")
    prod_bucket = os.getenv("TEMP_STORAGE_BUCKET_PROD")
  

    temp_storage_expiration_days = int(float(os.getenv('TEMP_STORAGE_MAX_AGE', '1')))


    with GoogleStorageAuth() as auth:
        storage_client = storage.Client()

        if(dev_bucket):
            print("Setting retention for dev bucket")
            bucket= storage_client.get_bucket(dev_bucket)
            bucket.add_lifecycle_delete_rule(age=30)
            bucket.patch()
            print("Set retention policies for bucket {} is {}".format(bucket.name, bucket.lifecycle_rules))
            
        if(prod_bucket):
            print("Setting retention for prod bucket")
            bucket= storage_client.get_bucket(prod_bucket)
            bucket.add_lifecycle_delete_rule(age=temp_storage_expiration_days)
            bucket.patch()
            print("Set retention policies for bucket {} is {}".format(bucket.name, bucket.lifecycle_rules))



    
    
 
    

  