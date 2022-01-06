from dotenv import dotenv_values
import boto3
import typing


DEFAULT_CONFIG_FILENAME = "config/config.env"
DEFAULT_SECRET_FILENAME = "secret/secret.env"
DEFAULT_SHARED_FILENAME = "shared/shared.env"


class S3Bucket(object):
    bucket = None
    bucket_name = None
    public_endpoint = ""

    def __init__(self,
                 config_filename: str = DEFAULT_CONFIG_FILENAME,
                 secret_filename: str = DEFAULT_SECRET_FILENAME,
                 shared_filename: str = DEFAULT_SHARED_FILENAME,
                 ) -> None:
        config = self.get_configuration(config_filename=config_filename, secret_filename=secret_filename, shared_filename=shared_filename)
        self.validate_configuration(config)
        self.public_endpoint = config['public_endpoint']
        self.bucket_name = config['default_bucket']

        s3 = boto3.resource('s3',
                            endpoint_url=config['endpoint'],
                            aws_access_key_id=config['access_key_id'],
                            aws_secret_access_key=config['secret_access_key'],
                            verify=False)

        self.client = boto3.client('s3')
        self.bucket = s3.Bucket(config['default_bucket'])

    def upload_file(self, filename: str, key: str, public: bool) -> str:
        """ Upload a local file to a key in the bucket

        Args:
            filename (:obj:`str`): local path to the file to upload
            key (:obj:`str`): key to save the file at in the bucket
            public (:obj:`bool`): whether to make the file publicly readable

        Returns:
            :obj:`str`: public URL for the file
        """
        if public:
            extra_args = {'ACL': 'public-read'}
        else:
            extra_args = {}

        self.bucket.upload_file(filename, str(key), ExtraArgs=extra_args)
        return self.public_endpoint + str(key)

    def download_file(self, key: str, filename: str) -> None:
        """ Download a file from a key in the bucket to a local path

        Args:
            key (:obj:`str`): key to save the file at in the bucket
            filename (:obj:`str`): local path to the file to upload
        """
        self.bucket.download_file(Key=key, Filename=filename)

    def is_file(self, key: str) -> bool:
        """ Determine whether the bucket has a file at a key

        Args:
            key (:obj:`str`): key for the file in the bucket

        Returns:
            :obj:`dict`: whether the bucket has a file with the queried key
        """
        try:
            self.get_file_properties(key)
            return True
        except FileExistsError:
            return False

    def get_file_properties(self, key: str) -> typing.Dict:
        """ Get the properties of a file in the bucket

        Args:
            key (:obj:`str`): key for the file in the bucket

        Returns:
            :obj:`boto3.resources.factory.s3.ObjectSummary`: file properties
        """
        objects = self.bucket.objects.filter(Prefix=key)
        for object in objects:
            if object.key == key:
                return object
        raise FileExistsError('The bucket does not have an object with key `{}`'.format(key))

    def list_files(self, prefix: str = None) -> typing.List[str]:
        """ List the files in the bucket or beneath a prefix in the bucket

        Args:
            prefix (:obj:`str`, optional): path beneath which to get files

        Returns:
            :obj:`list` of :obj:`str`: list of keys for the the files in the bucket or beneath the prefix
        """
        objects = self.bucket.objects.filter(Prefix=prefix)
        return [object.key for object in objects]

    @staticmethod
    def get_configuration(config_filename: str = DEFAULT_CONFIG_FILENAME,
                          secret_filename: str = DEFAULT_SECRET_FILENAME,
                          shared_filename: str = DEFAULT_SHARED_FILENAME,
                          ) -> typing.Dict:
        config = {
            **dotenv_values(secret_filename),
            **dotenv_values(config_filename),
            **dotenv_values(shared_filename),
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
    def validate_configuration(config: typing.Dict):
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
