from combine_api import s3
from unittest import mock
import unittest


class UtilsTestCase(unittest.TestCase):
    def test_delete_temporary_files_in_s3_bucket(self):
        def delete_files_with_prefix(prefix=None, max_last_modified=None):
            pass
        with mock.patch.object(s3, 'get_s3_bucket', return_value=mock.Mock(delete_files_with_prefix=delete_files_with_prefix)):
            s3.delete_temporary_files_in_s3_bucket()
