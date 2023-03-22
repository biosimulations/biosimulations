import requests
from openapi_core.contrib.requests.responses import RequestsOpenAPIResponse
from openapi_core.contrib.requests.requests import RequestsOpenAPIRequest
from openapi_core.validation.request.datatypes import (
    # OpenAPIRequest,
    RequestParameters,
)
from combine_api import app
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import unittest


class GetCombineArchiveManifestTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def test_get_manifest_for_combine_archive_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        data = MultiDict([
            ('url', archive_url),
        ])
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/manifest'
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        manifest = response.json

        expected_manifest = {
            '_type': 'CombineArchiveManifest',
            'contents': [
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sbml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './Caravagna2010.xml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'Caravagna2010.xml',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sed-ml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './BIOMD0000000912_sim.sedml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'BIOMD0000000912_sim.sedml',
                        },
                    },
                    'master': True
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': '.',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': '.',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex-metadata',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': 'metadata.rdf',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'metadata.rdf',
                        },
                    },
                    'master': False
                }
            ]
        }
        self.assertEqual(manifest, expected_manifest, manifest)

        # validate request and response
        if hasattr(self, "request_validator"):
            request = RequestsOpenAPIRequest(request=requests.Request(
                url='https://127.0.0.1/combine/manifest',
                method='post',
                data={
                    'url': archive_url,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            ))
            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_manifest),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_manifest_for_combine_archive_file(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
        ])
        endpoint = '/combine/manifest'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        manifest = response.json

        expected_manifest = {
            '_type': 'CombineArchiveManifest',
            'contents': [
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sbml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './Caravagna2010.xml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'Caravagna2010.xml',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sed-ml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './BIOMD0000000912_sim.sedml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'BIOMD0000000912_sim.sedml',
                        },
                    },
                    'master': True
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': '.',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': '.',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex-metadata',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': 'metadata.rdf',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'metadata.rdf',
                        },
                    },
                    'master': False
                }
            ]
        }
        self.assertEqual(manifest, expected_manifest)

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/manifest',
                method='post',
                body={
                    'file': file_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_manifest),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_manifest_for_combine_archive_error_handling(self):
        endpoint = '/combine/manifest'
        data = MultiDict([
            ('url', 'x'),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertTrue(response.json['title'].startswith(
            'File could not be loaded from'))

        if hasattr(self, "response_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/manifest',
                method='post',
                body={
                    'url': 'x',
                },
                mimetype=None,
                parameters=RequestParameters(),
            )
            response = OpenAPIResponse(
                data=json.dumps(response.json),
                status_code=400,
                mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

        response = mock.Mock(
            raise_for_status=lambda: None,
            content=b'.',
        )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('File is not a valid manifest or a COMBINE/OMEX which contains a valid manifest', response.json['title'])

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'no-manifest.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('does not contain a manifest', response.json['title'])

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'bad-manifest.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('File is not a valid manifest or a COMBINE/OMEX which contains a valid manifest', response.json['title'])
