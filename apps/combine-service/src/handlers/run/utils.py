from biosimulators_utils.log.data_model import CombineArchiveLog  # noqa: F401
from biosimulators_utils.report.data_model import SedDocumentResults  # noqa: F401
import functools
import importlib
import multiprocessing
import os
import sys
import types  # noqa: F401
import yaml


__all__ = [
    'get_simulators',
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


def use_simulator_api_to_exec_sedml_docs_in_combine_archive(api_name,
                                                            archive_filename, out_dir,
                                                            return_results=False,
                                                            report_formats=None,
                                                            plot_formats=None,
                                                            bundle_outputs=None,
                                                            keep_individual_outputs=None,
                                                            raise_exceptions=True,
                                                            **kwargs):
    """ Execute the SED tasks defined in a COMBINE/OMEX archive and save the outputs

    Args:
        api (:obj:`str`): module which implements the API for the simulator
        archive_filename (:obj:`str`): path to COMBINE/OMEX archive
        out_dir (:obj:`str`): path to store the outputs of the archive

            * CSV: directory in which to save outputs to files
              ``{ out_dir }/{ relative-path-to-SED-ML-file-within-archive }/{ report.id }.csv``
            * HDF5: directory in which to save a single HDF5 file (``{ out_dir }/reports.h5``),
              with reports at keys ``{ relative-path-to-SED-ML-file-within-archive }/{ report.id }`` within the HDF5 file

        return_results (:obj:`bool`, optional): whether to return the result of each output of each SED-ML file
        report_formats (:obj:`list` of :obj:`ReportFormat`, optional): report format (e.g., csv or h5)
        plot_formats (:obj:`list` of :obj:`VizFormat`, optional): report format (e.g., pdf)
        bundle_outputs (:obj:`bool`, optional): if :obj:`True`, bundle outputs into archives for reports and plots
        keep_individual_outputs (:obj:`bool`, optional): if :obj:`True`, keep individual output files
        raise_exceptions (:obj:`bool`, optional): whether to raise exceptions):

    Returns:
        : obj: `tuple`:

            *: obj: `SedDocumentResults`: results
            *: obj: `CombineArchiveLog`: log
    """
    api = get_simulator_api(api_name)
    results, log = api.exec_sedml_docs_in_combine_archive(archive_filename, out_dir,
                                                          return_results=return_results,
                                                          report_formats=report_formats,
                                                          plot_formats=plot_formats,
                                                          bundle_outputs=bundle_outputs,
                                                          keep_individual_outputs=keep_individual_outputs,
                                                          raise_exceptions=raise_exceptions,
                                                          **kwargs)
    return results, log.to_json()


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
            self._child_conn.send(None)
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


def exec_in_subprocess(func, *args, **kwargs):
    """ Execute a function in a fork

    Args:
        func (:obj:`types.FunctionType`): function
        args (:obj:`list`): list of positional arguments for the function
        kwargs (:obj:`dict`): dictionary of keyword arguments for the function

    Returns:
        :obj:`object`: result of the function
    """
    context_instance = multiprocessing.get_context('fork')
    queue = context_instance.Queue()
    process = Process(target=subprocess_target, args=[queue, func] + list(args), kwargs=kwargs)
    process.start()
    if process.exception:
        raise process.exception
    results = queue.get()
    process.join()
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
