# from biosimulators_utils.log.data_model import CombineArchiveLog
# from biosimulators_utils.report.data_model import SedDocumentResults
from biosimulators_simularium.converters.data_model import SmoldynDataConverter
from biosimulators_simularium.archives.data_model import SmoldynCombineArchive
from combine_api.exceptions import RequestTimeoutException
import functools
import importlib
import multiprocessing
import os
import sys
import time
import types  # noqa: F401
import werkzeug.wrappers.response  # noqa: F401
import yaml


__all__ = [
    'get_simulators',
    'get_simulator_specs',
    'get_simulator_api',
    'get_simulator_metadata',
    'use_simulator_api_to_exec_sedml_docs_in_combine_archive',
    'exec_in_subprocess',
]


@functools.lru_cache(maxsize=None)
def get_simulators():
    """ Get the ids and APIs of the available simulation tools

    Returns:
        :obj:`list` of :obj:`dict`: list of the id and name of the module which implements the API for
            each available simulation tool
    """
    with open(os.path.join(os.path.dirname(__file__), 'simulators.yml'), 'r') as file:
        return yaml.load(file, Loader=yaml.Loader)


def get_simulator_specs():
    """ Get the specifications of the available simulation tools

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response which contains a list of
            elements encoded in schema ``Simulator``
    """
    simulators = []

    for sim in get_simulators():
        simulators.append(exec_in_subprocess(get_simulator_metadata, sim['id']))

    return simulators


def get_simulator_specs_cache_filename():
    """ Get the path to cache the specifications of simulation tools

    Returns:
        :obj:`str`: path to cache the specifications of simulation tools
    """
    return os.path.expanduser(os.path.join('~', '.cache', 'simulators.yml'))


def write_simulator_specs_cache(simulators=None, filename=None):
    """ Get the specifications of simulations tools and cache them to a file

    Args:
        simulators (:obj:`werkzeug.wrappers.response.Response`, optional): response which contains a list of
            elements encoded in schema ``Simulator``
        filename (:obj:`str`, optional): path to cache the specifications of simulation tools
    """
    simulators = simulators or get_simulator_specs()

    filename = filename or get_simulator_specs_cache_filename()

    dirname = os.path.dirname(filename)
    if not os.path.dirname(dirname):
        os.makedirs(dirname)

    with open(filename, 'w') as file:
        file.write(yaml.dump(simulators))


def read_simulator_specs_cache(filename=None):
    """ Read the specifications of simulations tools from a file

    Args:
        filename (:obj:`str`, optional): path to read the specifications of simulation tools

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response which contains a list of
            elements encoded in schema ``Simulator``
    """
    filename = filename or get_simulator_specs_cache_filename()

    if not os.path.isfile(filename):
        write_simulator_specs_cache(filename=filename)

    with open(filename, 'r') as file:
        return yaml.load(file, Loader=yaml.Loader)


def is_spatial_simulator(api_module: types.ModuleType, spatial_simulator='smoldyn') -> bool:
    return spatial_simulator in vars(api_module)


def get_simulator_api(api, reload=False):
    """ Get the BioSimulators API for a simulator

    Args:
        api (:obj:`str`): module which implements the API for the simulator
        reload (:obj:`bool`, optional): whether to reload the API

    Returns:
        :obj:`types.ModuleType`
    """
    module = importlib.import_module(api)
    if reload:
        importlib.reload(module)
    return module


def get_simulator_metadata(id):
    """ Get metadata about a simulator

    Args:
        id (:obj:`str`): BioSimulators id of the simulator

    Returns:
        :obj:`dict`: metadata about the simulator
    """
    simulator = next(simulator for simulator in get_simulators() if simulator['id'] == id)

    id = simulator['id']
    name = simulator['name']
    api_module = simulator['api']['module']
    api = get_simulator_api(api_module)
    version = api.get_simulator_version()
    api_version = api.__version__
    return {
        '_type': 'Simulator',
        'id': id,
        'name': name,
        'version': version,
        'api': {
            '_type': 'SimulatorApi',
            'module': api_module,
            'package': simulator['api']['package'],
            'version': api_version,
        },
        'specs': 'https://api.biosimulators.org/simulators/{}/{}'.format(id, version),
    }


def use_simulator_api_to_exec_sedml_docs_in_combine_archive(api_name, *args, **kwargs):
    """ Execute the SED-ML tasks defined in a COMBINE/OMEX archive and save the outputs

    Args:
        api (:obj:`str`): module which implements the API for the simulator
        *args (:obj:`list`): positional arguments to ``exec_sedml_docs_in_combine_archive``
        **kwargs (:obj:`dict`): keyword arguments to ``exec_sedml_docs_in_combine_archive``

    Returns:
        : obj: `tuple`:

            *: obj:`SedDocumentResults`: results
            *: obj:`dict` in the ``SimulationRunResults`` schema: log
    """
    api = get_simulator_api(api_name)
    if verify_spatial_simulator(api):
        archive = SmoldynCombineArchive(rootpath=args[0])
        converter = SmoldynDataConverter(archive)
        converter.generate_simularium_file()
        results, log = api.combine.exec_sedml_docs_in_combine_archive(*args, **kwargs)
    else:
        results, log = api.exec_sedml_docs_in_combine_archive(*args, **kwargs)
    if log:
        log = log.to_json()
    return results, log


class Process(multiprocessing.context.ForkProcess):
    """ Fork process which collects the exceptions of its child

    Attributes:
        _parent_conn (:obj:`multiprocessing.connection.Connection`): connection for the parent
        _child_conn (:obj:`multiprocessing.connection.Connection`): connection for the child
        _exception (:obj:`Exception` or :obj:`None`): exception, if any, from the process' child

    Inspired by https: // stackoverflow.com/questions/19924104/
    """

    def __init__(self, *args, **kwargs):
        super(multiprocessing.context.ForkProcess, self).__init__(*args, **kwargs)
        self._parent_conn, self._child_conn = multiprocessing.Pipe()
        self._exception = None

    def run(self):
        """ Run the process """
        try:
            super(multiprocessing.context.ForkProcess, self).run()
            self._child_conn.send(False)
        except Exception as exception:
            self._child_conn.send(exception.with_traceback(sys.exc_info()[2]))

    @property
    def exception(self):
        """ Get the exception from process' child, if any

        Returns:
            :obj:`Exception` or :obj:`None`: exception, if any, from the process' child
        """
        if self._parent_conn.poll():
            self._exception = self._parent_conn.recv()
        return self._exception


def exec_in_subprocess(func, *args, poll_interval=0.01, timeout=None, **kwargs):
    """ Execute a function in a fork

    Args:
        func (:obj:`types.FunctionType`): function
        * args (:obj:`list`): list of positional arguments for the function
        poll_interval (:obj:`float`, optional): interval to poll the status of the subprocess
        timeout (:obj:`float`, optional): maximum execution time in seconds
        **kwargs (:obj:`dict`, optional): dictionary of keyword arguments for the function

    Returns:
        :obj:`object`: result of the function
    """
    context_instance = multiprocessing.get_context('fork')
    queue = context_instance.Queue()
    process = Process(target=subprocess_target, args=[queue, func] + list(args), kwargs=kwargs)
    process.start()
    start_time = time.time()
    while process.exception is None:
        time.sleep(poll_interval)
        if timeout is not None and (time.time() - start_time) > timeout:
            msg = 'Execution did not complete in {} s. Requests are limited to {} s'.format(timeout, timeout)
            raise RequestTimeoutException(
                title='Request timed out',
                instance=TimeoutError(msg),
            )
    if process.exception:
        raise process.exception
    results = queue.get()
    return results


def subprocess_target(queue, func, *args, **kwargs):
    """ Target executer for a subprocess

    Args:
        queue (:obj:`multiprocessing.queues.Queue`): queue to send the results of the function to
        func (:obj:`types.FunctionType`): function to execute
        args (:obj:`list`): list of positional arguments for the function
        kwargs (:obj:`dict`): dictionary of keyword arguments for the function
    """
    result = func(*args, **kwargs)
    queue.put(result)
