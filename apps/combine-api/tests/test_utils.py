from src import utils
from unittest import mock
import unittest


class UtilsTestCase(unittest.TestCase):
    def test_delete_temporary_combine_archives_in_s3_bucket(self):
        def delete_files_with_prefix(prefix=None, max_last_modified=None):
            pass
        with mock.patch.object(utils, 'get_s3_bucket', return_value=mock.Mock(delete_files_with_prefix=delete_files_with_prefix)):
            utils.delete_temporary_combine_archives_in_s3_bucket()
