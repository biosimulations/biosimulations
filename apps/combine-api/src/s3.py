from dotenv import dotenv_values
import boto3


class S3Bucket(object):
    bucket = None
    bucket_name = None
    public_endpoint = ""

    def __init__(self) -> None:
        config = self.get_configuration()
        self.validate_configuration(config)
        self.public_endpoint = config['public_endpoint']
        self.bucket_name = config['default_bucket']

        s3 = boto3.resource('s3',
                            endpoint_url=config['endpoint'],
                            aws_access_key_id=config['access_key_id'],
                            aws_secret_access_key=config['secret_access_key'],
                            verify=False)

        self.bucket = s3.Bucket(config['default_bucket'])

    def uploadFile(self, file, public, id):
        if public:
            extra_args = {'ACL': 'public-read'}
        else:
            extra_args = {}

        self.bucket.upload_file(file, str(id), ExtraArgs=extra_args)
        return self.public_endpoint + str(id)

    @staticmethod
    def get_configuration(config_filename="config/config.env", secret_filename="secret/secret.env"):
        config = {
            **dotenv_values(secret_filename),
            **dotenv_values(config_filename),
        }

        endpoint = config.get("STORAGE_ENDPOINT")
        public_endpoint = config.get("STORAGE_PUBLIC_ENDPOINT")
        default_bucket = config.get("STORAGE_BUCKET")
        access_key_id = config.get("STORAGE_ACCESS_KEY")
        secret_access_key = config.get("STORAGE_SECRET")

        return {
            'endpoint': endpoint,
            'public_endpoint': public_endpoint,
            'default_bucket': default_bucket,
            'access_key_id': access_key_id,
            'secret_access_key': secret_access_key,
        }

    @staticmethod
    def validate_configuration(config):
        errors = []
        if not config.get('endpoint', None):
            errors.append('Storage endpoint (`STORAGE_ENDPOINT`) must be set, not `{}`.'.format(config.get('endpoint', None)))
        if not config.get('public_endpoint', None):
            errors.append('Public storage access (`STORAGE_PUBLIC_ENDPOINT`) must be set, not `{}`.'.format(
                config.get('public_endpoint', None)))
        if not config.get('default_bucket', None):
            errors.append('Storage bucket (`STORAGE_BUCKET`) key must be set, not `{}`.'.format(config.get('default_bucket', None)))
        if not config.get('access_key_id', None):
            errors.append('Storage access key (`STORAGE_ACCESS_KEY`) must be set, not `{}`.'.format(config.get('access_key_id', None)))
        if not config.get('secret_access_key', None):
            errors.append('Storage secret (`STORAGE_SECRET`) must be set, not `{}`.'.format(config.get('secret_access_key', None)))
        if errors:
            raise ValueError('The configuration for the S3 bucket is not valid:\n  {}'.format('\n  '.join(errors)))
