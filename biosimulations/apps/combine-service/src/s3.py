from dotenv import dotenv_values
import boto3


class S3Bucket(object):
    bucket = None
    bucket_name = None
    public_endpoint = ""

    def __init__(self) -> None:
        config = {
            **dotenv_values("secret/secret.env"),
            **dotenv_values("config/config.env"),
        }

        access_key_id = config.get("STORAGE_ACCESS_KEY")
        secret_access_key = config.get("STORAGE_SECRET")
        default_bucket = config.get("STORAGE_BUCKET")
        endpoint = config.get("STORAGE_ENDPOINT")
        self.public_endpoint = config.get("STORAGE_PUBLIC_ENDPOINT")
        self.bucket_name = default_bucket

        s3 = boto3.resource('s3',
                            endpoint_url=endpoint,
                            aws_access_key_id=access_key_id,
                            aws_secret_access_key=secret_access_key,
                            verify=False)

        self.bucket = s3.Bucket(default_bucket)

    def uploadFile(self, file, public, id):
        if public:
            extra_args = {'ACL': 'public-read'}
        else:
            extra_args = {}

        self.bucket.upload_file(file, str(id), ExtraArgs=extra_args)
        return self.public_endpoint + str(id)
