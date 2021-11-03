from ...exceptions import BadRequestException
from ...utils import get_temp_file
from biosimulators_utils.sedml.data_model import (
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
    Plot2D,
)
from biosimulators_utils.sedml.exceptions import UnsupportedModelLanguageError
from biosimulators_utils.sedml.model_utils import get_parameters_variables_outputs_for_simulation
import os
import requests
import requests.exceptions
import werkzeug.datastructures  # noqa: F401


def handler(body, modelFile=None):
    """ Get a SED report for a SED task that will record all of the
    possible observables of the task

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``task`` whose value
            has schema ``SedTask`` with the
            specifications of the desired SED task
        modelFile (:obj:`werkzeug.datastructures.FileStorage`): model file (e.g., SBML file)

    Returns:
        :obj:``SedDocument``
    """
    model_url = body.get('modelUrl', None)
    model_lang = body['modelLanguage']
    sim_type = body['simulationType']
    alg_kisao_id = body['simulationAlgorithm']

    model_filename = get_temp_file()

    if modelFile and model_url:
        raise ValueError((
            'Only one of `modelFile` and `modelUrl` should be used at a time. '
            '`modelFile` and `modelUrl` cannot be used together.'
        ))

    if modelFile:
        modelFile.save(model_filename)
        model_source = os.path.basename(modelFile.filename)

    else:
        try:
            response = requests.get(model_url)
            response.raise_for_status()

        except requests.exceptions.RequestException as exception:
            title = 'Model could not be loaded from `{}`'.format(
                model_url)
            raise BadRequestException(
                title=title,
                instance=exception,
            )

        with open(model_filename, 'wb') as file:
            file.write(response.content)

        model_source = os.path.basename(model_url)

    if sim_type == 'SedOneStepSimulation':
        sim_cls = OneStepSimulation
    elif sim_type == 'SedSteadyStateSimulation':
        sim_cls = SteadyStateSimulation
    elif sim_type == 'SedUniformTimeCourseSimulation':
        sim_cls = UniformTimeCourseSimulation
    else:
        raise BadRequestException(
            title='Simulations of type `{}` are not supported'.format(
                sim_type),
            instance=NotImplementedError('Invalid simulation')
        )  # pragma: no cover: unreachable due to schema validation

    try:
        params, sims, vars, plots = get_parameters_variables_outputs_for_simulation(model_filename, model_lang, sim_cls, alg_kisao_id)
    except UnsupportedModelLanguageError as exception:
        raise BadRequestException(
            title='Models of language `{}` are not supported with simulations of type `{}` and algorithm `{}`'.format(
                model_lang, sim_type, alg_kisao_id),
            instance=exception
        )  # pragma: no cover: unreachable due to schema validation
    except Exception as exception:
        raise BadRequestException(
            title='Information about parameters and observable could not be extract from the model of language `{}`'.format(
                model_lang),
            instance=exception
        )  # pragma: no cover: unreachable due to schema validation

    # format SED variables for response
    model = {
        "_type": "SedModel",
        "id": "model",
        "language": model_lang,
        "source": model_source,
        "changes": [],
    }

    for param in params:
        change = {
            "_type": "SedModelAttributeChange",
            "id": param.id,
            "target": {
                "_type": "SedTarget",
                "value": param.target,
                "namespaces": [],
            },
            "newValue": param.new_value,
        }
        if param.name:
            change['name'] = param.name
        model['changes'].append(change)

        for prefix, uri in param.target_namespaces.items():
            ns = {
                "_type": "Namespace",
                "uri": uri,
            }
            if prefix:
                ns['prefix'] = prefix
            change['target']['namespaces'].append(ns)

    simulations = []
    tasks = []
    data_generators = []
    outputs = []
    for i_sim, sim in enumerate(sims):
        if len(sims) > 1:
            sim_suffix = '_' + str(i_sim)
        else:
            sim_suffix = ''

        if isinstance(sim, OneStepSimulation):
            sim_type = 'SedOneStepSimulation'
        elif isinstance(sim, SteadyStateSimulation):
            sim_type = 'SedSteadyStateSimulation'
        elif isinstance(sim, UniformTimeCourseSimulation):
            sim_type = 'SedUniformTimeCourseSimulation'
        else:
            raise NotImplementedError('Simulations of type `{}` is not supported.'.format(sim.__class__.__name__))

        simulation = {
            "_type": sim_type,
            "id": "simulation{}".format(sim_suffix),
            "algorithm": {
                "_type": "SedAlgorithm",
                "kisaoId": sim.algorithm.kisao_id,
                "changes": [],
            },
        }

        if isinstance(sim, OneStepSimulation):
            simulation["step"] = sim.step

        elif isinstance(sim, UniformTimeCourseSimulation):
            simulation["initialTime"] = sim.initial_time
            simulation["outputStartTime"] = sim.output_start_time
            simulation["outputEndTime"] = sim.output_end_time
            simulation["numberOfSteps"] = sim.number_of_steps

        for change in sim.algorithm.changes:
            simulation['algorithm']['changes'].append({
                '_type': 'SedAlgorithmParameterChange',
                'kisaoId': change.kisao_id,
                'newValue': change.new_value,
            })

        simulations.append(simulation)

        task = {
            "_type": "SedTask",
            "id": "task{}".format(sim_suffix),
            "model": model,
            "simulation": simulation,
        }
        tasks.append(task)

        report = {
            "_type": "SedReport",
            "id": "report{}".format(sim_suffix),
            'dataSets': [],
        }
        outputs.append(report)

        var_data_gen_map = {}

        for var in vars:
            response_var = {
                "_type": "SedVariable",
                "id": '{}{}'.format(var.id, sim_suffix),
                "task": task,
            }

            if var.name:
                response_var['name'] = var.name
            if var.symbol:
                response_var['symbol'] = var.symbol
            if var.target:
                response_var['target'] = {
                    "_type": "SedTarget",
                    "value": var.target,
                }
                if var.target_namespaces:
                    response_var['target']['namespaces'] = []
                    for prefix, uri in var.target_namespaces.items():
                        ns = {
                            "_type": "Namespace",
                            "uri": uri,
                        }
                        if prefix:
                            ns['prefix'] = prefix
                        response_var['target']['namespaces'].append(ns)

            data_generator = {
                "_type": "SedDataGenerator",
                "id": "data_generator{}_{}".format(sim_suffix, var.id),
                "variables": [response_var],
                "math": response_var['id'],
            }
            if var.name:
                data_generator['name'] = var.name

            data_generators.append(data_generator)

            var_data_gen_map[var] = data_generator

            data_set = {
                '_type': 'SedDataSet',
                'id': 'data_set{}_{}'.format(sim_suffix, var.id),
                'label': var.name or var.id,
                'name': var.name,
                'dataGenerator': data_generator,
            }

            report['dataSets'].append(data_set)

        for plot in plots:
            if isinstance(plot, Plot2D):
                output = {
                    '_type': "SedPlot2D",
                    "id": '{}{}'.format(plot.id, sim_suffix),
                    "name": plot.name,
                    'curves': [],
                }

                for curve in plot.curves:
                    assert len(curve.x_data_generator.variables) == 1
                    assert len(curve.y_data_generator.variables) == 1
                    assert curve.x_data_generator.math == curve.x_data_generator.variables[0].id
                    assert curve.y_data_generator.math == curve.y_data_generator.variables[0].id

                    output['curves'].append({
                        "_type": "SedCurve",
                        "id": '{}{}'.format(curve.id, sim_suffix),
                        "name": curve.name,
                        "xDataGenerator": var_data_gen_map[curve.x_data_generator.variables[0]],
                        "yDataGenerator": var_data_gen_map[curve.y_data_generator.variables[0]],
                        "xScale": curve.x_scale.value,
                        "yScale": curve.y_scale.value,
                    })
            else:
                output = {
                    '_type': "SedPlot3D",
                    "name": plot.name,
                    "id": '{}{}'.format(plot.id, sim_suffix),
                    'surfaces': [],
                }

                for surface in plot.surfaces:
                    assert len(curve.x_data_generator.variables) == 1
                    assert len(curve.y_data_generator.variables) == 1
                    assert len(curve.z_data_generator.variables) == 1
                    assert curve.x_data_generator.math == curve.x_data_generator.variables[0].id
                    assert curve.y_data_generator.math == curve.y_data_generator.variables[0].id
                    assert curve.z_data_generator.math == curve.z_data_generator.variables[0].id

                    output['surfaces'].append({
                        "_type": "SedSurface",
                        "id": '{}{}'.format(curve.id, sim_suffix),
                        "name": curve.name,
                        "xDataGenerator": var_data_gen_map[curve.x_data_generator.variables[0]],
                        "yDataGenerator": var_data_gen_map[curve.y_data_generator.variables[0]],
                        "zDataGenerator": var_data_gen_map[curve.z_data_generator.variables[0]],
                        "xScale": curve.x_scale.value,
                        "yScale": curve.y_scale.value,
                        "zScale": curve.z_scale.value,
                    })

            outputs.append(output)

    doc = {
        "_type": "SedDocument",
        "level": 1,
        "version": 3,
        "models": [model],
        "simulations": simulations,
        "tasks": tasks,
        "dataGenerators": data_generators,
        "outputs": outputs,
    }

    return doc
