from biosimulators_utils.log.data_model import Status
from src import app
from src.handlers.run.utils import get_simulator_api
from unittest import mock
from werkzeug.datastructures import FileStorage, MultiDict
import json
import numpy
import numpy.testing
import os
import requests.exceptions
import unittest


class RunSimulationTestCase(unittest.TestCase):
    FIXTURES_DIRNAME = os.path.join(os.path.dirname(__file__), '..', 'fixtures')

    def test_url(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')
        data = MultiDict([
            ('_type', 'SimulationRun'),
            ('archiveUrl', 'https://web.site/archive.omex'),
            ('simulator', 'copasi'),
            ('environment', json.dumps({
                "_type": "Environment",
                "variables": [
                    {
                        '_type': 'EnvironmentVariable',
                        'key': 'VERBOSE',
                        'value': '1',
                    },
                ]
            })),
        ])
        with app.app.app.test_client() as client:
            with open(archive_filename, 'rb') as archive_file:
                with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=lambda: None, content=archive_file.read())):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

        self.assertEqual(set(response.keys()), set(['_type', 'outputs', 'log']))
        self.assertEqual(response['_type'], 'SimulationRunResults')
        self.assertEqual(response['log']['status'], Status.SUCCEEDED.value)
        self.assertEqual(
            set([output['outputId'] for output in response['outputs']]),
            set([
                './BIOMD0000000912_sim.sedml/BIOMD0000000912_report',
                './BIOMD0000000912_sim.sedml/plot_1',
            ])
        )

        report = next(output for output in response['outputs']
                      if output['outputId'] == './BIOMD0000000912_sim.sedml/BIOMD0000000912_report')
        self.assertEqual(set(report.keys()), set(['_type', 'outputId', 'name', 'type', 'data']))
        self.assertEqual(report['_type'], 'SimulationRunOutput')
        self.assertEqual(report['name'], 'Caravagna2010')
        self.assertEqual(report['type'], 'SedReport')
        self.assertEqual(
            set([data['id'] for data in report['data']]),
            set([
                'data_set_time',
                'data_set_T',
                'data_set_E',
                'data_set_I',
            ]),
        )

        datum = next(datum for datum in report['data'] if datum['id'] == 'data_set_T')
        self.assertEqual(set(datum.keys()), set(['_type', 'id', 'label', 'name', 'type', 'shape', 'values']))
        self.assertEqual(datum['_type'], 'SimulationRunOutputDatum')
        self.assertEqual(datum['label'], 'T')
        self.assertEqual(datum['name'], None)
        self.assertEqual(datum['type'], 'float64')
        self.assertEqual(datum['shape'], '5001')
        self.assertFalse(numpy.any(numpy.isnan(datum['values'])))
        datum = next(datum for datum in report['data'] if datum['id'] == 'data_set_time')
        numpy.testing.assert_allclose(datum['values'], numpy.linspace(0., 1000., 5001))

        plot = next(output for output in response['outputs'] if output['outputId'] == './BIOMD0000000912_sim.sedml/plot_1')
        self.assertEqual(set(plot.keys()), set(['_type', 'outputId', 'name', 'type', 'data']))
        self.assertEqual(plot['_type'], 'SimulationRunOutput')
        self.assertEqual(plot['name'], ' ')
        self.assertEqual(plot['type'], 'SedPlot2D')
        self.assertEqual(
            set([data['id'] for data in plot['data']]),
            set([
                'data_generator_time',
                'data_generator_T',
                'data_generator_E',
                'data_generator_I',
            ]),
        )

        datum = next(datum for datum in plot['data'] if datum['id'] == 'data_generator_T')
        self.assertEqual(set(datum.keys()), set(['_type', 'id', 'label', 'name', 'type', 'shape', 'values']))
        self.assertEqual(datum['_type'], 'SimulationRunOutputDatum')
        self.assertEqual(datum['label'], 'data_generator_T')
        self.assertEqual(datum['name'], 'T')
        self.assertEqual(datum['type'], 'float64')
        self.assertEqual(datum['shape'], '5001')
        self.assertFalse(numpy.any(numpy.isnan(datum['values'])))
        datum = next(datum for datum in plot['data'] if datum['id'] == 'data_generator_time')
        numpy.testing.assert_allclose(datum['values'], numpy.linspace(0., 1000., 5001))

    def test_file(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveFile', archive_file),
                ('simulator', 'copasi'),
                ('environment', json.dumps({
                    "_type": "Environment",
                    "variables": [
                        {
                            '_type': 'EnvironmentVariable',
                            'key': 'VERBOSE',
                            'value': '1',
                        },
                    ]
                })),
            ])

            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

        self.assertEqual(set(response.keys()), set(['_type', 'outputs', 'log']))
        self.assertEqual(response['_type'], 'SimulationRunResults')
        self.assertEqual(response['log']['status'], Status.SUCCEEDED.value)
        self.assertEqual(
            set([output['outputId'] for output in response['outputs']]),
            set([
                './BIOMD0000000912_sim.sedml/BIOMD0000000912_report',
                './BIOMD0000000912_sim.sedml/plot_1',
            ])
        )

    def test_no_env_vars(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveFile', archive_file),
                ('simulator', 'copasi'),
            ])

            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

    def test_zero_env_vars(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveFile', archive_file),
                ('simulator', 'copasi'),
                ('environment', json.dumps({
                    "_type": "Environment",
                })),
            ])

            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveFile', archive_file),
                ('simulator', 'copasi'),
                ('environment', json.dumps({
                    "_type": "Environment",
                    "variables": [],
                })),
            ])

            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

    def test_empty_env_var(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveFile', archive_file),
                ('simulator', 'copasi'),
                ('environment', json.dumps({
                    "_type": "Environment",
                    "variables": [
                        {
                            '_type': 'EnvironmentVariable',
                            'key': 'AN_ENV_VAR',
                            'value': '',
                        },
                    ]
                })),
            ])

            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

    def test_error_handling(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex')

        # archiveFile and archiveUrl
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveUrl', 'https://web.site/archive.omex'),
                ('archiveFile', archive_file),
                ('simulator', 'copasi'),
            ])
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('Only one of', response.json['title'])

        # archiveUrl is not valid
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveUrl', 'https://web.site/archive.omex'),
                ('simulator', 'copasi'),
            ])
            with app.app.app.test_client() as client:
                def raise_for_status():
                    raise requests.exceptions.RequestException('bad URL')
                with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=raise_for_status)):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('could not be loaded from', response.json['title'])

        # simulator doesn't exist
        with open(archive_filename, 'rb') as archive_file:
            data = MultiDict([
                ('_type', 'SimulationRun'),
                ('archiveUrl', 'https://web.site/archive.omex'),
                ('simulator', '--undefined--'),
            ])
            with app.app.app.test_client() as client:
                with open(archive_filename, 'rb') as archive_file:
                    with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=lambda: None, content=archive_file.read())):
                        response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not a BioSimulators id', response.json['title'])

    def test_invalid_archive(self):
        endpoint = '/run/run'
        archive_filename = os.path.join(self.FIXTURES_DIRNAME, 'bad-manifest.omex')
        data = MultiDict([
            ('_type', 'SimulationRun'),
            ('archiveUrl', 'https://web.site/archive.omex'),
            ('simulator', 'copasi'),
            ('environment', json.dumps({
                "_type": "Environment",
                "variables": [
                    {
                        '_type': 'EnvironmentVariable',
                        'key': 'VERBOSE',
                        'value': '1',
                    },
                ]
            })),
        ])
        with app.app.app.test_client() as client:
            with open(archive_filename, 'rb') as archive_file:
                with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=lambda: None, content=archive_file.read())):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        response = response.json

        self.assertEqual(set(response.keys()), set(['_type', 'outputs', 'log']))
        self.assertEqual(response['_type'], 'SimulationRunResults')
        self.assertEqual(response['log']['status'], Status.FAILED.value)
        self.assertEqual(response['outputs'], [])
