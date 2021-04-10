from ...exceptions import BadRequestException
from ...utils import get_temp_file
from biosimulators_utils.sedml.data_model import (
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
)
from biosimulators_utils.sedml.model_utils import get_variables_for_simulation
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
            has schema ``#/components/schemas/SedTask`` with the
            specifications of the desired SED task
        modelFile (:obj:`werkzeug.datastructures.FileStorage`): model file (e.g., SBML file)

    Returns:
        :obj:`list` of ``#/components/schemas/SedVariable``
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
        vars = get_variables_for_simulation(model_filename, model_lang, sim_cls, alg_kisao_id)
    except Exception as exception:
        raise BadRequestException(
            title='Models of language `{}` are not supported with simulations of type `{}` and algorithm `{}`'.format(
                model_lang, sim_type, alg_kisao_id),
            instance=exception
        )  # pragma: no cover: unreachable due to schema validation

    # format SED variables for response
    response_vars = []
    task = {
        "_type": "SedTask",
        "id": "task",
        "model": {
            "_type": "SedModel",
            "id": "model",
            "language": model_lang,
            "source": model_source,
        },
        "simulation": {
            "_type": sim_type,
            "id": "simulation",
            "algorithm": {
                "_type": "SedAlgorithm",
                "kisaoId": alg_kisao_id,
                "changes": [],
            },
        },
    }

    if sim_type == 'SedUniformTimeCourseSimulation':
        task["simulation"]["initialTime"] = 0
        task["simulation"]["outputStartTime"] = 0
        task["simulation"]["outputEndTime"] = 1
        task["simulation"]["numberOfSteps"] = 0
    elif sim_type == 'SedOneStepSimulation':
        task["simulation"]["step"] = 1

    for var in vars:
        response_var = {
            "_type": "SedVariable",
            "id": var.id,
            "task": task,
        }

        if var.name:
            response_var['name'] = var.name
        if var.symbol:
            response_var['symbol'] = var.symbol
        if var.target:
            response_var['target'] = {
                "_type": "SedVariableTarget",
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

        response_vars.append(response_var)

    return response_vars
