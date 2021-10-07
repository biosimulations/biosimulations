from ...exceptions import BadRequestException
from ...utils import get_temp_file, make_validation_report
from biosimulators_utils.sedml.io import SedmlSimulationReader
import requests
import requests.exceptions


def handler(body, file=None):
    ''' Validate a simulation experiment (SED-ML) file

    Args:
        body (:obj:`dict`): dictionary in schema ``FileOrUrl`` with keys

            * ``url`` whose value has schema ``Url`` with the URL for a model file

        file (:obj:`werkzeug.datastructures.FileStorage`): OMEX Metadata file

    Returns:
        ``ValidationReport``: information about the validity or
            lack thereof of the simulation experiment
    '''
    simulation_file = file
    simulation_url = body.get('url', None)
    if simulation_url and simulation_file:
        raise BadRequestException(
            title='Only one of `file` or `url` can be used at a time.',
            instance=ValueError(),
        )
    if not simulation_url and not simulation_file:
        raise BadRequestException(
            title='One of `file` or `url` must be used.',
            instance=ValueError(),
        )

    # create temporary file
    simulation_filename = get_temp_file()

    # get simulation experiment
    if simulation_file:
        simulation_file.save(simulation_filename)

    else:
        try:
            response = requests.get(simulation_url)
            response.raise_for_status()
        except requests.exceptions.RequestException as exception:
            title = 'Simulation experiment could not be loaded from `{}`'.format(
                simulation_url)
            raise BadRequestException(
                title=title,
                instance=exception,
            )

        # save simulation experiment to local temporary file
        with open(simulation_filename, 'wb') as file:
            file.write(response.content)

    # validate simulation experiment
    reader = SedmlSimulationReader()
    try:
        reader.run(simulation_filename, validate_models_with_languages=False, validate_targets_with_model_sources=False)
    except Exception:
        if not reader.errors:
            raise
    return make_validation_report(reader.errors, reader.warnings, filenames=[simulation_filename])
