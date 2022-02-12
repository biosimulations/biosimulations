from biosimulators_utils.sedml.data_model import Symbol
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


class GetSedmlVariablesParametersTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')

    def test_get_parameters_variables_for_simulation_from_file(self):
        endpoint = '/sed-ml/get-parameters-variables-for-simulation'

        model_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'Chaouiya-BMC-Syst-Biol-2013-EGF-TNFa-signaling.xml'))
        model_fid = open(model_filename, 'rb')

        data = MultiDict([
            ('modelLanguage', 'urn:sedml:language:sbml'),
            ('modelingFramework', 'SBO_0000547'),
            ('simulationType', 'SedUniformTimeCourseSimulation'),
            ('simulationAlgorithm', 'KISAO_0000450'),
            ('modelFile', model_fid),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        model_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        sed_doc = response.json
        vars = [data_gen['variables'][0] for data_gen in sed_doc['dataGenerators']]

        self.assertEqual(vars[0]['id'], 'time')
        self.assertEqual(vars[0]['name'], 'Time')
        self.assertEqual(vars[0]['symbol'], Symbol.time)
        self.assertNotIn('target', vars[0])

        self.assertEqual(vars[-1]['id'], 'level_species_nik')
        self.assertEqual(vars[-1]['name'], 'Level of species "nik"')
        self.assertNotIn('symbol', vars[-1])

        vars[-1]['target']['namespaces'].sort(key=lambda ns: ns['prefix'])
        self.assertEqual(
            vars[-1]['target'],
            {
                "_type": "SedTarget",
                "value": "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='nik']",
                "namespaces": [
                    {"_type": "Namespace", "prefix": "qual", "uri": "http://www.sbml.org/sbml/level3/version1/qual/version1"},
                    {"_type": "Namespace", "prefix": "sbml", "uri": "http://www.sbml.org/sbml/level3/version1/core"},
                ]
            },
        )

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(model_filename, 'rb') as file:
                model_content = file.read()
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/' + endpoint,
                method='post',
                body={
                    'modelLanguage': 'urn:sedml:language:sbml',
                    'modelingFramework': 'SBO_0000547',
                    'simulationType': 'SedUniformTimeCourseSimulation',
                    'simulationAlgorithm': 'KISAO_0000029',
                    'modelFile': model_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(sed_doc),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_parameters_variables_for_simulation_from_url(self):
        endpoint = '/sed-ml/get-parameters-variables-for-simulation'

        model_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'Chaouiya-BMC-Syst-Biol-2013-EGF-TNFa-signaling.xml'))
        model_fid = open(model_filename, 'rb')

        model_url = 'http://models.org/Chaouiya-BMC-Syst-Biol-2013-EGF-TNFa-signaling.xml'

        data = MultiDict([
            ('modelLanguage', 'urn:sedml:language:sbml'),
            ('modelingFramework', 'SBO_0000547'),
            ('simulationType', 'SedUniformTimeCourseSimulation'),
            ('simulationAlgorithm', 'KISAO_0000450'),
            ('modelUrl', model_url),
        ])
        with app.app.app.test_client() as client:
            def requests_get(url):
                assert url == model_url
                return mock.Mock(raise_for_status=lambda: None, content=model_fid.read())

            with mock.patch('requests.get', side_effect=requests_get):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        model_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        sed_doc = response.json
        vars = [data_gen['variables'][0] for data_gen in sed_doc['dataGenerators']]

        self.assertEqual(vars[0]['id'], 'time')
        self.assertEqual(vars[0]['name'], 'Time')
        self.assertEqual(vars[0]['symbol'], Symbol.time)
        self.assertNotIn('target', vars[0])

        self.assertEqual(vars[-1]['id'], 'level_species_nik')
        self.assertEqual(vars[-1]['name'], 'Level of species "nik"')
        self.assertNotIn('symbol', vars[-1])

        vars[-1]['target']['namespaces'].sort(key=lambda ns: ns['prefix'])
        self.assertEqual(
            vars[-1]['target'],
            {
                "_type": "SedTarget",
                "value": "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='nik']",
                "namespaces": [
                    {"_type": "Namespace", "prefix": "qual", "uri": "http://www.sbml.org/sbml/level3/version1/qual/version1"},
                    {"_type": "Namespace", "prefix": "sbml", "uri": "http://www.sbml.org/sbml/level3/version1/core"},
                ]
            },
        )

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(model_filename, 'rb') as file:
                model_content = file.read()
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/' + endpoint,
                method='post',
                body={
                    'modelLanguage': 'urn:sedml:language:sbml',
                    'modelingFramework': 'SBO_0000547',
                    'simulationType': 'SedUniformTimeCourseSimulation',
                    'simulationAlgorithm': 'KISAO_0000029',
                    'modelFile': model_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(sed_doc),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_parameters_variables_for_simulation_with_plot(self):
        endpoint = '/sed-ml/get-parameters-variables-for-simulation'

        model_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'wilson-cowan.ode'))
        model_fid = open(model_filename, 'rb')

        model_url = 'http://models.org/wilson-cowan.ode'

        data = MultiDict([
            ('modelLanguage', 'urn:sedml:language:xpp'),
            ('modelingFramework', 'SBO_0000293'),
            ('simulationType', 'SedUniformTimeCourseSimulation'),
            ('simulationAlgorithm', 'KISAO_0000019'),
            ('modelUrl', model_url),
        ])
        with app.app.app.test_client() as client:
            def requests_get(url):
                assert url == model_url
                return mock.Mock(raise_for_status=lambda: None, content=model_fid.read())

            with mock.patch('requests.get', side_effect=requests_get):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        model_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        sed_doc = response.json
        vars = [data_gen['variables'][0] for data_gen in sed_doc['dataGenerators']]

        self.assertEqual(vars[0]['id'], 'time')
        self.assertEqual(vars[0]['name'], 'Time')
        self.assertEqual(vars[0]['symbol'], Symbol.time)
        self.assertNotIn('target', vars[0])

        self.assertEqual(vars[-1]['id'], 'dynamics_V')
        self.assertEqual(vars[-1]['name'], 'Dynamics of "V"')
        self.assertNotIn('symbol', vars[-1])

        self.assertEqual(
            vars[-1]['target'],
            {
                "_type": "SedTarget",
                "value": "V",
            },
        )

        data_gen_u = next(data_gen for data_gen in sed_doc['dataGenerators'] if data_gen['id'] == 'data_generator_dynamics_U')
        data_gen_v = next(data_gen for data_gen in sed_doc['dataGenerators'] if data_gen['id'] == 'data_generator_dynamics_V')
        self.assertEqual(data_gen_u, {
            "_type": "SedDataGenerator",
            "id": "data_generator_dynamics_U",
            "name": 'Dynamics of "U"',
            "parameters": [],
            "variables": [{
                "_type": "SedVariable",
                "id": "dynamics_U",
                "name": 'Dynamics of "U"',
                "target": {
                    "_type": "SedTarget",
                    "value": "U",
                },
                "task": "task",
            }],
            "math": "dynamics_U",
        })
        self.assertEqual(data_gen_v, {
            "_type": "SedDataGenerator",
            "id": "data_generator_dynamics_V",
            "name": 'Dynamics of "V"',
            "parameters": [],
            "variables": [{
                "_type": "SedVariable",
                "id": "dynamics_V",
                "name": 'Dynamics of "V"',
                "target": {
                    "_type": "SedTarget",
                    "value": "V",
                },
                "task": "task",
            }],
            "math": "dynamics_V",
        })

        plot = sed_doc['outputs'][-1]

        self.assertEqual(
            plot,
            {
                "_type": "SedPlot2D",
                "id": "plot",
                "name": None,
                "curves": [
                    {
                        "_type": "SedCurve",
                        "id": "curve_1",
                        "name": "V vs U",
                        "xDataGenerator": "data_generator_dynamics_U",
                        "yDataGenerator": "data_generator_dynamics_V",
                        'xScale': 'linear',
                        'yScale': 'linear',
                    }
                ]
            },
        )
