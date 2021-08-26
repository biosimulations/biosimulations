from src import app
from src.handlers.run.utils import get_simulator_api, get_simulators, exec_in_subprocess
from unittest import mock
import os
import parameterized
import requests
import shutil
import tempfile
import unittest


class GetSimulatorsTestCase(unittest.TestCase):
    def test(self):
        endpoint = '/run/simulators'
        with app.app.app.test_client() as client:
            simulators = [
                {
                    'id': 'copasi',
                    'name': "COPASI",
                    'api': {
                        'module': 'biosimulators_copasi',
                        'package': 'biosimulators_copasi',
                    },
                },
                {
                    'id': 'gillespy2',
                    'name': 'GillesPy2',
                    'api': {
                        'module': 'biosimulators_gillespy2',
                        'package': 'biosimulators_gillespy2',
                    },
                },
            ]
            with mock.patch('src.handlers.run.utils.get_simulators', return_value=simulators):
                response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)

        simulators = response.json
        id = 'copasi'
        name = 'COPASI'
        sim = next(simulator for simulator in simulators if simulator['id'] == id)
        api_name = 'biosimulators_copasi'
        self.assertEqual(sim, {
            '_type': 'Simulator',
            'id': id,
            'name': name,
            'version': sim['version'],
            'api': {
                '_type': 'SimulatorApi',
                'module': api_name,
                'package': api_name,
                'version': sim['api']['version'],
            },
            'specs': 'https://api.biosimulators.org/simulators/{}/{}'.format(id, sim['version'])
        })


SIMULATORS = os.environ.get('SIMULATORS', None)
if SIMULATORS is not None:
    if SIMULATORS:
        SIMULATORS = SIMULATORS.split(',')
    else:
        SIMULATORS = []

SKIPPED_SIMULATORS = os.environ.get('SKIPPED_SIMULATORS', None)
if SKIPPED_SIMULATORS is not None:
    if SKIPPED_SIMULATORS:
        SKIPPED_SIMULATORS = SKIPPED_SIMULATORS.split(',')
    else:
        SKIPPED_SIMULATORS = []

EXAMPLES_BASE_URL = 'https://github.com/biosimulators/Biosimulators_test_suite/raw/deploy/examples'


class SimulatorsHaveValidApisTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.tmp_dirname)

    @parameterized.parameterized.expand(
        (simulator['id'], simulator)
        for simulator in get_simulators()
        if (
            (SIMULATORS is None or simulator['id'] in SIMULATORS)
            and (SKIPPED_SIMULATORS is None or simulator['id'] not in SKIPPED_SIMULATORS)
        )
    )
    def test(self, id, simulator):
        exec_in_subprocess(self._test, simulator['api']['module'], simulator['exampleCombineArchive'], self.tmp_dirname)

    @staticmethod
    def _test(simulator_module, example_combine_archive, tmp_dirname):
        api = get_simulator_api(simulator_module, False)

        # __version__
        if not hasattr(api, '__version__'):
            raise NotImplementedError('API must have a `__version__` attribute whose value is a non-empty string (e.g., 1.0.1)')
        if not isinstance(api.__version__, str):
            raise ValueError('API must have a `__version__` attribute whose value is a non-empty string (e.g., 1.0.1), not `{}`'.format(
                api.__version__.__class__.__name__))
        if api.__version__ == '':
            raise ValueError('API must have a `__version__` attribute whose value is a non-empty string (e.g., 1.0.1), not `{}`'.format(
                api.__version__))

        # get_simulator_version
        if not hasattr(api, 'get_simulator_version'):
            raise NotImplementedError('API must have a `get_simulator_version` callable that returns a non-empty string (e.g., 1.0.1)')
        if not callable(api.get_simulator_version):
            raise ValueError('`get_simulator_version` must be a callable that returns a non-empty string (e.g., 1.0.1), not `{}`'.format(
                api.get_simulator_version.__class__.__name__))
        simulator_version = api.get_simulator_version()
        if not isinstance(simulator_version, str):
            raise ValueError('`get_simulator_version` must return a non-empty string (e.g., 1.0.1), not `{}`'.format(
                simulator_version.__class__.__name__))
        if simulator_version == '':
            raise ValueError('`get_simulator_version` must return a non-empty string (e.g., 1.0.1), not `{}`'.format(
                simulator_version))

        # exec_sedml_docs_in_combine_archive
        if not hasattr(api, 'exec_sedml_docs_in_combine_archive'):
            raise NotImplementedError('API must have a `exec_sedml_docs_in_combine_archive` callable')
        if not callable(api.exec_sedml_docs_in_combine_archive):
            raise ValueError('`exec_sedml_docs_in_combine_archive` must be a callable, not `{}`'.format(
                api.exec_sedml_docs_in_combine_archive.__class__.__name__))

        response = requests.get(EXAMPLES_BASE_URL + '/' + example_combine_archive)
        response.raise_for_status()
        archive_filename = os.path.join(tmp_dirname, 'archive.omex')
        with open(archive_filename, 'wb') as file:
            file.write(response.content)
        out_dir = os.path.join(tmp_dirname, 'out')
        results, log = api.exec_sedml_docs_in_combine_archive(archive_filename, out_dir,
                                                              return_results=True,
                                                              report_formats=None, plot_formats=None,
                                                              bundle_outputs=None, keep_individual_outputs=None,
                                                              raise_exceptions=True)

        # exec_sed_task
        if not hasattr(api, 'exec_sed_task'):
            raise NotImplementedError('API must have a `exec_sed_task` callable')
        if not callable(api.exec_sed_task):
            raise ValueError('`exec_sed_task` must be a callable, not `{}`'.format(
                api.exec_sed_task.__class__.__name__))
