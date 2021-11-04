from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema
from biosimulators_utils.sedml.data_model import ModelLanguage, Symbol
from biosimulators_utils.sedml.io import SedmlSimulationReader
from openapi_core.contrib.requests import RequestsOpenAPIRequestFactory
from openapi_core.validation.response.validators import ResponseValidator
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from openapi_core import create_spec
from openapi_spec_validator import validate_spec as validate_api_spec
from openapi_spec_validator.readers import read_from_filename as read_api_spec_from_filename
from src import app
import unittest


class HealthHandlerTestCase(unittest.TestCase):
    def test_get_sedml_specs_for_combine_archive_url(self):
        endpoint = '/health'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'ok'})
