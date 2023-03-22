# from openapi_core.validation.response.datatypes import OpenAPIResponse
# from openapi_core.validation.request.datatypes import (
#     OpenAPIRequest,
#     RequestParameters,
# )
from combine_api import app
from unittest import mock
import imghdr
import json
import os
import shutil
import tempfile
import unittest
import urllib.parse


class GetFileFromCombineArchiveTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    def test_get_file_in_combine_archive_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        resolve_archive_response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/file?url={}&location={}'.format(
            urllib.parse.quote(archive_url),
            urllib.parse.quote('Figure1.jpg'),
        )
        with mock.patch('requests.get', return_value=resolve_archive_response):
            with app.app.app.test_client() as client:
                response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        image_filename = os.path.join(self.temp_dirname, 'image')
        with open(image_filename, 'wb') as file:
            file.write(response.data)

        self.assertEqual(imghdr.what(image_filename), 'jpeg')

        # # validate request and response
        # if hasattr(self, "request_validator"):
        #     request = OpenAPIRequest(
        #         full_url_pattern='https://127.0.0.1/combine/file',
        #         method='get',
        #         body={
        #             'url': archive_url,
        #             'location': 'Figure1.jpg',
        #         },
        #         mimetype='multipart/form-data',
        #         parameters=RequestParameters(url=archive_url,
        #                                      location='Figure1.jpg'),
        #     )
        #     result = self.request_validator.validate(request)
        #     result.raise_for_errors()
        #
        #     response = OpenAPIResponse(data=response.data,
        #                                status_code=200,
        #                                mimetype='image/jpeg')
        #     result = self.response_validator.validate(request, response)
        #     result.raise_for_errors()

    def test_get_file_in_combine_archive_error_handling(self):
        endpoint = '/combine/file?url={}&location={}'.format(
            urllib.parse.quote('x'),
            urllib.parse.quote('Figure1.jpg'),
        )
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)
        self.assertTrue(response.json['title'].startswith(
            'COMBINE/OMEX archive could not be loaded'))

        # if hasattr(self, "response_validator"):
        #     request = OpenAPIRequest(
        #         full_url_pattern='https://127.0.0.1/combine/file',
        #         method='get',
        #         mimetype=None,
        #         parameters=RequestParameters(url='x', location='Figure1.jpg'),
        #     )
        #     response = OpenAPIResponse(
        #         data=json.dumps(response.json),
        #         status_code=400,
        #         mimetype='image/jpeg')
        #     result = self.response_validator.validate(request, response)
        #     result.raise_for_errors()

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        resolve_archive_response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/file?url={}&location={}'.format(
            urllib.parse.quote(archive_url),
            urllib.parse.quote('undefined'),
        )
        with mock.patch('requests.get', return_value=resolve_archive_response):
            with app.app.app.test_client() as client:
                response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('not a valid location', response.json['title'])
