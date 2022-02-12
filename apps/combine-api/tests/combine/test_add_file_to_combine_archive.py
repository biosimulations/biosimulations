from biosimulators_utils.combine.io import CombineArchiveReader
from src import app
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import requests.exceptions
import shutil
import tempfile
import unittest


class AddFileToCombineArchiveTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    def test_add_file_to_combine_archive(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'NewLocation.txt',
                         ]))

        content = next(content for content in archive.contents if content.location == 'NewLocation.txt')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'NewLocation.txt')))

    def test_add_file_to_combine_archive_upload_archive_by_url(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"url": 'htts://web.com/archive.omex'})),
            ('newContent', json.dumps(new_content)),
            ('files', new_content_fid),
        ])

        with open(archive_filename, 'rb') as file:
            get_response = mock.Mock(
                raise_for_status=lambda: None,
                content=file.read(),
            )

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                with mock.patch('requests.get', return_value=get_response):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")

        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'NewLocation.txt',
                         ]))

        content = next(content for content in archive.contents if content.location == 'NewLocation.txt')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'NewLocation.txt')))

    def test_add_file_to_combine_archive_at_existing_location(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': 'Caravagna2010.xml',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
            ('overwriteLocations', False),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'Caravagna2010_1.xml',
                         ]))

        content = next(content for content in archive.contents if content.location == 'Caravagna2010_1.xml')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'Caravagna2010_1.xml')))

    def test_add_file_to_combine_archive_at_existing_location_overwrite(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': 'Caravagna2010.xml',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
            ('overwriteLocations', True),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                         ]))

        content = next(content for content in archive.contents
                       if os.path.relpath(content.location, '.') == 'Caravagna2010.xml')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        with open(os.path.join(modified_archive_dirname, 'Caravagna2010.xml'), 'r') as file:
            self.assertEqual(file.read(), 'A text file\n')

    def test_add_file_to_combine_archive_download(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
            ('download', True),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.content_type, 'application/zip')
        modified_archive_filename = os.path.join(self.temp_dirname, 'archive-downloaded.omex')
        with open(modified_archive_filename, 'wb') as file:
            file.write(response.data)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'NewLocation.txt',
                         ]))

        content = next(content for content in archive.contents if content.location == 'NewLocation.txt')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'NewLocation.txt')))

    def test_add_file_to_combine_archive_error_handling_missing_archive(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', new_content_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        new_content_fid.close()

        self.assertEqual(response.status_code, 400, response.json)

    def test_add_file_to_combine_archive_error_handling_missing_file(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()

        self.assertEqual(response.status_code, 400, response.json)

    def test_add_file_to_combine_archive_error_handling_bad_archive(self):
        endpoint = '/combine/file'

        archive_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not valid', response.json['title'])

    def test_add_file_to_combine_archive_error_handling_upload_archive_by_url(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"url": 'htts://web.com/archive.omex'})),
            ('newContent', json.dumps(new_content)),
            ('files', new_content_fid),
        ])

        def raise_for_status():
            raise requests.exceptions.RequestException()
        get_response = mock.Mock(
            raise_for_status=raise_for_status,
        )

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            with mock.patch('requests.get', return_value=get_response):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        new_content_fid.close()

        self.assertEqual(response.status_code, 400, response.json)
