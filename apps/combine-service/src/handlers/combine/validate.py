from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.data_model import CombineArchiveContentFormat
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.combine.validation import validate
import os
import requests
import requests.exceptions


def handler(body, file=None):
    ''' Validate a COMBINE/OMEX archive

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value
            has schema ``#/components/schemas/Url`` with the
            URL for a COMBINE/OMEX archive
        file (:obj:`werkzeug.datastructures.FileStorage`): COMBINE/OMEX archive file

    Returns:
        ``#/components/schemas/ValidationReport``: information about the validity or
            lack thereof of a COMBINE/OMEX archive
    '''
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
        archive = reader.run(archive_filename, archive_dirname)
    except Exception as exception:
        errors = [['The file could not be parsed as a COMBINE/OMEX archive.', [[str(exception)]]]]

    if not errors:
        errors, warnings = validate(
            archive, archive_dirname,
            formats_to_validate=list(CombineArchiveContentFormat.__members__.values()))

    report = {
        "_type": "ValidationReport",
        "status": "valid"
    }

    if warnings:
        report['status'] = 'warnings'
        report['warnings'] = convert_nested_list_to_validation_messages(warnings, archive_filename)

    if errors:
        report['status'] = 'invalid'
        report['errors'] = convert_nested_list_to_validation_messages(errors, archive_filename)

    return report


def convert_nested_list_to_validation_messages(nested, archive_filename):
    msgs = []
    for el in nested:
        msg = {
            "_type": "ValidationMessage",
            "summary": el[0]
            .replace('`' + archive_filename + '`', 'file')
            .replace(archive_filename, 'file')
        }
        if len(el) > 1:
            msg['details'] = convert_nested_list_to_validation_messages(el[1], archive_filename)
        msgs.append(msg)
    return msgs
