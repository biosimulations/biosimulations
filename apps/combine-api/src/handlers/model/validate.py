from ...exceptions import BadRequestException
from ...utils import get_temp_file, make_validation_report
from biosimulators_utils.sedml.data_model import ModelLanguage
from biosimulators_utils.sedml.validation import validate_model_with_language
import requests
import requests.exceptions

MODEL_LANGUAGES = [
    ModelLanguage.BNGL,
    ModelLanguage.CellML,
    # ModelLanguage.ZGINML,
    ModelLanguage.LEMS,
    ModelLanguage.NeuroML,
    ModelLanguage.RBA,
    ModelLanguage.SBML,
    ModelLanguage.Smoldyn,
    ModelLanguage.XPP,
]


def handler(body, file=None):
    ''' Validate a model

    Args:
        body (:obj:`dict`): dictionary in schema ``ValidateModelFileOrUrl`` with keys

            * ``url`` whose value has schema ``Url`` with the URL for a model file
            * ``language`` (:obj:`str`): language of the model

        file (:obj:`werkzeug.datastructures.FileStorage`): model file

    Returns:
        ``ValidationReport``: information about the validity or
            lack thereof of the model
    '''
    has_language = False
    for model_language in MODEL_LANGUAGES:
        if body['language'] == model_language.name:
            has_language = True
            break
    if not has_language:  # pragma: no cover: unreachable due to OpenAPI validation
        title = (
            'Model language `{}` is not not supported. Model language must be one of {}'
        ).format(body['language'], ', '.join(model_language.name for model_language in MODEL_LANGUAGES))
        raise BadRequestException(
            title=title,
            exception=NotImplementedError(),
        )

    model_file = file
    model_url = body.get('url', None)
    if model_url and model_file:
        raise BadRequestException(
            title='Only one of `file` or `url` can be used at a time.',
            instance=ValueError(),
        )
    if not model_url and not model_file:
        raise BadRequestException(
            title='One of `file` or `url` must be used.',
            instance=ValueError(),
        )

    # create temporary file
    model_filename = get_temp_file()

    # get model
    if model_file:
        model_file.save(model_filename)

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

        # save model to local temporary file
        with open(model_filename, 'wb') as file:
            file.write(response.content)

    # validate model
    errors, warnings, _ = validate_model_with_language(model_filename, model_language)
    return make_validation_report(errors, warnings, filenames=[model_filename])
