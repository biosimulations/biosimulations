from src.handlers.run import utils
import unittest


class CombineUtilsTestCase(unittest.TestCase):
    def test_get_simulators(self):
        simulators = utils.get_simulators()
        sim = next(simulator for simulator in simulators if simulator['id'] == 'copasi')
        self.assertEqual(sim, {
            'id': 'copasi',
            'name': 'COPASI',
            'api': {
                'module': 'biosimulators_copasi',
                'package': 'biosimulators_copasi',
            },
            'exampleCombineArchive': sim['exampleCombineArchive'],
        })

    def test_get_simulator_api(self):
        utils.exec_in_subprocess(self._test_get_simulator_api)

    @staticmethod
    def _test_get_simulator_api():
        import biosimulators_copasi
        api = utils.get_simulator_api('biosimulators_copasi')
        assert api is biosimulators_copasi
