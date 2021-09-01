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

    def test_exec_in_subprocess_success(self):
        def func(a, b=None):
            return 2 * b + 1
        self.assertEqual(utils.exec_in_subprocess(func, 1, b=2), 5)

        def func(a, b=None):
            import time
            time.sleep(1.)
            return 2 * b + 1
        self.assertEqual(utils.exec_in_subprocess(func, 1, b=3), 7)

    def test_exec_in_subprocess_error_handling(self):
        def func(a, b=None):
            raise ValueError('here')
        with self.assertRaisesRegex(ValueError, 'here'):
            utils.exec_in_subprocess(func, 1, b=2)
