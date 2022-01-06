from unittest import mock
from src import s3
import boto3
import os
import tempfile
import unittest


class S3TestCase(unittest.TestCase):
    def setUp(self):
        _, self.config_filename = tempfile.mkstemp()
        _, self.secret_filename = tempfile.mkstemp()

        with open(self.config_filename, 'w') as file:
            file.write('STORAGE_ENDPOINT=https://server.com\n')
            file.write('STORAGE_PUBLIC_ENDPOINT=https://server.com\n')
            file.write('STORAGE_BUCKET=c\n')

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
            'public_endpoint': 'https://server.com',
            'default_bucket': 'c',
            'access_key_id': 'd',
            'secret_access_key': 'e',
        })

        s3.S3Bucket.validate_configuration(config)

    def test_get_invalid_configuration(self):
        with open(self.config_filename, 'w') as file:
            file.write('STORAGE_ENDPOINT=\n')
            file.write('STORAGE_PUBLIC_ENDPOINT=\n')
            file.write('STORAGE_BUCKET=\n')

        with open(self.secret_filename, 'w') as file:
            file.write('STORAGE_ACCESS_KEY=\n')
            file.write('STORAGE_SECRET=\n')

        config = s3.S3Bucket.get_configuration(config_filename=self.config_filename, secret_filename=self.secret_filename)

        self.assertEqual(config, {
            'endpoint': '',
            'public_endpoint': '',
            'default_bucket': '',
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
            'public_endpoint': None,
            'default_bucket': None,
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
            'public_endpoint': None,
            'default_bucket': None,
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
        self.assertEqual(bucket.upload_file('filename', 'key', False), bucket.public_endpoint + 'key')
        self.assertEqual(bucket.upload_file('filename', 'key', True), bucket.public_endpoint + 'key')

    def test_download_file(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def download_file(Key=None, Filename=None):
            return None
        bucket.bucket = mock.Mock(download_file=download_file)
        bucket.download_file('key', 'filename')

    def test_is_file(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def filter(Prefix=None):
            return [mock.Mock(key='key')]
        bucket.bucket = mock.Mock(objects=mock.Mock(filter=filter))
        self.assertTrue(bucket.is_file('key'))
        self.assertFalse(bucket.is_file('key2'))

    def test_get_file_properties(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def filter(Prefix=None):
            return [mock.Mock(key='key')]
        bucket.bucket = mock.Mock(objects=mock.Mock(filter=filter))
        self.assertIsInstance(bucket.get_file_properties('key'), mock.Mock)

    def test_list_files(self):
        bucket = s3.S3Bucket(config_filename=self.config_filename, secret_filename=self.secret_filename)

        def filter(Prefix=None):
            return [
                mock.Mock(key='a'),
                mock.Mock(key='b'),
                mock.Mock(key='c'),
            ]
        bucket.bucket = mock.Mock(objects=mock.Mock(filter=filter))
        self.assertEqual(bucket.list_files('key'), ['a', 'b', 'c'])
