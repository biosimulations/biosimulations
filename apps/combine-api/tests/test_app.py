from openapi_core.validation.response.validators import V31ResponseValidator
from openapi_core.validation.request.validators import V31RequestValidator
from openapi_core.spec import Spec
from openapi_spec_validator import validate_spec as validate_api_spec
from openapi_spec_validator.readers import read_from_filename as read_api_spec_from_filename
import os
import unittest
import yaml


class HandlersTestCase(unittest.TestCase):
    API_SPECS_FILENAME = os.path.join(os.path.dirname(__file__),
                                      '..', 'combine_api', 'spec', 'spec.yml')

    @classmethod
    def setUpClass(cls):
        with open(cls.API_SPECS_FILENAME, 'rb') as specs_file:
            cls.api_specs_dict = yaml.load(specs_file, Loader=yaml.Loader)
        api_specs = Spec(cls.api_specs_dict)
        cls.request_validator = V31RequestValidator(spec=api_specs)
        cls.response_validator = V31ResponseValidator(spec=api_specs)

    def test_is_api_spec_valid(self):
        spec_dict, spec_url = read_api_spec_from_filename(self.API_SPECS_FILENAME)
        validate_api_spec(spec_dict)
