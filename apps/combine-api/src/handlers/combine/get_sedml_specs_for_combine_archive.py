from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.combine.utils import get_sedml_contents
from biosimulators_utils.sedml.data_model import (
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
    Task,
    RepeatedTask,
    Report,
    Plot2D,
    Plot3D,
    AxisScale,
)
from biosimulators_utils.sedml.io import (
    SedmlSimulationReader,
)
import os
import requests
import requests.exceptions
import traceback


def handler(body, file=None):
    ''' Get the specifications of the SED-ML files in a COMBINE/OMEX arvhive

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value has schema ``Url`` with the
              URL for a COMBINE/OMEX archive

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file

    Returns:
        ``CombineArchive``: specifications of the SED-ML
            files in the COMBINE/OMEX archive
    '''
    archive_file = file
    archive_url = body.get('url', None)
    if archive_url and archive_file:
        raise BadRequestException(
            title='Only one of `file` or `url` can be used at a time.',
            instance=ValueError(),
        )
    if not archive_url and not archive_file:
        raise BadRequestException(
            title='One of `file` or `url` must be used.',
            instance=ValueError(),
        )

    # create temporary working directory
    temp_dirname = get_temp_dir()
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # get COMBINE/OMEX archive
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

    # read archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    try:
        archive = CombineArchiveReader().run(archive_filename, archive_dirname)
    except Exception as exception:
        # return exception
        raise BadRequestException(
            title='`{}` is not a valid COMBINE/OMEX archive'.format(archive_url if archive_url else archive_file.filename),
            instance=exception,
        )

    # get specifications of SED outputs
    contents_specs = []

    sedml_contents = get_sedml_contents(archive)
    for content in sedml_contents:
        sed_doc_filename = os.path.join(archive_dirname,
                                        content.location)
        try:
            sed_doc = SedmlSimulationReader().run(sed_doc_filename,
                                                  validate_semantics=False,
                                                  validate_models_with_languages=False)
        except Exception:
            traceback.print_exc()
            continue

        sed_model_specs = []
        for model in sed_doc.models:
            sed_model_spec = {
                "_type": "SedModel",
                "id": model.id,
                "source": model.source,
                "language": model.language,
                "changes": [],
            }
            if model.name:
                sed_model_spec['name'] = model.name
            # TODO: add model changes
            sed_model_specs.append(sed_model_spec)

        sed_simulation_specs = []
        for sim in sed_doc.simulations:
            sed_sim_spec = {
                "id": sim.id,
                "algorithm": {
                    "_type": "SedAlgorithm",
                    "kisaoId": sim.algorithm.kisao_id,
                    "changes": [
                    ],
                },
            }

            if isinstance(sim, OneStepSimulation):
                sed_sim_spec['_type'] = 'SedOneStepSimulation'
                sed_sim_spec['step'] = sim.step

            elif isinstance(sim, SteadyStateSimulation):
                sed_sim_spec['_type'] = 'SedSteadyStateSimulation'

            elif isinstance(sim, UniformTimeCourseSimulation):
                sed_sim_spec['_type'] = 'SedUniformTimeCourseSimulation'
                sed_sim_spec['initialTime'] = sim.initial_time
                sed_sim_spec['outputStartTime'] = sim.output_start_time
                sed_sim_spec['outputEndTime'] = sim.output_end_time
                sed_sim_spec['numberOfSteps'] = sim.number_of_steps

            if sim.name:
                sed_sim_spec['name'] = sim.name

            for change in sim.algorithm.changes:
                sed_sim_spec['algorithm']['changes'].append({
                    "_type": "SedAlgorithmParameterChange",
                    "kisaoId": change.kisao_id,
                    "newValue": change.new_value,
                })

            sed_simulation_specs.append(sed_sim_spec)

        sed_task_specs = []
        for task in sed_doc.tasks:
            sed_task_spec = {
                "id": task.id,
            }

            if isinstance(task, Task):
                sed_task_spec['_type'] = 'SedTask'
                sed_task_spec['model'] = task.model.id
                sed_task_spec['simulation'] = task.simulation.id

            elif isinstance(task, RepeatedTask):
                sed_task_spec['_type'] = 'SedRepeatedTask'

            if task.name:
                sed_task_spec['name'] = task.name

            sed_task_specs.append(sed_task_spec)

        sed_data_generator_specs = []
        for data_generator in sed_doc.data_generators:
            sed_data_generator_spec = {
                '_type': 'SedDataGenerator',
                'id': data_generator.id,
                'parameters': [],
                'variables': [],
                'math': data_generator.math,
            }

            if data_generator.name:
                sed_data_generator_spec['name'] = data_generator.name

            for parameter in data_generator.parameters:
                parameter_spec = {
                    '_type': 'SedParameter',
                    'id': parameter.id,
                    'value': parameter.value,
                }
                if parameter.name:
                    parameter_spec['name'] = parameter.name
                sed_data_generator_specs['parameters'].append(parameter_spec)

            for variable in data_generator.variables:
                variable_spec = {
                    '_type': 'SedVariable',
                    'id': variable.id,
                }
                if variable.name:
                    variable_spec['name'] = variable.name
                if variable.target:
                    variable_spec['target'] = {
                        "_type": 'SedTarget',
                        "value": variable.target,
                        "namespaces": [
                            {
                                '_type': 'Namespace',
                                'prefix': prefix,
                                'uri': uri,
                            }
                            if prefix else
                            {
                                '_type': 'Namespace',
                                'uri': uri,
                            }
                            for prefix, uri in variable.target_namespaces.items()

                        ]
                    }
                if variable.symbol:
                    variable_spec['symbol'] = variable.symbol
                if variable.task:
                    variable_spec['task'] = variable.task.id
                if variable.model:
                    variable_spec['model'] = variable.model.id
                sed_data_generator_spec['variables'].append(variable_spec)

            sed_data_generator_specs.append(sed_data_generator_spec)

        sed_doc_outputs_specs = []
        for output in sed_doc.outputs:
            if isinstance(output, Report):
                sed_doc_output_specs = {
                    '_type': 'SedReport',
                    'id': output.id,
                    'dataSets': [],
                }

                if output.name:
                    sed_doc_output_specs['name'] = output.name

                for data_set in output.data_sets:
                    data_set_specs = {
                        '_type': 'SedDataSet',
                        'id': data_set.id,
                        'dataGenerator': data_set.data_generator.id,
                    }

                    if data_set.name:
                        data_set_specs['name'] = data_set.name
                    if data_set.label:
                        data_set_specs['label'] = data_set.label

                    sed_doc_output_specs['dataSets'].append(data_set_specs)

            elif isinstance(output, Plot2D):
                sed_doc_output_specs = {
                    '_type': 'SedPlot2D',
                    'id': output.id,
                    'curves': [],
                    'xScale': None,
                    'yScale': None,
                }

                if output.name:
                    sed_doc_output_specs['name'] = output.name

                if output.curves:
                    x_scale = output.curves[0].x_scale
                    y_scale = output.curves[0].y_scale
                else:
                    x_scale = None
                    y_scale = None

                for curve in output.curves:
                    curve_specs = {
                        '_type': 'SedCurve',
                        'id': curve.id,
                        'xDataGenerator': curve.x_data_generator.id,
                        'yDataGenerator': curve.y_data_generator.id,
                    }

                    if curve.name:
                        curve_specs['name'] = curve.name

                    sed_doc_output_specs['curves'].append(curve_specs)

                    if curve.x_scale != x_scale:
                        x_scale = None
                    if curve.y_scale != y_scale:
                        y_scale = None

                sed_doc_output_specs['xScale'] = (
                    x_scale or AxisScale.linear).value
                sed_doc_output_specs['yScale'] = (
                    y_scale or AxisScale.linear).value

            elif isinstance(output, Plot3D):
                sed_doc_output_specs = {
                    '_type': 'SedPlot3D',
                    'id': output.id,
                    'surfaces': [],
                    'xScale': None,
                    'yScale': None,
                    'zScale': None,
                }

                if output.name:
                    sed_doc_output_specs['name'] = output.name

                if output.surfaces:
                    x_scale = output.surfaces[0].x_scale
                    y_scale = output.surfaces[0].y_scale
                    z_scale = output.surfaces[0].z_scale
                else:
                    x_scale = None
                    y_scale = None
                    z_scale = None

                for surface in output.surfaces:
                    surface_specs = {
                        '_type': 'SedSurface',
                        'id': surface.id,
                        'xDataGenerator': surface.x_data_generator.id,
                        'yDataGenerator': surface.y_data_generator.id,
                        'zDataGenerator': surface.z_data_generator.id,
                    }

                    if surface.name:
                        surface_specs['name'] = surface.name

                    sed_doc_output_specs['surfaces'].append(surface_specs)

                    if surface.x_scale != x_scale:
                        x_scale = None
                    if surface.y_scale != y_scale:
                        y_scale = None
                    if surface.z_scale != z_scale:
                        z_scale = None

                sed_doc_output_specs['xScale'] = (
                    x_scale or AxisScale.linear).value
                sed_doc_output_specs['yScale'] = (
                    y_scale or AxisScale.linear).value
                sed_doc_output_specs['zScale'] = (
                    z_scale or AxisScale.linear).value

            else:
                continue

            sed_doc_outputs_specs.append(sed_doc_output_specs)

        sed_doc_specs = {
            '_type': 'SedDocument',
            'level': sed_doc.level,
            'version': sed_doc.version,
            'models': sed_model_specs,
            'simulations': sed_simulation_specs,
            'tasks': sed_task_specs,
            'dataGenerators': sed_data_generator_specs,
            'outputs': sed_doc_outputs_specs,
        }

        content_specs = {
            '_type': 'CombineArchiveSedDocSpecsContent',
            'location': {
                '_type': 'CombineArchiveSedDocSpecsLocation',
                'path': content.location,
                'value': sed_doc_specs,
            },
            'format': content.format,
            'master': content.master,
        }
        contents_specs.append(content_specs)

    # format response
    response = {
        '_type': 'CombineArchiveSedDocSpecs',
        'contents': contents_specs
    }

    # return reponse
    return response
