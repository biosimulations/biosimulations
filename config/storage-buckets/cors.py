from google.cloud import storage
import os 
from dotenv import load_dotenv
from auth import GoogleStorageAuth
def set_cors():
    load_dotenv("config/config.env")
    
    dev_bucket = os.getenv("STORAGE_BUCKET")
    prod_bucket = os.getenv("STORAGE_BUCKET_PROD")   
    temp_dev_bucket = os.getenv("TEMP_STORAGE_BUCKET_DEV")
    temp_prod_bucket = os.getenv("TEMP_STORAGE_BUCKET_PROD")
              

    dev_cors_settings = [{
        "origin": ["*"],
        "method": ["*"],
        "maxAgeSeconds": 3600
        }]
    
    
    # TODO narrow origins for prod 
    prod_cors_settings=  [{
        "origin": ["*"],
        "method": ["*"],
        "maxAgeSeconds": 3600
        }]
    
    with GoogleStorageAuth() as auth:
        s3 = storage.Client()

        if(dev_bucket):
            print("Setting CORS for dev bucket")
            bucket= s3.get_bucket(dev_bucket)
            bucket.cors=dev_cors_settings
            bucket.patch()
            print("Set CORS policies for bucket {} is {}".format(bucket.name, bucket.cors))
        
        if(temp_dev_bucket):
            print("Setting CORS for temp dev bucket")
            bucket= s3.get_bucket(temp_dev_bucket)
            bucket.cors=dev_cors_settings
            bucket.patch()
            print("Set CORS policies for bucket {} is {}".format(bucket.name, bucket.cors))
        

        if(prod_bucket):
            print("Setting CORS for prod bucket")
            bucket= s3.get_bucket(prod_bucket)
            bucket.cors=prod_cors_settings
            bucket.patch()
            print("Set CORS policies for bucket {} is {}".format(bucket.name, bucket.cors))
        
        if(temp_prod_bucket):
            print("Setting CORS for temp prod bucket")
            bucket= s3.get_bucket(temp_prod_bucket)
            bucket.cors=prod_cors_settings
            bucket.patch()
            print("Set CORS policies for bucket {} is {}".format(bucket.name, bucket.cors))
        



if __name__ == "__main__":
    set_cors()
