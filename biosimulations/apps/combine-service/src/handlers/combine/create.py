from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.data_model import (
    CombineArchive,
    CombineArchiveContent,
)
from biosimulators_utils.combine.io import (
    CombineArchiveWriter,
)
from biosimulators_utils.sedml.data_model import (
    SedDocument,
    Model,
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
    Algorithm,
    AlgorithmParameterChange,
    Task,
    DataGenerator,
    Variable,
    Report,
    Plot2D,
    Plot3D,
    DataSet,
    Curve,
    Surface,
    AxisScale,
)
from biosimulators_utils.sedml.io import (
    SedmlSimulationWriter,
)
import connexion
import datetime
import dateutil.tz
import os
import src.utils
import werkzeug.datastructures  # noqa: F401
import werkzeug.wrappers.response  # noqa: F401


def handler(body, files):
    ''' Create a COMBINE/OMEX archive for a model with a SED-ML document
    according to a particular specification.

    Args:
        body (:obj:`dict`): dictionary with key ``specs`` whose value
            has schema ``#/components/schemas/CombineArchive`` with the
            specifications of the desired SED document
        files (:obj:`list` of :obj:`werkzeug.datastructures.FileStorage`): files (e.g., SBML
            file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response with COMBINE/OMEX
            archive
    '''
    archive_specs = body['specs']
    files = connexion.request.files.getlist('files')

    # create temporary working directory
    temp_dirname = get_temp_dir()

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
            sed_doc = export_sed_doc(content['location']['value'])

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
    archive_url = src.utils.save_file_to_s3_bucket(archive_filename)

    # return URL for archive in S3 bucket
    return archive_url


def export_sed_doc(sed_doc_specs):
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
            )

            target_spec = var_spec.get('target', None)
            if target_spec:
                var.target = target_spec['value']
                for ns in target_spec.get('namespaces', []):
                    var.target_namespaces[ns.get('prefix', None)] = ns['uri']

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
