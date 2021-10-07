from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.utils.core import flatten_nested_list_of_strings
import os
import requests
import requests.exceptions
import zipfile


def handler(body, file=None):
    ''' Get the manifest of a COMBINE archive

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value has schema ``Url`` with the
              URL for a COMBINE/OMEX archive

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file

    Returns:
        ``CombineArchive``: manifest of the COMBINE/OMEX archive
    '''
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
    try:
        with zipfile.ZipFile(archive_filename, 'r') as zip_file:
            zip_file.extract('manifest.xml', temp_dirname)
    except zipfile.BadZipFile as exception:
        raise BadRequestException(
            title='COMBINE/OMEX archive is not a valid zip archive.',
            instance=exception)
    except KeyError as exception:
        raise BadRequestException(
            title='COMBINE/OMEX archive does not contain a manifest.',
            instance=exception)

    manifest_filename = os.path.join(temp_dirname, 'manifest.xml')
    reader = CombineArchiveReader()
    contents = reader.read_manifest(manifest_filename, archive_filename)
    if reader.errors:
        raise BadRequestException(
            title='COMBINE/OMEX archive does not contain a valid manifest.\n  {}'.format(
                flatten_nested_list_of_strings(reader.errors).replace('\n', '\n  ')),
            instance=ValueError())

    contents_specs = []
    for content in contents:
        content_specs = {
            '_type': 'CombineArchiveManifestContent',
            'location': {
                '_type': 'CombineArchiveManifestLocation',
                'path': content.location,
                'value': {
                    '_type': 'CombineArchiveContentFile',
                    'filename': os.path.relpath(content.location, '.'),
                },
            },
            'format': content.format,
            'master': content.master,
        }
        contents_specs.append(content_specs)

    # format response
    response = {
        '_type': 'CombineArchiveManifest',
        'contents': contents_specs
    }

    # return reponse
    return response
