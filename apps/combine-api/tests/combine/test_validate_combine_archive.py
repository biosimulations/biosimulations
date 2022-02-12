from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from src import app
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import unittest


class ValidateCombineArchiveTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def test_validate_is_valid(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateSedmlModels', False),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        validation_report.pop('warnings')
        self.assertEqual(validation_report, {
            "_type": "ValidationReport",
            "status": "warnings"
        })

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/validate',
                method='post',
                body={
                    'file': file_content,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                    'omexMetadataSchema': OmexMetadataSchema.biosimulations.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(validation_report),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_validate_is_valid_from_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous-no-changes.omex')

        data = MultiDict([
            ('url', 'https://archive.combine.org'),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateSedmlModels', False),
        ])
        endpoint = '/combine/validate'
        with open(archive_filename, 'rb') as file:
            response = response = mock.Mock(
                raise_for_status=lambda: None,
                content=file.read(),
            )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report, {
            "_type": "ValidationReport",
            "status": "valid"
        })

    def test_validate_is_invalid(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'invalid-SED-ML.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('must have the required attributes', json.dumps(validation_report['errors']))

    def test_validate_is_not_an_archive(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'file.txt')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('is not a valid COMBINE/OMEX archive', json.dumps(validation_report['errors']))

    def test_validate_omex_manifest_option(self):
        # no manifest
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'no-manifest.omex')

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('is not a valid COMBINE/OMEX archive', json.dumps(validation_report['errors']))

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateOmexManifest', False),
            ('validateOmexMetadata', False),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "warnings")

        # bad manifest
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'bad-manifest.omex')

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('is not a valid COMBINE/OMEX archive', json.dumps(validation_report['errors']))

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateOmexManifest', False),
            ('validateOmexMetadata', False),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "warnings")

    def test_get_similar_algorithms(self):
        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000088'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        alt_algs = response.json
        self.assertEqual(alt_algs[0]['algorithms'][1]['id'], 'KISAO_0000088')
        self.assertNotEqual(alt_algs[1]['algorithms'][1]['id'], 'KISAO_0000088')

        alt_alg_ids = [alt_alg['algorithms'][1]['id'] for alt_alg in alt_algs]
        self.assertIn('KISAO_0000019', alt_alg_ids)
        self.assertNotIn('KISAO_0000209', alt_alg_ids)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000088&algorithms=KISAO_0000437'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        alt_algs = response.json
        alg_subs = sorted((alt_alg['algorithms'][0]['id'], alt_alg['algorithms'][1]['id'])
                          for alt_alg in alt_algs if alt_alg['maxPolicy']['level'] == 1)
        self.assertEqual(alg_subs, [('KISAO_0000088', 'KISAO_0000088'), ('KISAO_0000437', 'KISAO_0000437')])

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO:9999999'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_9999999'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000209'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)
