from ...exceptions import BadRequestException
from ...utils import get_temp_file, make_validation_report
from biosimulators_utils.config import Config
from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema
from biosimulators_utils.omex_meta.io import read_omex_meta_file
import requests
import requests.exceptions


def handler(body, file=None):
    ''' Validate metadata about a modeling project or a component of a project

    Args:
        body (:obj:`dict`): dictionary in schema ``ValidateOmexMetadataFileOrUrl`` with keys

            * ``url`` whose value has schema ``Url`` with the URL for a model file
            * ``format`` (:obj:`str`): format of the metadata
            * ``schema`` (:obj:`str`): schema to use to validate the metadata

        file (:obj:`werkzeug.datastructures.FileStorage`): OMEX Metadata file

    Returns:
        ``ValidationReport``: information about the validity or
            lack thereof of the metadata
    '''
    format = OmexMetadataInputFormat(body['format'])
    schema = OmexMetadataSchema(body['schema'])

    metadata_file = file
    metadata_url = body.get('url', None)
    if metadata_url and metadata_file:
        raise BadRequestException(
            title='Only one of `file` or `url` can be used at a time.',
            instance=ValueError(),
        )
    if not metadata_url and not metadata_file:
        raise BadRequestException(
            title='One of `file` or `url` must be used.',
            instance=ValueError(),
        )

    # create temporary file
    metadata_filename = get_temp_file()

    # get metadata
    if metadata_file:
        metadata_file.save(metadata_filename)

    else:
        try:
            response = requests.get(metadata_url)
            response.raise_for_status()
        except requests.exceptions.RequestException as exception:
            title = 'Metadata could not be loaded from `{}`'.format(
                metadata_url)
            raise BadRequestException(
                title=title,
                instance=exception,
            )

        # save metadata to local temporary file
        with open(metadata_filename, 'wb') as file:
            file.write(response.content)

    # validate metadata
    config = Config(
        OMEX_METADATA_INPUT_FORMAT=format,
        OMEX_METADATA_SCHEMA=schema,
    )
    _, errors, warnings = read_omex_meta_file(metadata_filename, config=config)
    return make_validation_report(errors, warnings, filenames=[metadata_filename])
