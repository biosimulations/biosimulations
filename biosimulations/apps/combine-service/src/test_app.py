from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.sedml.io import SedmlSimulationReader
from openapi_core.validation.response.validators import ResponseValidator
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from openapi_core import create_spec
from unittest import mock
from werkzeug import FileStorage
from werkzeug.datastructures import MultiDict
import importlib.util
import io
import json
import os
import shutil
import tempfile
import unittest
import yaml

spec = importlib.util.spec_from_file_location(
    "app",
    os.path.abspath(os.path.join(os.path.dirname(__file__), 'app.py')))
app = importlib.util.module_from_spec(spec)
environ = {
    'API_SPECS_DIR': os.path.join(os.path.dirname(__file__), 'spec')
}
with mock.patch.dict('os.environ', environ):
    spec.loader.exec_module(app)


class HandlersTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), 'test-fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    @ classmethod
    def setUpClass(cls):
        specs_filename = os.path.join(os.path.dirname(__file__),
                                      'spec', 'combine-service.yml')
        with open(specs_filename, 'rb') as specs_file:
            specs_dict = yaml.load(specs_file, Loader=yaml.Loader)
        specs = create_spec(specs_dict)
        cls.request_validator = RequestValidator(specs)
        cls.response_validator = ResponseValidator(specs)

    def test_get_sedml_output_specs_for_combine_archive(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        with mock.patch('requests.get', return_value=response):
            endpoint = '/combine/sedml-output-specs?archiveUrl={}'.format(
                archive_url)
            with app.app.app.test_client() as client:
                response = client.get(endpoint)
        self.assertEqual(response.status_code, 200)
        combine_specs = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.sed-output-specs.json')
        with open(sed_output_specs_filename, 'r') as file:
            expected_combine_specs = json.load(file)
        self.assertEqual(combine_specs, expected_combine_specs)

        # validate request and response
        request = OpenAPIRequest(
            full_url_pattern='https://127.0.0.1/combine/sedml-output-specs',
            method='get',
            body=None,
            mimetype=None,
            parameters=RequestParameters(
                query=MultiDict({'archiveUrl': archive_url}),
            )
        )
        result = self.request_validator.validate(request)
        result.raise_for_errors()

        response = OpenAPIResponse(data=json.dumps(expected_combine_specs),
                                   status_code=200,
                                   mimetype='application/json')
        result = self.response_validator.validate(request, response)
        result.raise_for_errors()

    def test_get_sedml_output_specs_for_combine_archive_error_handling(self):
        endpoint = '/combine/sedml-output-specs?archiveUrl=x'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.json['title'].startswith(
            'COMBINE/OMEX archive could not be loaded'))

        request = OpenAPIRequest(
            full_url_pattern='https://127.0.0.1/combine/sedml-output-specs',
            method='get',
            body=None,
            mimetype=None,
            parameters=RequestParameters(
                query=MultiDict({'archiveUrl': 'x'}),
            )
        )
        response = OpenAPIResponse(
            data=json.dumps(response.json),
            status_code=400,
            mimetype='application/json')
        result = self.response_validator.validate(request, response)
        result.raise_for_errors()

    def test_create_combine_archive(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def _save_file_to_s3_bucket(filename, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            original_save_file_to_s3_bucket = getattr(app.handlers, '_save_file_to_s3_bucket')
            setattr(app.handlers, '_save_file_to_s3_bucket', _save_file_to_s3_bucket)
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
            setattr(app.handlers, '_save_file_to_s3_bucket', original_save_file_to_s3_bucket)

        fid_0.close()
        fid_1.close()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader.run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 3)

        for content, expected_content in zip(archive.contents, archive_specs['contents']):
            self.assertEqual(content.location, expected_content['location']['path'])
            self.assertEqual(content.format, expected_content['format'])
            self.assertEqual(content.master, expected_content['master'])

        sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']))
        sed_doc_specs = archive_specs['contents'][2]['location']['value']
        self.assertEqual(sed_doc.level, sed_doc_specs['level'])
        self.assertEqual(sed_doc.version, sed_doc_specs['version'])

        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].kisao_id, 'KISAO_0000488')
        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].new_value, '10')
        self.assertEqual(sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target,
                         "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='x']")
