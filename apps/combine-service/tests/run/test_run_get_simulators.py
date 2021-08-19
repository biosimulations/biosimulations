from src import app
from src.handlers.run.utils import get_simulator_api
from unittest import mock
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
        api = get_simulator_api(api_name)
        self.assertEqual(sim, {
            '_type': 'Simulator',
            'id': id,
            'name': name,
            'version': api.get_simulator_version(),
            'api': {
                '_type': 'SimulatorApi',
                'module': api_name,
                'package': api_name,
                'version': api.__version__,
            },
            'specs': 'https://api.biosimulators.org/simulators/{}/{}'.format(id, api.get_simulator_version())
        })
