from src.handlers.run import utils
import unittest


class CombineUtilsTestCase(unittest.TestCase):
    def test_get_simulators(self):
        simulators = utils.get_simulators()
        sim = next(simulator for simulator in simulators if simulator['id'] == 'tellurium')
        self.assertEqual(sim, {
            'id': 'tellurium',
            'api': {
                'module': 'biosimulators_tellurium',
                'package': 'biosimulators_tellurium',
            }
        })

    def test_get_simulator_api(self):
        import biosimulators_tellurium
        api = utils.get_simulator_api('biosimulators_tellurium')
        self.assertEqual(api, biosimulators_tellurium)
