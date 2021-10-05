from ...exceptions import BadRequestException
from ...utils import get_temp_dir, make_validation_report
from biosimulators_utils.combine.data_model import CombineArchiveContentFormat
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.combine.validation import validate
from biosimulators_utils.config import Config
from biosimulators_utils.omex_meta.data_model import OmexMetaSchema
import os
import requests
import requests.exceptions


def handler(body, file=None,
            validateOmexManifest=True,
            validateSedml=True,
            validateSedmlModels=True,
            validateOmexMetadata=True,
            validateImages=True):
    ''' Validate a COMBINE/OMEX archive

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value has schema ``#/components/schemas/Url`` with the URL for a COMBINE/OMEX archive

        validateOmexManifest (:obj:`bool`, optional): Whether to validate the OMEX manifest file in the archive
        validateSedml (:obj:`bool`, optional): Whether to validate the SED-ML files in the archive
        validateSedmlModels (:obj:`bool`, optional): Whether to validate the sources of the models in the SED-ML files in the archive
        validateOmexMetadata (:obj:`bool`, optional): Whether to validate the OMEX metdata files in the archive according to
            `BioSimulators' conventions <https://biosimulators.org/conventions/metadata>`_
        validateImages (:obj:`bool`, optional): Whether to validate the images (BMP, GIF, JPEG, PNG, TIFF WEBP) files in the archive
        file (:obj:`werkzeug.datastructures.FileStorage`): COMBINE/OMEX archive file

    Returns:
        ``#/components/schemas/ValidationReport``: information about the validity or
            lack thereof of a COMBINE/OMEX archive
    '''
    config = Config(
        VALIDATE_OMEX_MANIFESTS=validateOmexManifest,
        VALIDATE_SEDML=validateSedml,
        VALIDATE_SEDML_MODELS=validateSedmlModels,
        VALIDATE_OMEX_METADATA=validateOmexMetadata,
        VALIDATE_IMAGES=validateImages,
    )

    archive_file = file
    archive_url = body.get('url', None)
    if archive_url and archive_file:
        raise BadRequestException(
            title='Only one of `file` or `url` can be used at a time.',
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
            metadata_schema=OmexMetaSchema.biosimulations,
            config=config,
        )

    return make_validation_report(errors, warnings, filenames=[archive_filename])
