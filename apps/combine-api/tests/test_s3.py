from botocore.exceptions import ClientError
from unittest import mock
from src import s3
import boto3
import datetime
import os
import tempfile
import unittest


class S3TestCase(unittest.TestCase):
    def setUp(self):
        _, self.config_filename = tempfile.mkstemp()
        _, self.secret_filename = tempfile.mkstemp()

        with open(self.config_filename, 'w') as file:
            file.write('STORAGE_ENDPOINT=https://server.com\n')
            file.write('TEMP_STORAGE_BUCKET=c\n')

        with open(self.secret_filename, 'w') as file:
            file.write('STORAGE_ACCESS_KEY=d\n')
            file.write('STORAGE_SECRET=e\n')

    def tearDown(self):
        os.remove(self.config_filename)
        os.remove(self.secret_filename)

    def test_get_configuration(self):
        config = s3.S3Bucket.get_configuration(config_filename=self.config_filename, secret_filename=self.secret_filename)

        self.assertEqual(config, {
            'endpoint': 'https://server.com',
            'bucket': 'c',
            'access_key_id': 'd',
            'secret_access_key': 'e',
        })

        s3.S3Bucket.validate_configuration(config)

    def test_get_invalid_configuration(self):
        with open(self.config_filename, 'w') as file:
            file.write('STORAGE_ENDPOINT=\n')
            file.write('TEMP_STORAGE_BUCKET=\n')

        with open(self.secret_filename, 'w') as file:
            file.write('STORAGE_ACCESS_KEY=\n')
            file.write('STORAGE_SECRET=\n')

        config = s3.S3Bucket.get_configuration(config_filename=self.config_filename, secret_filename=self.secret_filename)

        self.assertEqual(config, {
            'endpoint': '',
            'bucket': '',
            'access_key_id': '',
            'secret_access_key': '',
        })

        with self.assertRaisesRegex(ValueError, 'is not valid'):
            s3.S3Bucket.validate_configuration(config)

    def test_get_no_configuration(self):
        with open(self.config_filename, 'w') as file:
            pass

        with open(self.secret_filename, 'w') as file:
            pass

        config = s3.S3Bucket.get_configuration(config_filename=self.config_filename, secret_filename=self.secret_filename)

        self.assertEqual(config, {
            'endpoint': None,
            'bucket': None,
            'access_key_id': None,
            'secret_access_key': None,
        })

        with self.assertRaisesRegex(ValueError, 'is not valid'):
            s3.S3Bucket.validate_configuration(config)

    def test_get_mixed_no_invalid_configuration(self):
        with open(self.config_filename, 'w') as file:
            file.write('STORAGE_ENDPOINT=\n')

        with open(self.secret_filename, 'w') as file:
            file.write('STORAGE_ACCESS_KEY=\n')

        config = s3.S3Bucket.get_configuration(config_filename=self.config_filename, secret_filename=self.secret_filename)

        self.assertEqual(config, {
            'endpoint': '',
            'bucket': None,
            'access_key_id': '',
            'secret_access_key': None,
        })

        with self.assertRaisesRegex(ValueError, 'is not valid'):
            s3.S3Bucket.validate_configuration(config)

    def test_upload_file(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def upload_file(Filename=None, Key=None, ExtraArgs=None):
            return None
        bucket.bucket = mock.Mock(upload_file=upload_file)
        self.assertEqual(bucket.upload_file('filename', 'key', False), bucket.endpoint + '/' + bucket.bucket_name + '/' + 'key')
        self.assertEqual(bucket.upload_file('filename', 'key', True), bucket.endpoint + '/' + bucket.bucket_name + '/' + 'key')

    def test_download_file(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def download_file(Key=None, Filename=None):
            return None
        bucket.bucket = mock.Mock(download_file=download_file)
        bucket.download_file('key', 'filename')

    def test_is_file(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def get_object(Bucket=None, Key=None):
            if Key == 'key1':
                return {}
            elif Key == 'key2':
                raise ClientError({'Error': {'Code': 'NoSuchKey'}}, 'get_object')
            elif Key == 'key3':
                raise ClientError({'Error': {'Code': 'ValueError'}}, 'get_object')
        bucket.client = mock.Mock(get_object=get_object)

        self.assertTrue(bucket.is_file('key1'))
        self.assertFalse(bucket.is_file('key2'))
        with self.assertRaises(ClientError):
            bucket.is_file('key3')

    def test_get_file_properties(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def get_object(Bucket=None, Key=None):
            return {}
        bucket.client = mock.Mock(get_object=get_object)
        self.assertEqual(bucket.get_file_properties('key'), {})

    def test_list_files(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def list_objects(Bucket=None, Prefix=None, Marker=None, MaxKeys=1000):
            bucket._counter += 1
            if bucket._counter <= 1:
                return {
                    'Contents': [
                        {'Key': 'a', 'LastModified': datetime.datetime(2021, 1, 1)},
                        {'Key': 'b', 'LastModified': datetime.datetime(2022, 1, 1)},
                        {'Key': 'c', 'LastModified': datetime.datetime(2020, 1, 1)},
                    ],
                    'IsTruncated': True,
                }
            else:
                return {
                    'Contents': [
                    ],
                    'IsTruncated': False,
                }
        bucket.client = mock.Mock(list_objects=list_objects)

        bucket._counter = 0
        self.assertEqual(list(bucket.list_files('key')), ['a', 'b', 'c'])

        bucket._counter = 0
        self.assertEqual(list(bucket.list_files('key', max_last_modified=datetime.datetime(2021, 1, 1))), ['a', 'c'])

    def test_delete_file(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def delete_object(Bucket=None, Key=None):
            return None
        bucket.client = mock.Mock(delete_object=delete_object)
        bucket.delete_file('key')

    def test_delete_files_with_prefix(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        bucket._counter = 0

        def list_objects(Bucket=None, Prefix=None, Marker=None, MaxKeys=1000):
            bucket._counter += 1
            if bucket._counter <= 1:
                return {
                    'Contents': [
                        {'Key': 'a', 'LastModified': datetime.datetime(2021, 1, 1)},
                        {'Key': 'b', 'LastModified': datetime.datetime(2022, 1, 1)},
                        {'Key': 'c', 'LastModified': datetime.datetime(2020, 1, 1)},
                    ],
                    'NextMarker': 'x',
                    'IsTruncated': True,
                }
            elif bucket._counter <= 2:
                return {
                    'Contents': [
                        {'Key': 'a', 'LastModified': datetime.datetime(2021, 1, 1)},
                        {'Key': 'b', 'LastModified': datetime.datetime(2022, 1, 1)},
                        {'Key': 'c', 'LastModified': datetime.datetime(2020, 1, 1)},
                    ],
                    'NextMarker': None,
                    'IsTruncated': True,
                }
            else:
                return {
                    'Contents': [
                    ],
                    'NextMarker': None,
                    'IsTruncated': False,
                }

        def delete_objects(Bucket=None, Delete=None):
            return None

        bucket.client = mock.Mock(list_objects=list_objects, delete_objects=delete_objects)

        bucket.delete_files_with_prefix('key')
