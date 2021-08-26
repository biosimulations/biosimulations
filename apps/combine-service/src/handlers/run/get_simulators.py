from . import utils
import functools
import werkzeug.wrappers.response  # noqa: F401


@functools.lru_cache(maxsize=None)
def handler():
    ''' Get a list of available simulation tools and their versions.

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response which contains a list of
            elements encoded in schema ``#/components/schemas/Simulator``
    '''
    simulators = []

    for sim in utils.get_simulators():
        simulators.append(utils.exec_in_subprocess(utils.get_simulator_metadata, sim['id']))

    return simulators
