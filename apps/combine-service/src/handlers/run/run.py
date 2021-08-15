from ...exceptions import BadRequestException
from ...utils import get_temp_file, get_temp_dir
from .utils import get_simulators, get_simulator_api
from biosimulators_utils.sedml.data_model import Report, Plot2D, Plot3D
from biosimulators_utils.sedml.exec import get_report_for_plot2d, get_report_for_plot3d
from biosimulators_utils.sedml.io import SedmlSimulationReader
from unittest import mock
import os.path
import requests
import requests.exceptions
import werkzeug.wrappers.response  # noqa: F401
import zipfile


def handler(body, archiveFile=None):
    """ Execute the SED-ML files in a COMBINE/OMEX archive.

    Args:
        body (:obj:`dict`): dictionary with schema ``#/components/schemas/SimulationRun`` with the
            specifications of the COMBINE/OMEX archive to execute and the simulator to execute it with
        archiveFile (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX file

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response with the results and log of the run in the
            ``#/components/schemas/SimulationRunResults`` schema
    """
    archive_file = archiveFile
    archive_url = body.get('archiveUrl', None)
    simulator_id = body['simulator']
    env_vars = body.get('environment', {}).get('variables', [])

    # get the COMBINE/OMEX archive
    if archive_file and archive_url:
        raise BadRequestException(
            title='Only one of `archiveFile` or `archiveUrl` can be used at a time.',
            instance=ValueError(),
        )

    # get COMBINE/OMEX archive
    archive_filename = get_temp_file(suffix='.omex')

    if archive_file:
        archive_file.save(archive_filename)

    else:
        try:
            response = requests.get(archive_url)
            response.raise_for_status()
        except requests.exceptions.RequestException as exception:
            title = 'COMBINE/OMEX archive could not be loaded from `{}`'.format(
                archive_url)
            raise BadRequestException(
                title=title,
                instance=exception,
            )

        # save archive to local temporary file
        with open(archive_filename, 'wb') as file:
            file.write(response.content)

    # get the simulator
    simulator = next((simulator for simulator in get_simulators() if simulator['id'] == simulator_id), None)
    if simulator is None:
        raise BadRequestException(
            title='`{}` is not a BioSimulators id of a simulation tool that is available for execution.'.format(simulator_id),
            instance=ValueError(),
        )

    simulator_api = get_simulator_api(simulator['api']['module'])

    # set up environment
    env = {}
    for env_var in env_vars:
        env[env_var['key']] = env_var['value']

    # execute the simulation
    out_dir = get_temp_dir()
    with mock.patch.dict('os.environ', env):
        results, log = simulator_api.exec_sedml_docs_in_combine_archive(
            archive_filename, out_dir,
            return_results=True, report_formats=[], plot_formats=[],
            raise_exceptions=False,
        )

    # transform the results
    archive_dirname = get_temp_dir()
    with zipfile.ZipFile(archive_filename, 'r') as zip_file:
        zip_file.extractall(archive_dirname)

    outputs = []
    for sed_doc_location, sed_doc_outputs_results in (results or {}).items():
        sed_doc = SedmlSimulationReader().run(os.path.join(archive_dirname, sed_doc_location))

        for output in sed_doc.outputs:
            if output.id not in sed_doc_outputs_results:
                continue
            output_results = sed_doc_outputs_results.get(output.id, None)

            if isinstance(output, Report):
                type = 'SedReport'
                report = output
            elif isinstance(output, Plot2D):
                type = 'SedPlot2D'
                report = get_report_for_plot2d(output)
            elif isinstance(output, Plot3D):
                type = 'SedPlot3D'
                report = get_report_for_plot3d(output)
            else:  # pragma: no cover #
                raise NotImplementedError('Outputs of type `{}` are not supported.'.format(output.__class__.__name__))

            data = []
            for data_set in report.data_sets:
                if data_set.id not in output_results:
                    continue
                data_set_results = output_results[data_set.id]

                data.append({
                    '_type': 'SimulationRunOutputDatum',
                    'id': data_set.id,
                    'label': data_set.label,
                    'name': data_set.name,
                    'shape': '' if data_set_results is None else ','.join(str(dim_len) for dim_len in data_set_results.shape),
                    'type': '__None__' if data_set_results is None else data_set_results.dtype.name,
                    'values': None if data_set_results is None else data_set_results.tolist(),
                })

            outputs.append({
                '_type': 'SimulationRunOutput',
                'outputId': sed_doc_location + '/' + output.id,
                'name': output.name,
                'type': type,
                'data': data,
            })

    # return
    return {
        '_type': 'SimulationRunResults',
        'outputs': outputs,
        'log': log.to_json(),
    }
