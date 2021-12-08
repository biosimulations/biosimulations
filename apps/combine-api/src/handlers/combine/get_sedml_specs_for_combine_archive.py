from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.combine.utils import get_sedml_contents
from biosimulators_utils.sedml.data_model import (  # noqa: F401
    Model,
    ModelChange,
    ModelAttributeChange,
    AddElementModelChange,
    ReplaceElementModelChange,
    RemoveElementModelChange,
    ComputeModelChange,
    Simulation,
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
    AbstractTask,
    Task,
    RepeatedTask,
    Output,
    Report,
    Plot2D,
    Plot3D,
    AxisScale,
    Parameter,
    DataGenerator,
    Variable,
    Range,
    FunctionalRange,
    UniformRange,
    VectorRange,
)
from biosimulators_utils.sedml.io import (
    SedmlSimulationReader,
)
import copy
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

        sed_doc_specs = get_sed_document_specs(sed_doc)

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


def get_sed_document_specs(sed_document):
    """ Get the OpenAPI specifications of a SED document

    Args:
        document (:obj:`SedDocument`): document

    Returns:
        :obj:`dict` with schema `SedDocument`
    """
    specs = {
        '_type': 'SedDocument',
        'level': sed_document.level,
        'version': sed_document.version,
        'models': list(map(get_model_specs, sed_document.models)),
        'simulations': list(map(get_simulation_specs, sed_document.simulations)),
        'tasks': list(map(get_task_specs, sed_document.tasks)),
        'dataGenerators': list(map(get_data_generator_specs, sed_document.data_generators)),
        'outputs': list(map(get_output_specs, sed_document.outputs)),
    }

    return specs


def get_model_specs(model):
    """ Get the OpenAPI specifications of a SED model

    Args:
        model (:obj:`Model`): model

    Returns:
        :obj:`dict` with schema `SedModel`
    """
    specs = {
        "_type": "SedModel",
        "id": model.id,
        "source": model.source,
        "language": model.language,
        "changes": list(map(get_model_change_specs, model.changes)),
    }
    if model.name:
        specs['name'] = model.name

    return specs


def get_model_change_specs(change):
    """ Get the OpenAPI specifications of a SED model change

    Args:
        change (:obj:`ModelChange`): model change

    Returns:
        :obj:`dict` with schema `SedSimulation`
    """
    specs = {
        '_type': 'Sed' + change.__class__.__name__,
        'id': change.id,
    }

    if change.name:
        specs['name'] = change.name

    specs['target'] = get_target_specs(change.target, change.target_namespaces)

    if isinstance(change, ModelAttributeChange):
        specs['newValue'] = change.new_value

    elif isinstance(change, AddElementModelChange):
        specs['newElements'] = change.new_elements

    elif isinstance(change, ReplaceElementModelChange):
        specs['newElements'] = change.new_elements

    elif isinstance(change, RemoveElementModelChange):
        pass

    elif isinstance(change, ComputeModelChange):
        specs['parameters'] = list(map(get_parameter_specs, change.parameters))
        specs['variables'] = list(map(get_variable_specs, change.variables))
        specs['math'] = change.math

    else:
        raise BadRequestException(
            title='Model changes of type `{}` are not supported.'.format(change.__class__.__name__),
            instance=NotImplementedError(),
        )

    return specs


def get_simulation_specs(simulation):
    """ Get the OpenAPI specifications of a SED simulation

    Args:
        simulation (:obj:`Simulation`): simulation

    Returns:
        :obj:`dict` with schema `SedSimulation`
    """
    specs = {
        "id": simulation.id,
        "algorithm": {
            "_type": "SedAlgorithm",
            "kisaoId": simulation.algorithm.kisao_id,
            "changes": [
            ],
        },
    }

    if isinstance(simulation, OneStepSimulation):
        specs['_type'] = 'SedOneStepSimulation'
        specs['step'] = simulation.step

    elif isinstance(simulation, SteadyStateSimulation):
        specs['_type'] = 'SedSteadyStateSimulation'

    elif isinstance(simulation, UniformTimeCourseSimulation):
        specs['_type'] = 'SedUniformTimeCourseSimulation'
        specs['initialTime'] = simulation.initial_time
        specs['outputStartTime'] = simulation.output_start_time
        specs['outputEndTime'] = simulation.output_end_time
        specs['numberOfSteps'] = simulation.number_of_steps

    else:
        raise BadRequestException(
            title='Simulations of type `{}` are not supported.'.format(simulation.__class__.__name__),
            instance=NotImplementedError(),
        )

    if simulation.name:
        specs['name'] = simulation.name

    for change in simulation.algorithm.changes:
        specs['algorithm']['changes'].append({
            "_type": "SedAlgorithmParameterChange",
            "kisaoId": change.kisao_id,
            "newValue": change.new_value,
        })

    return specs


def get_task_specs(task):
    """ Get the OpenAPI specifications of a SED task

    Args:
        task (:obj:`AbstractTask`): task

    Returns:
        :obj:`dict` with schema `SedAbstractTask`
    """
    specs = {
        "id": task.id,
    }

    if isinstance(task, Task):
        specs['_type'] = 'SedTask'
        specs['model'] = task.model.id
        specs['simulation'] = task.simulation.id

    elif isinstance(task, RepeatedTask):
        specs['_type'] = 'SedRepeatedTask'

        specs['range'] = task.range.id

        specs['ranges'] = list(map(get_range_specs, task.ranges))

        specs['resetModelForEachIteration'] = task.reset_model_for_each_iteration

        specs['changes'] = []
        for change in task.changes:
            change_spec = {
                '_type': 'Sed' + change.__class__.__name__,
                'id': change.id,
                'model': change.model.id,
                'target': get_target_specs(change.target, change.target_namespaces),
                'range': change.range.id,
                'parameters': list(map(get_parameter_specs, change.parameters)),
                'variables': list(map(get_variable_specs, change.variables)),
                'math': change.math,
            }
            if change.name:
                change_spec['name'] = change.name
            if change.symbol:
                change_spec['symbol'] = change.symbol
            specs['changes'].append(change_spec)

        specs['subTasks'] = []
        for sub_task in task.sub_tasks:
            specs['subTasks'].append({
                '_type': 'SedSubTask',
                'task': sub_task.task.id,
                'order': sub_task.order,
            })

    else:
        raise BadRequestException(
            title='Tasks of type `{}` are not supported.'.format(task.__class__.__name__),
            instance=NotImplementedError(),
        )

    if task.name:
        specs['name'] = task.name

    return specs


def get_range_specs(range):
    """ Get the OpenAPI specifications of a SED range

    Args:
        range (:obj:`Range`): range

    Returns:
        :obj:`dict` with schema `SedRange`
    """
    specs = {
        '_type': 'Sed' + range.__class__.__name__,
        'id': range.id,
    }
    if range.name:
        specs['name'] = range.name

    if isinstance(range, FunctionalRange):
        specs['range'] = range.range.id

        specs['parameters'] = list(map(get_parameter_specs, range.parameters))

        specs['variables'] = list(map(get_variable_specs, range.variables))

        specs['math'] = range.math

    elif isinstance(range, UniformRange):
        specs['start'] = range.start
        specs['end'] = range.end
        specs['numberOfSteps'] = range.number_of_steps
        specs['type'] = range.type.value

    elif isinstance(range, VectorRange):
        specs['values'] = copy.copy(range.values)

    else:
        raise BadRequestException(
            title='Ranges of type `{}` are not supported.'.format(range.__class__.__name__),
            instance=NotImplementedError(),
        )

    return specs


def get_data_generator_specs(data_generator):
    """ Get the OpenAPI specifications of a SED data generator

    Args:
        data_generator (:obj:`DataGenerator`): data generator

    Returns:
        :obj:`dict` with schema `SedDataGenerator`
    """
    specs = {
        '_type': 'SedDataGenerator',
        'id': data_generator.id,
        'parameters': list(map(get_parameter_specs, data_generator.parameters)),
        'variables': list(map(get_variable_specs, data_generator.variables)),
        'math': data_generator.math,
    }

    if data_generator.name:
        specs['name'] = data_generator.name

    return specs


def get_output_specs(output):
    """ Get the OpenAPI specifications of a SED output

    Args:
        output (:obj:`Output`): output

    Returns:
        :obj:`dict` with schema `SedOutput`
    """
    if isinstance(output, Report):
        specs = {
            '_type': 'SedReport',
            'id': output.id,
            'dataSets': list(map(get_data_set_specs, output.data_sets)),
        }

        if output.name:
            specs['name'] = output.name

    elif isinstance(output, Plot2D):
        specs = {
            '_type': 'SedPlot2D',
            'id': output.id,
            'curves': list(map(get_curve_specs, output.curves)),
            'xScale': None,
            'yScale': None,
        }

        if output.name:
            specs['name'] = output.name

        if output.curves:
            x_scale = output.curves[0].x_scale
            y_scale = output.curves[0].y_scale
        else:
            x_scale = None
            y_scale = None

        for curve in output.curves:
            if curve.x_scale != x_scale:
                x_scale = None
            if curve.y_scale != y_scale:
                y_scale = None

        specs['xScale'] = (
            x_scale or AxisScale.linear).value
        specs['yScale'] = (
            y_scale or AxisScale.linear).value

    elif isinstance(output, Plot3D):
        specs = {
            '_type': 'SedPlot3D',
            'id': output.id,
            'surfaces': list(map(get_surface_specs, output.surfaces)),
            'xScale': None,
            'yScale': None,
            'zScale': None,
        }

        if output.name:
            specs['name'] = output.name

        if output.surfaces:
            x_scale = output.surfaces[0].x_scale
            y_scale = output.surfaces[0].y_scale
            z_scale = output.surfaces[0].z_scale
        else:
            x_scale = None
            y_scale = None
            z_scale = None

        for surface in output.surfaces:
            if surface.x_scale != x_scale:
                x_scale = None
            if surface.y_scale != y_scale:
                y_scale = None
            if surface.z_scale != z_scale:
                z_scale = None

        specs['xScale'] = (
            x_scale or AxisScale.linear).value
        specs['yScale'] = (
            y_scale or AxisScale.linear).value
        specs['zScale'] = (
            z_scale or AxisScale.linear).value

    else:
        raise BadRequestException(
            title='Outputs of type `{}` are not supported.'.format(output.__class__.__name__),
            instance=NotImplementedError(),
        )

    return specs


def get_data_set_specs(data_set):
    """ Get the OpenAPI specifications of a SED data set

    Args:
        data_set (:obj:`DataSet`): data set

    Returns:
        :obj:`dict` with schema `SedDataSet`
    """
    specs = {
        '_type': 'SedDataSet',
        'id': data_set.id,
        'dataGenerator': data_set.data_generator.id,
    }

    if data_set.name:
        specs['name'] = data_set.name
    if data_set.label:
        specs['label'] = data_set.label

    return specs


def get_curve_specs(curve):
    """ Get the OpenAPI specifications of a SED curve

    Args:
        curve (:obj:`Curve`): curve

    Returns:
        :obj:`dict` with schema `SedCurve`
    """
    specs = {
        '_type': 'SedCurve',
        'id': curve.id,
        'xDataGenerator': curve.x_data_generator.id,
        'yDataGenerator': curve.y_data_generator.id,
    }

    if curve.name:
        specs['name'] = curve.name

    return specs


def get_surface_specs(surface):
    """ Get the OpenAPI specifications of a SED surface

    Args:
        surface (:obj:`Surface`): surface

    Returns:
        :obj:`dict` with schema `SedSurface`
    """
    specs = {
        '_type': 'SedSurface',
        'id': surface.id,
        'xDataGenerator': surface.x_data_generator.id,
        'yDataGenerator': surface.y_data_generator.id,
        'zDataGenerator': surface.z_data_generator.id,
    }

    if surface.name:
        specs['name'] = surface.name

    return specs


def get_parameter_specs(parameter):
    """ Get the OpenAPI specifications of a SED parameter

    Args:
        parameter (:obj:`Parameter`): parameter

    Returns:
        :obj:`dict` with schema `SedParameter`
    """
    specs = {
        '_type': 'SedParameter',
        'id': parameter.id,
        'value': parameter.value,
    }
    if parameter.name:
        specs['name'] = parameter.name
    return specs


def get_variable_specs(variable):
    """ Get the OpenAPI specifications of a SED variable

    Args:
        variable (:obj:`Variable`): variable

    Returns:
        :obj:`dict` with schema `SedVariable`
    """
    specs = {
        '_type': 'SedVariable',
        'id': variable.id,
    }
    if variable.name:
        specs['name'] = variable.name
    if variable.target:
        specs['target'] = get_target_specs(variable.target, variable.target_namespaces)
    if variable.symbol:
        specs['symbol'] = variable.symbol
    if variable.task:
        specs['task'] = variable.task.id
    if variable.model:
        specs['model'] = variable.model.id

    return specs


def get_target_specs(target, namespaces):
    """ Get the OpenAPI specifications of a SED target

    Args:
        target (:obj:`string`): target
        namespaces (:obj:`dict`): dictionary that maps prefixes of namespaces to their URIs

    Returns:
        :obj:`dict` with schema `SedTarget`
    """
    return {
        "_type": 'SedTarget',
        "value": target,
        "namespaces": [get_namespace_specs(uri, prefix) for prefix, uri in namespaces.items()],
    }


def get_namespace_specs(uri, prefix=None):
    """ Get the OpenAPI specifications of a namespace

    Args:
        uri (:obj:`string`): URI
        prefix (:obj:`string`. optional): prefix

    Returns:
        :obj:`dict` with schema `Namespace`
    """
    if prefix:
        return {
            '_type': 'Namespace',
            'prefix': prefix,
            'uri': uri,
        }
    else:
        return {
            '_type': 'Namespace',
            'uri': uri,
        }
