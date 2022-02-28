from . import utils
from dotenv import dotenv_values
import functools
import werkzeug.wrappers.response  # noqa: F401

config = {
    **dotenv_values("secret/secret.env"),
    **dotenv_values("config/config.env"),
    **dotenv_values("shared/shared.env"),
}

TIMEOUT = float(config.get('COMBINE_API_GET_SIMULATORS_TIMEOUT', 120.))


@functools.lru_cache(maxsize=None)
def handler():
    ''' Get a list of available simulation tools and their versions.

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response which contains a list of
            elements encoded in schema ``Simulator``
    '''
    simulators = []

    for sim in utils.get_simulators():
        simulators.append(utils.exec_in_subprocess(utils.get_simulator_metadata, sim['id'], timeout=TIMEOUT))

    return simulators
