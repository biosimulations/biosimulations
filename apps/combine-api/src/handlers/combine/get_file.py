from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.io import CombineArchiveReader
import flask
import os
import requests
import requests.exceptions


def handler(url, location):
    ''' Retrieve a file at a location in a COMBINE/OMEX archive

    Args:
        url (:obj:`str`): URL for a COMBINE/OMEX archive
        location (:obj:`str`): location of the COMBINE/OMEX archive to retrieve

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response with file from COMBINE/OMEX
            archive
    '''
    # create temporary working directory
    temp_dirname = get_temp_dir()
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # get COMBINE/OMEX archive
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as exception:
        title = 'COMBINE/OMEX archive could not be loaded from `{}`'.format(
            url)
        raise BadRequestException(
            title=title,
            instance=exception,
        )

    # save archive to local temporary file
    with open(archive_filename, 'wb') as file:
        file.write(response.content)

    # read archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    try:
        archive = CombineArchiveReader().run(archive_filename, archive_dirname)
    except Exception as exception:
        # return exception
        raise BadRequestException(
            title='`{}` is not a valid COMBINE/OMEX archive'.format(url),
            instance=exception,
        )

    filename = os.path.join(archive_dirname, location)
    if not os.path.isfile(filename):
        msg = '`{}` is not a valid location in the COMBINE/OMEX archive.'.format(location)
        raise BadRequestException(
            title=msg,
            instance=ValueError())

    mimetype = None
    for content in archive.contents:
        if os.path.relpath(content.location, '.') == os.path.relpath(location, '.'):
            if content.format.startswith('http://purl.org/NET/mediatypes/'):
                mimetype = content.format[len('http://purl.org/NET/mediatypes/'):]
            break

    return flask.send_file(filename, mimetype=mimetype, as_attachment=False, attachment_filename=os.path.basename(location))
