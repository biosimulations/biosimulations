from biosimulators_utils.combine.data_model import (
    CombineArchive,
    CombineArchiveContent,
    CombineArchiveContentFormatPattern,
)
from biosimulators_utils.combine.io import (
    CombineArchiveReader,
    CombineArchiveWriter,
)
from biosimulators_utils.sedml.data_model import (  # noqa: F401
    SedDocument,
    Model,
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
    Algorithm,
    AlgorithmParameterChange,
    Task,
    ModelLanguagePattern,
    DataGenerator,
    Variable,
    Output,
    Report,
    Plot2D,
    Plot3D,
    DataSet,
    Curve,
    Surface,
    AxisScale,
)
from biosimulators_utils.sedml.io import (
    SedmlSimulationReader,
    SedmlSimulationWriter,
)
import connexion
import datetime
import dateutil.tz
import flask
import os
import re
import requests
import requests.exceptions
import shutil
import tempfile
import werkzeug  # noqa: F401
import werkzeug.wrappers.response  # noqa: F401


def get_sedml_output_specs_for_combine_archive(archiveUrl):
    ''' Get the specifications of the SED plots in a COMBINE/OMEX archive

    Args:
        archiveUrl (:obj:`str`): URL for COMBINE archive

    Returns:
        ``#/components/schemas/CombineArchive``: specifications of the SED
            plots in a COMBINE/OMEX archive
    '''

    # create temporary working directory
    temp_dirname = tempfile.mkdtemp()

    # get COMBINE/OMEX archive
    try:
        response = requests.get(archiveUrl)
        response.raise_for_status()
    except requests.exceptions.RequestException as exception:
        title = 'COMBINE/OMEX archive could not be loaded from `{}`'.format(
            archiveUrl)
        raise BadRequestException(
            title=title,
            instance=exception,
        )

    # save archive to local temporary file
    archive_filename = os.path.join(temp_dirname, 'archive.omex')
    with open(archive_filename, 'wb') as file:
        file.write(response.content)

    # read archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    try:
        archive = CombineArchiveReader.run(archive_filename, archive_dirname)
    except Exception as exception:
        # cleanup temporary files
        shutil.rmtree(temp_dirname)

        # return exception
        raise BadRequestException(
            title='`{}` is not a valid COMBINE/OMEX archive'.format(archiveUrl),
            instance=exception,
        )

    # get specifications of SED outputs
    contents_specs = []

    for content in archive.contents:
        if (
            content.format and
            re.match(CombineArchiveContentFormatPattern.SED_ML.value,
                     content.format)
        ):
            sed_doc_filename = os.path.join(archive_dirname,
                                            content.location)
            try:
                sed_doc = SedmlSimulationReader().run(sed_doc_filename,
                                                      validate_semantics=False)
            except Exception:
                continue

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
                            'dataGenerator': {
                                '_type': 'SedDataGenerator',
                                '_resultsDataSetId': _get_results_data_set_id(
                                    content, output, data_set),
                                'id': data_set.data_generator.id,
                                'variables': [],
                                'math': data_set.data_generator.math,
                            }
                        }

                        if data_set.name:
                            data_set_specs['name'] = data_set.name
                        if data_set.label:
                            data_set_specs['label'] = data_set.label
                        if data_set.data_generator.name:
                            data_set_specs['dataGenerator']['name'] = \
                                data_set.data_generator.name

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
                            'xDataGenerator': {
                                '_type': 'SedDataGenerator',
                                '_resultsDataSetId': _get_results_data_set_id(
                                    content, output, curve.x_data_generator),
                                'id': curve.x_data_generator.id,
                                'variables': [],
                                'math': curve.x_data_generator.math,
                            },
                            'yDataGenerator': {
                                '_type': 'SedDataGenerator',
                                '_resultsDataSetId': _get_results_data_set_id(
                                    content, output, curve.y_data_generator),
                                'id': curve.y_data_generator.id,
                                'variables': [],
                                'math': curve.y_data_generator.math,
                            },
                        }

                        if curve.name:
                            curve_specs['name'] = curve.name
                        if curve.x_data_generator.name:
                            curve_specs['xDataGenerator']['name'] = \
                                curve.x_data_generator.name
                        if curve.y_data_generator.name:
                            curve_specs['yDataGenerator']['name'] = \
                                curve.y_data_generator.name

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
                            'xDataGenerator': {
                                '_type': 'SedDataGenerator',
                                '_resultsDataSetId': _get_results_data_set_id(
                                    content, output, surface.x_data_generator),
                                'id': surface.x_data_generator.id,
                                'variables': [],
                                'math': surface.x_data_generator.math,
                            },
                            'yDataGenerator': {
                                '_type': 'SedDataGenerator',
                                '_resultsDataSetId': _get_results_data_set_id(
                                    content, output, surface.y_data_generator),
                                'id': surface.y_data_generator.id,
                                'variables': [],
                                'math': surface.y_data_generator.math,
                            },
                            'zDataGenerator': {
                                '_type': 'SedDataGenerator',
                                '_resultsDataSetId': _get_results_data_set_id(
                                    content, output, surface.z_data_generator),
                                'id': surface.z_data_generator.id,
                                'variables': [],
                                'math': surface.z_data_generator.math,
                            },
                        }

                        if surface.name:
                            surface_specs['name'] = surface.name
                        if surface.x_data_generator.name:
                            surface_specs['xDataGenerator']['name'] = \
                                surface.x_data_generator.name
                        if surface.y_data_generator.name:
                            surface_specs['yDataGenerator']['name'] = \
                                surface.y_data_generator.name
                        if surface.z_data_generator.name:
                            surface_specs['zDataGenerator']['name'] = \
                                surface.z_data_generator.name

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
                'models': [],
                'simulations': [],
                'tasks': [],
                'dataGenerators': [],
                'outputs': sed_doc_outputs_specs,
            }

            content_specs = {
                '_type': 'CombineArchiveContent',
                'location': {
                    '_type': 'CombineArchiveLocation',
                    'path': content.location,
                    'value': sed_doc_specs,
                },
                'format': content.format,
                'master': content.master,
            }
            contents_specs.append(content_specs)

    # cleanup temporary files
    shutil.rmtree(temp_dirname)

    # format response
    response = {
        '_type': 'CombineArchive',
        'contents': contents_specs
    }

    # return reponse
    return response


def get_variables_for_model(modelFormat, modelFile):
    """ Get the observable variables of a model as a list of
    data generators

    Args:
        modelFormat (:obj:`str`): SED URN for model format
        modelFile (:obj:`werkzeug.FileStorage`): model file (e.g., SBML file)

    Returns:
        :obj:`list` of ``#/components/schemas/SedVariable``
    """
    if re.match(ModelLanguagePattern.SBML.value, modelFormat):
        return []

    else:
        raise BadRequestException(
            title='Models of format `{}` are not supported'.format(
                modelFormat),
            instance=NotImplementedError('Invalid model')
        )  # pragma: no cover: unreachable due to schema validation


def create_combine_archive(form, files):
    ''' Create a COMBINE/OMEX archive for a model with a SED-ML document
    according to a particular specification.

    Args:
        form (:obj:`dict`): with ``#/components/schemas/CombineArchive``
            specifications of the desired SED document
        files (:obj:`list` of :obj:`werkzeug.FileStorage`): files (e.g., SBML
            file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response with COMBINE/OMEX
            archive
    '''
    archive_specs = form['specs']
    files = connexion.request.files.getlist('files')

    # create temporary working directory
    temp_dirname = tempfile.mkdtemp()

    # create temporary files for archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # initialize archive
    now = datetime.datetime.utcnow().replace(microsecond=0).astimezone(dateutil.tz.tzutc())
    archive = CombineArchive(
        created=now,
        updated=now,
    )

    # build map from model filenames to file objects
    filename_map = {
        file.filename: file
        for file in files
    }

    # add files to archive
    for content in archive_specs['contents']:
        if content['location']['value']['_type'] == 'SedDocument':
            sed_doc = _export_sed_doc(content['location']['value'])

            # save SED document to file
            SedmlSimulationWriter().run(
                sed_doc,
                os.path.join(archive_dirname, content['location']['path']))
        else:
            file = filename_map.get(
                content['location']['value']['filename'], None)
            if not file:
                raise BadRequestException(
                    title='File with name `{}` was not uploaded'.format(
                        content['location']['value']['filename']),
                    instance=ValueError(),
                )
            filename = os.path.join(archive_dirname,
                                    content['location']['path'])
            if not os.path.isdir(os.path.dirname(filename)):
                os.makedirs(os.path.dirname(filename))
            file.save(filename)

        content = CombineArchiveContent(
            location=content['location']['path'],
            format=content['format'],
            master=content['master'],
            created=now,
            updated=now,
        )

        archive.contents.append(content)

    # package COMBINE/OMEX archive
    CombineArchiveWriter.run(archive, archive_dirname, archive_filename)

    # save COMBINE/OMEX archive to S3 bucket
    # TODO
    archive_url = _save_file_to_s3_bucket(archive_filename)

    # cleanup temporary file
    shutil.rmtree(temp_dirname)

    # return URL for archive in S3 bucket
    return archive_url


def _get_results_data_set_id(content, output, data_element):
    ''' Get the runBioSimulations id for the results of a data set of a report
    or a data generator of a curve or surface of a plot.

    Args:
        content (:obj:`CombineArchiveContent`): content item of a COMBINE/OMEX
            archive
        output (:obj:`Output`): SED report or plot
        data_element (:obj:`DataSet` or :obj:`DataGenerator`): data set or
            generator

    Returns:
        :obj:`str`: id for the results of a data set of a report or a data
            generator of a curve or surface of a plot.
    '''
    sed_doc_id = os.path.relpath(content.location, '.')

    if isinstance(data_element, DataSet):
        # TODO: change last argument to `data_element.id`
        return '{}/{}/{}'.format(
            sed_doc_id,
            output.id,
            data_element.label or data_element.id
        )
    elif isinstance(data_element, DataGenerator):
        # TODO: change last argument to a unique id based on `data_element.id`
        return '{}/{}/{}'.format(
            sed_doc_id,
            output.id,
            data_element.name or data_element.id
        )


def _export_sed_doc(sed_doc_specs):
    """ Export the specifications of SED document to SED-ML

    Args:
        sed_doc_specs (``#/components/schemas/SedDocument``)

    Returns:
        :obj:`SedDocument`
    """
    sed_doc = SedDocument(
        level=sed_doc_specs['level'],
        version=sed_doc_specs['version'],
    )

    # add models to SED document
    model_id_map = {}
    for model_spec in sed_doc_specs['models']:
        model = Model(
            id=model_spec.get('id'),
            name=model_spec.get('name', None),
            language=model_spec.get('language'),
            source=model_spec.get('source'),
        )
        sed_doc.models.append(model)
        model_id_map[model.id] = model

    # add simulations to SED document
    simulation_id_map = {}
    for sim_spec in sed_doc_specs['simulations']:
        if sim_spec['_type'] == 'SedOneStepSimulation':
            sim = OneStepSimulation(
                id=sim_spec.get('id'),
                name=sim_spec.get('name', None),
                step=sim_spec.get('step'),
            )
        elif sim_spec['_type'] == 'SedSteadyStateSimulation':
            sim = SteadyStateSimulation(
                id=sim_spec.get('id'),
                name=sim_spec.get('name', None),
            )
        elif sim_spec['_type'] == 'SedUniformTimeCourseSimulation':
            sim = UniformTimeCourseSimulation(
                id=sim_spec.get('id'),
                name=sim_spec.get('name', None),
                initial_time=sim_spec.get('initialTime'),
                output_start_time=sim_spec.get('outputStartTime'),
                output_end_time=sim_spec.get('outputEndTime'),
                number_of_steps=sim_spec.get('numberOfSteps'),
            )
        else:
            raise BadRequestException(
                title='Simulations of type `{}` are not supported'.format(
                    sim_spec['_type']),
                instance=NotImplementedError('Invalid simulation')
            )  # pragma: no cover: unreachable due to schema validation

        alg_spec = sim_spec.get('algorithm')
        sim.algorithm = Algorithm(kisao_id=alg_spec.get('kisaoId'))
        for change_spec in alg_spec.get('changes'):
            sim.algorithm.changes.append(
                AlgorithmParameterChange(
                    kisao_id=change_spec.get('kisaoId'),
                    new_value=change_spec.get('newValue'),
                )
            )

        sed_doc.simulations.append(sim)
        simulation_id_map[sim.id] = sim

    # add tasks to SED document
    task_id_map = {}
    for task_spec in sed_doc_specs['tasks']:
        if task_spec['_type'] == 'SedTask':
            model_id = task_spec.get('model').get('id')
            sim_id = task_spec.get('simulation').get('id')
            model = model_id_map.get(model_id, None)
            sim = simulation_id_map.get(sim_id, None)

            if not model:
                raise BadRequestException(
                    title='Model `{}` for task `{}` does not exist'.format(
                        model_id, task_spec.get('id')),
                    instance=ValueError('Model does not exist'),
                )
            if not sim:
                raise BadRequestException(
                    title='Simulation `{}` for task `{}` does not exist'.format(
                        sim_id, task_spec.get('id')),
                    instance=ValueError('Simulation does not exist'),
                )

            task = Task(
                id=task_spec.get('id'),
                name=task_spec.get('name', None),
                model=model,
                simulation=sim,
            )
        else:
            raise BadRequestException(
                title='Tasks of type `{}` are not supported'.format(
                    task_spec['_type']),
                instance=NotImplementedError('Invalid task')
            )  # pragma: no cover: unreachable due to schema validation

        sed_doc.tasks.append(task)
        task_id_map[task.id] = task

    # add data generators to SED document
    data_gen_id_map = {}
    for data_gen_spec in sed_doc_specs['dataGenerators']:
        data_gen = DataGenerator(
            id=data_gen_spec.get('id'),
            name=data_gen_spec.get('name', None),
            math=data_gen_spec.get('math'),
        )

        for var_spec in data_gen_spec['variables']:
            task_id = var_spec.get('task').get('id')
            task = task_id_map.get(task_id, None)

            if not task:
                raise BadRequestException(
                    title='Task `{}` for variable `{}` does not exist'.format(
                        task_id, var_spec.get('id')),
                    instance=ValueError('Task does not exist'),
                )

            var = Variable(
                id=var_spec.get('id'),
                name=var_spec.get('name', None),
                task=task,
                symbol=var_spec.get('symbol', None),
                target=var_spec.get('target', None),
            )
            data_gen.variables.append(var)

        sed_doc.data_generators.append(data_gen)
        data_gen_id_map[data_gen.id] = data_gen

    # add outputs to SED document
    for output_spec in sed_doc_specs['outputs']:
        if output_spec['_type'] == 'SedReport':
            output = Report(
                id=output_spec.get('id'),
                name=output_spec.get('name', None),
            )
            for data_set_spec in output_spec['dataSets']:
                data_gen_id = data_set_spec['dataGenerator']['id']
                data_gen = data_gen_id_map.get(
                    data_gen_id, None)

                if not data_gen:
                    raise BadRequestException(
                        title='Data generator `{}` for output `{}` does not exist'.format(
                            data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )

                data_set = DataSet(
                    id=data_set_spec.get('id'),
                    name=data_set_spec.get('name', None),
                    label=data_set_spec.get('label', None),
                    data_generator=data_gen,
                )
                output.data_sets.append(data_set)

        elif output_spec['_type'] == 'SedPlot2D':
            output = Plot2D(
                id=output_spec.get('id'),
                name=output_spec.get('name', None),
            )
            for curve_spec in output_spec['curves']:
                x_data_gen_id = curve_spec['xDataGenerator']['id']
                y_data_gen_id = curve_spec['yDataGenerator']['id']
                x_data_gen = data_gen_id_map.get(x_data_gen_id, None)
                y_data_gen = data_gen_id_map.get(y_data_gen_id, None)

                if not x_data_gen:
                    raise BadRequestException(
                        title='X data generator `{}` for curve `{}` does not exist'.format(
                            x_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if not y_data_gen:
                    raise BadRequestException(
                        title='Y data generator `{}` for curve `{}` does not exist'.format(
                            y_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )

                curve = Curve(
                    id=curve_spec.get('id'),
                    name=curve_spec.get('name', None),
                    x_data_generator=x_data_gen,
                    y_data_generator=y_data_gen,
                    x_scale=AxisScale[output_spec['xScale']],
                    y_scale=AxisScale[output_spec['yScale']],
                )
                output.curves.append(curve)

        elif output_spec['_type'] == 'SedPlot3D':
            output = Plot3D(
                id=output_spec.get('id'),
                name=output_spec.get('name', None),
            )
            for surface_spec in output_spec['surfaces']:
                x_data_gen_id = surface_spec['xDataGenerator']['id']
                y_data_gen_id = surface_spec['yDataGenerator']['id']
                z_data_gen_id = surface_spec['zDataGenerator']['id']
                x_data_gen = data_gen_id_map.get(x_data_gen_id, None)
                y_data_gen = data_gen_id_map.get(y_data_gen_id, None)
                z_data_gen = data_gen_id_map.get(z_data_gen_id, None)

                if not x_data_gen:
                    raise BadRequestException(
                        title='X data generator `{}` for surface `{}` does not exist'.format(
                            x_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if not y_data_gen:
                    raise BadRequestException(
                        title='Y data generator `{}` for surface `{}` does not exist'.format(
                            y_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if not z_data_gen:
                    raise BadRequestException(
                        title='X data generator `{}` for surface `{}` does not exist'.format(
                            z_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )

                surface = Surface(
                    id=surface_spec.get('id'),
                    name=surface_spec.get('name', None),
                    x_data_generator=x_data_gen,
                    y_data_generator=y_data_gen,
                    z_data_generator=z_data_gen,
                    x_scale=AxisScale[output_spec['xScale']],
                    y_scale=AxisScale[output_spec['yScale']],
                    z_scale=AxisScale[output_spec['zScale']],
                )
                output.surfaces.append(surface)

        else:
            raise BadRequestException(
                title='Outputs of type `{}` are not supported'.format(
                    output_spec['_type']),
                instance=NotImplementedError('Invalid output')
            )  # pragma: no cover: unreachable due to schema validation

        sed_doc.outputs.append(output)

    return sed_doc


def _save_file_to_s3_bucket(filename):
    """ Save a file to the BioSimulations S3 bucket

    Args:
        filename (:obj:`str`): path of file to save to S3 bucket

    Returns:
        :obj:`str`: URL for saved file
    """
    return 'https://data.biosimulations.org/XYZ'


class BadRequestException(connexion.ProblemException, werkzeug.exceptions.BadRequest):
    ''' A bad request

    Attributes:
        title (:obj:`str`): title
        instance (:obj:`Exception`): exception
        status (:obj:`int`): status code
    '''

    def __init__(self, title, instance, status=400):
        """
        Args:
            title (:obj:`str`): title
            instance (:obj:`Exception`): exception
            status (:obj:`int`, optional): status code
        """
        super(BadRequestException, self).__init__(title=title, instance=instance, status=status)

    def get_response(self):
        """ Get repsonse

        Returns:
            :obj:`werkzeug.wrappers.response.Response`: response
        """
        data = {
            'status': self.status,
            'title': self.title,
            'detail': str(self.instance),
            'type': str(self.instance.__class__.__name__),
        }
        return flask.jsonify(data), self.status


def _render_exception(exception):
    """ Render an exception

    Args:
        exception (:obj:`Exception`): exception

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response
    """
    if isinstance(exception, BadRequestException):
        return exception.get_response()
    else:
        data = {
            'status': 500,
            'title': 'Server error',
            'detail': str(exception),
            'type': exception.__class__.__name__,
        }
        return flask.jsonify(data), 500
