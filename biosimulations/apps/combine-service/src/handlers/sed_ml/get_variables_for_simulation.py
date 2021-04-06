from ...exceptions import BadRequestException
from ...utils import get_temp_file
from biosimulators_utils.sedml.data_model import (
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
)
from biosimulators_utils.sedml.model_utils import get_variables_for_simulation
import os
import werkzeug.datastructures  # noqa: F401


def handler(body, modelFile):
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
    model_lang = body['modelLanguage']
    sim_type = body['simulationType']
    alg_kisao_id = body['simulationAlgorithmKisaoId']

    model_filename = get_temp_file()
    modelFile.save(model_filename)

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
            "source": os.path.basename(modelFile.filename),
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
            response_var['target'] = var.target

        response_vars.append(response_var)

    return response_vars
