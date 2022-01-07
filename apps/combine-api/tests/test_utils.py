from src import utils
import unittest


class UtilsTestCase(unittest.TestCase):
    def setUp(self):
        self.bucket = bucket = utils.get_s3_bucket()

        self.delete_files_with_prefix = bucket.delete_files_with_prefix

        def mock_delete_files_with_prefix(prefix=None, max_last_modified=None):
            pass
        bucket.delete_files_with_prefix = mock_delete_files_with_prefix

    def tearDown(self):
        self.bucket.delete_files_with_prefix = self.delete_files_with_prefix

    def test_delete_temporary_combine_archives_in_s3_bucket(self):
        utils.delete_temporary_combine_archives_in_s3_bucket()
