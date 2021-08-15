import functools
import importlib
import os
import types  # noqa: F401
import yaml


__all__ = ['get_simulators', 'get_simulator_api']


@functools.lru_cache(maxsize=None)
def get_simulators():
    """ Get the ids and APIs of the available simulation tools

    Returns:
        :obj:`list` of :obj:`dict`: list of the id and name of the module which implements the API for
            each available simulation tool
    """
    with open(os.path.join(os.path.dirname(__file__), 'simulators.yml'), 'r') as file:
        return yaml.load(file, Loader=yaml.Loader)


def get_simulator_api(api):
    """ Get the BioSimulators API for a simulator

    Args:
        api (:obj:`str`): module which implements the API for the simulator

    Returns:
        :obj:`types.ModuleType`
    """
    return importlib.import_module(api)


@functools.lru_cache(maxsize=None)
def get_simulator_metadata(id):
    """ Get metadata about a simulator

    Args:
        id (:obj:`str`): BioSimulators id of the simulator

    Returns:
        :obj:`dict`: metadata about the simulator
    """
    simulator = next(simulator for simulator in get_simulators() if simulator['id'] == id)

    id = simulator['id']
    api_module = simulator['api']['module']
    api = get_simulator_api(api_module)
    version = api.get_simulator_version()
    api_version = api.__version__
    return {
        '_type': 'Simulator',
        'id': id,
        'version': version,
        'api': {
            '_type': 'SimulatorApi',
            'module': api_module,
            'package': simulator['api']['package'],
            'version': api_version,
        },
        'specs': 'https://api.biosimulators.org/simulators/{}/{}'.format(id, version),
    }
