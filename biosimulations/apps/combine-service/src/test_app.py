from openapi_core.validation.response.validators import ResponseValidator
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from openapi_core import create_spec
from unittest import mock
from werkzeug.datastructures import MultiDict
import importlib.util
import json
import os
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
