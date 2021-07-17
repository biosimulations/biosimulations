from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.data_model import CombineArchiveContent
from biosimulators_utils.combine.io import CombineArchiveReader, CombineArchiveWriter
import connexion
import datetime
import dateutil.tz
import flask
import os
import requests
import requests.exceptions
import src.utils


def handler(body, files=None):
    ''' Add one or more files to a COMBINE/OMEX archive

    Args:
        body (:obj:`dict`): dictionary with schema ``#/components/schemas/CombineArchiveAndAdditionalContent`` with the
            specifications of the desired additions to the COMBINE/OMEX archive
        files (:obj:`list` of :obj:`werkzeug.datastructures.FileStorage`, optional): files (e.g., SBML
            file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response` or :obj:`str`: response with COMBINE/OMEX
            archive or a URL to a COMBINE/OMEX archive
    '''
    archive = body.get('archive')
    new_content = body.get('newContent')
    files = connexion.request.files.getlist('files')
    filename_map = {file.filename: file for file in files}
    overwrite_locations = body.get('overwriteLocations', True)
    download = body.get('download', False)

    # create temporary working directory
    temp_dirname = get_temp_dir()
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # get COMBINE/OMEX archive
    archive_url = archive.get('url', None)
    if archive_url:
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
    else:
        archive_file = filename_map.get(archive['filename'], None)
        if archive_file is None:
            raise BadRequestException(
                title='Archive file with name `{}` was not uploaded'.format(
                    archive['filename']),
                instance=ValueError(),
            )
        archive_file.save(archive_filename)

    # read archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    try:
        archive = CombineArchiveReader().run(archive_filename, archive_dirname)
    except Exception as exception:
        # return exception
        raise BadRequestException(
            title='COMBINE/OMEX archive is not valid.',
            instance=exception,
        )

    now = datetime.datetime.utcnow().replace(microsecond=0).astimezone(dateutil.tz.tzutc())
    archive.updated = now

    location_content_map = {os.path.relpath(content.location, '.'): content for content in archive.contents}
    new_location = os.path.relpath(new_content['location'], '.')
    content = location_content_map.get(new_location, None)
    if content is None:
        content = CombineArchiveContent(location=new_location, created=now)
        archive.contents.append(content)

    else:
        if not overwrite_locations:
            new_location_parts = os.path.splitext(new_location)
            i_file = 0
            while True:
                i_file += 1
                temp_new_location = new_location_parts[0] + '_' + str(i_file) + new_location_parts[1]
                if temp_new_location not in location_content_map:
                    new_location = temp_new_location
                    break

            content = CombineArchiveContent(location=new_location, created=now)
            archive.contents.append(content)

    content_filename = new_content['filename']
    file = filename_map.get(content_filename, None)
    if file:
        file.save(os.path.join(archive_dirname, new_location))
    else:
        raise BadRequestException(
            title='File with name `{}` was not uploaded'.format(content_filename),
            instance=ValueError(),
        )

    content.format = new_content['format']
    content.master = new_content['master']
    content.updated = now

    # fill in last updated dates -- because libCOMBINE requires them
    for content in archive.contents:
        if content.updated is None:
            content.updated = now

    # package COMBINE/OMEX archive
    CombineArchiveWriter().run(archive, archive_dirname, archive_filename)

    if download:
        return flask.send_file(archive_filename,
                               mimetype='application/zip',
                               as_attachment=True,
                               attachment_filename='archive.omex')

    else:
        # save COMBINE/OMEX archive to S3 bucket
        archive_url = src.utils.save_file_to_s3_bucket(archive_filename, public=True)

        # return URL for archive in S3 bucket
        return archive_url
