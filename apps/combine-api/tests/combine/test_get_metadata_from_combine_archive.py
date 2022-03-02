from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from src import app
from src.exceptions import BadRequestException
from src.handlers.combine.get_metadata_for_combine_archive import _convert_rdf_node_to_json
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import unittest


class GetMetadataTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')

    def test_get_metadata_for_combine_archive_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        data = MultiDict([
            ('url', archive_url),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/metadata/biosimulations'
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, response.json)
        metadata = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.md.json')

        with open(sed_output_specs_filename, 'r') as file:
            expected_metadata = json.load(file)
        self.assertEqual(metadata, expected_metadata, metadata)

        # validate request and response
        if hasattr(self, "request_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/biosimulations',
                method='post',
                body={
                    'url': archive_url,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )
            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_metadata),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_metadata_for_combine_archive_file_as_biosimulations(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        endpoint = '/combine/metadata/biosimulations'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        metadata = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.md.json')
        with open(sed_output_specs_filename, 'r') as file:
            expected_metadata = json.load(file)
        self.assertEqual(metadata, expected_metadata)

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/biosimulations',
                method='post',
                body={
                    'file': file_content,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_metadata),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_metadata_for_combine_archive_file_as_rdf_triples(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        endpoint = '/combine/metadata/rdf'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        metadata = response.json

        self.assertEqual(metadata[0], {
            '_type': 'RdfTriple',
            'subject': {
                '_type': 'RdfUriNode',
                'value': 'http://omex-library.org/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex',
            },
            'predicate': {
                '_type': 'RdfUriNode',
                'value': 'http://purl.org/dc/elements/1.1/title',
            },
            'object': {
                '_type': 'RdfLiteralNode',
                'value': 'Morphogenesis checkpoint in budding yeast (continuous) (Ciliberto et al., Journal Cell Biology, 2003)',
            }
        })

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/rdf',
                method='post',
                body={
                    'file': file_content,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(metadata),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_metadata_for_combine_archive_error_handling(self):
        endpoint = '/combine/metadata/biosimulations'
        data = MultiDict([
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('must be used', response.json['title'])

        if hasattr(self, "response_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/biosimulations',
                method='post',
                body={
                    'url': 'x',
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
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

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'invalid-metadata.omex')
        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not valid', response.json['title'])
        fid.close()

    def test__convert_rdf_node_to_json(self):
        with self.assertRaises(BadRequestException):
            _convert_rdf_node_to_json(None)
