from unittest import mock
from src import s3
import os
import tempfile
import unittest


class S3TestCase(unittest.TestCase):
    def setUp(self):
        _, self.config_filename = tempfile.mkstemp()
        _, self.secret_filename = tempfile.mkstemp()

    def tearDown(self):
        os.remove(self.config_filename)
        os.remove(self.secret_filename)

    def test_get_configuration(self):
        with open(self.config_filename, 'w') as file:
            file.write('STORAGE_ENDPOINT=a\n')
            file.write('STORAGE_PUBLIC_ENDPOINT=b\n')
            file.write('STORAGE_BUCKET=c\n')

        with open(self.secret_filename, 'w') as file:
            file.write('STORAGE_ACCESS_KEY=d\n')
            file.write('STORAGE_SECRET=e\n')

        config = s3.S3Bucket.get_configuration(config_filename=self.config_filename, secret_filename=self.secret_filename)

        self.assertEqual(config, {
            'endpoint': 'a',
            'public_endpoint': 'b',
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
