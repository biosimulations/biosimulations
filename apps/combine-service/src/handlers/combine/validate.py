from ...exceptions import BadRequestException
from ...utils import get_temp_dir, make_validation_report
from biosimulators_utils.combine.data_model import CombineArchiveContentFormat
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.combine.validation import validate
from biosimulators_utils.config import Config
from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema
import os
import requests
import requests.exceptions


def handler(body, file=None):
    ''' Validate a COMBINE/OMEX archive

    Args:
        body (:obj:`dict`): dictionary in schema ``ValidateCombineArchiveFileOrUrl`` with keys

            * ``url`` whose value has schema ``Url`` with the URL for a COMBINE/OMEX archive
            * ``omexMetadataFormat`` (:obj:`str`): format of the OMEX Metadata files
            * ``omexMetadataSchema`` (:obj:`str`): schema for validating the OMEX Metadata files
            * ``validateOmexManifest`` (:obj:`bool`, optional): Whether to validate the OMEX manifest file in the archive
            * ``validateSedml`` (:obj:`bool`, optional): Whether to validate the SED-ML files in the archive
            * ``validateSedmlModels`` (:obj:`bool`, optional): Whether to validate the sources of the models in the SED-ML files in the archive
            * ``validateOmexMetadata`` (:obj:`bool`, optional): Whether to validate the OMEX metdata files in the archive according to
                `BioSimulators' conventions <https://biosimulators.org/conventions/metadata>`_
            * ``validateImages`` (:obj:`bool`, optional): Whether to validate the images (BMP, GIF, JPEG, PNG, TIFF WEBP) files in the archive

        file (:obj:`werkzeug.datastructures.FileStorage`): COMBINE/OMEX archive file

    Returns:
        ``ValidationReport``: information about the validity or
            lack thereof of a COMBINE/OMEX archive
    '''
    try:
        omexMetadataInputFormat = OmexMetadataInputFormat(body['omexMetadataFormat'])
    except ValueError as exception:
        raise BadRequestException(title='`omexMetadataFormat` must be a recognized format.', exception=exception)

    try:
        omexMetadataSchema = OmexMetadataSchema(body['omexMetadataSchema'])
    except ValueError as exception:
        raise BadRequestException(title='`omexMetadataSchema` must be a recognized schema.', exception=exception)

    config = Config(
        OMEX_METADATA_INPUT_FORMAT=omexMetadataInputFormat,
        OMEX_METADATA_SCHEMA=omexMetadataSchema,
        VALIDATE_OMEX_MANIFESTS=body.get('validateOmexManifest', True),
        VALIDATE_SEDML=body.get('validateSedml', True),
        VALIDATE_SEDML_MODELS=body.get('validateSedmlModels', True),
        VALIDATE_OMEX_METADATA=body.get('validateOmexMetadata', True),
        VALIDATE_IMAGES=body.get('validateImages', True),
    )

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
    reader = CombineArchiveReader()
    errors = []
    warnings = []
    try:
        archive = reader.run(archive_filename, archive_dirname, config=config)
    except Exception as exception:
        errors = [['The file could not be parsed as a COMBINE/OMEX archive.', [[str(exception)]]]]

    if not errors:
        errors, warnings = validate(
            archive, archive_dirname,
            formats_to_validate=list(CombineArchiveContentFormat.__members__.values()),
            config=config,
        )

    return make_validation_report(errors, warnings, filenames=[archive_filename])
