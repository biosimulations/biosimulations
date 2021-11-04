from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema
from src import app
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import requests.exceptions
import unittest


class ValidateOmexMetadataHandlerTestCase(unittest.TestCase):
    FIXTURE_FILENAME = os.path.join(os.path.dirname(__file__), '..', 'fixtures', 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.rdf')

    def test_file_is_valid(self):
        fid = open(self.FIXTURE_FILENAME, 'rb')

        data = MultiDict([
            ('file', fid),
            ('format', OmexMetadataInputFormat.rdfxml.value),
            ('schema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/omex-metadata/validate'
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

    def test_url_is_valid(self):
        data = MultiDict([
            ('url', 'https://models.com/metadata.rdf'),
            ('format', OmexMetadataInputFormat.rdfxml.value),
            ('schema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/omex-metadata/validate'
        with app.app.app.test_client() as client:
            with open(self.FIXTURE_FILENAME, 'rb') as file:
                response = mock.Mock(raise_for_status=lambda: None, content=file.read())
                with mock.patch('requests.get', return_value=response):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        validation_report.pop('warnings')
        self.assertEqual(validation_report, {
            "_type": "ValidationReport",
            "status": "warnings"
        })

    def test_is_invalid(self):
        fid = open(self.FIXTURE_FILENAME, 'rb')

        data = MultiDict([
            ('file', fid),
            ('format', OmexMetadataInputFormat.ntriples.value),
            ('schema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/omex-metadata/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('illegal character', json.dumps(validation_report['errors']))

    def test_error_handling(self):
        # unsupported format/schema
        data = MultiDict([
            ('url', 'https://models.com/metadata.rdf'),
            ('format', 'unsupported'),
            ('schema', 'unsupported'),
        ])
        endpoint = '/omex-metadata/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not one of', response.json['detail'])

        # file and URL
        fid = open(self.FIXTURE_FILENAME, 'rb')
        data = MultiDict([
            ('file', fid),
            ('url', 'https://models.com/metadata.rdf'),
            ('format', OmexMetadataInputFormat.ntriples.value),
            ('schema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/omex-metadata/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('Only one of', response.json['title'])

        # no file or URL
        data = MultiDict([
            ('format', OmexMetadataInputFormat.ntriples.value),
            ('schema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/omex-metadata/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('must be used', response.json['title'])

        # invalid URL
        data = MultiDict([
            ('url', 'https://models.com/metadata.rdf'),
            ('format', OmexMetadataInputFormat.ntriples.value),
            ('schema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/omex-metadata/validate'
        with app.app.app.test_client() as client:
            with mock.patch('requests.get', side_effect=requests.exceptions.RequestException('Big error')):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('could not be loaded', response.json['title'])
