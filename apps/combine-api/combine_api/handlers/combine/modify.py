from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from .utils import export_sed_doc
from biosimulators_utils.combine.data_model import (
    CombineArchiveContent,
)
from biosimulators_utils.combine.io import (
    CombineArchiveReader,
    CombineArchiveWriter,
)
from biosimulators_utils.sedml.io import (
    SedmlSimulationWriter,
)
import connexion
import flask
import os
import combine_api
import requests
import requests.exceptions
import werkzeug.datastructures  # noqa: F401
import werkzeug.wrappers.response  # noqa: F401


def handler(body, files=None):
    ''' Modify a COMBINE/OMEX archive.

    Args:
        body (:obj:`dict`): dictionary with schema ``ModifyCombineArchiveSpecsAndFiles`` with the
            specifications of the COMBINE/OMEX archive to create
        files (:obj:`list` of :obj:`werkzeug.datastructures.FileStorage`, optional): files (e.g., SBML
            file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response` or :obj:`str`: response with COMBINE/OMEX
            archive or a URL to a COMBINE/OMEX archive
    '''
    download = body.get('download', False)
    archive_filename_or_url = body['archive']
    archive_specs = body['specs']
    files = connexion.request.files.getlist('files')

    # build map from model filenames to file objects
    filename_map = {
        file.filename: file
        for file in files
    }

    # create temporary working directory
    temp_dirname = get_temp_dir()
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # save COMBINE/OMEX archive to local temporary file
    if 'filename' in archive_filename_or_url and 'url' in archive_filename_or_url:
        raise BadRequestException(
            title='Only one of `filename` or `url` can be used at a time.',
            instance=ValueError(),
        )

    elif 'filename' not in archive_filename_or_url and 'url' not in archive_filename_or_url:
        raise BadRequestException(
            title='One of `filename` or `url` must be used.',
            instance=ValueError(),
        )

    elif 'filename' in archive_filename_or_url:
        # get COMBINE/OMEX archive
        archive_file = filename_map[archive_filename_or_url['filename']]

        # save archive to local temporary file
        archive_file.save(archive_filename)

    else:
        # get COMBINE/OMEX archive
        archive_url = archive_filename_or_url['url']
        try:
            response = requests.get(archive_url)
            response.raise_for_status()
        except requests.exceptions.RequestException as exception:
            title = 'COMBINE/OMEX archive could not be loaded from `{}`'.format(archive_url)
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
            title='`{}` is not a valid COMBINE/OMEX archive'.format(
                archive_filename_or_url.get('filename', None) or archive_filename_or_url.get('url', None)
            ),
            instance=exception,
        )

    # build map of locations in archive to contents
    archive_location_to_contents = {
        os.path.relpath(content.location, '.'): content
        for content in archive.contents
    }

    # add files to archive or modify existing files
    for content in archive_specs['contents']:
        content_type = content['location']['value']['_type']
        if content_type == 'SedDocument':
            sed_doc = export_sed_doc(content['location']['value'])

            # save SED-ML document to file
            try:
                SedmlSimulationWriter().run(
                    sed_doc,
                    os.path.join(archive_dirname, content['location']['path']),
                    validate_models_with_languages=False)
            except ValueError as exception:
                raise BadRequestException(
                    title='`{}` does not contain a configuration for a valid SED-ML document.'.format(
                        content['location']['value']),
                    instance=exception,
                )

        elif content_type == 'CombineArchiveContentFile':
            file = filename_map.get(
                content['location']['value']['filename'], None)
            if not file:
                raise BadRequestException(
                    title='File with name `{}` was not uploaded'.format(
                        content['location']['value']['filename']),
                    instance=ValueError(),
                )
            filename = os.path.join(archive_dirname,
                                    content['location']['path'])
            if not os.path.isdir(os.path.dirname(filename)):
                os.makedirs(os.path.dirname(filename))
            file.save(filename)

        elif content_type == 'CombineArchiveContentUrl':
            filename = os.path.join(archive_dirname,
                                    content['location']['path'])
            if not os.path.isdir(os.path.dirname(filename)):
                os.makedirs(os.path.dirname(filename))

            content_url = content['location']['value']['url']
            try:
                response = requests.get(content_url)
                response.raise_for_status()
            except requests.exceptions.RequestException as exception:
                title = 'COMBINE/OMEX archive content could not be loaded from `{}`'.format(
                    content_url)
                raise BadRequestException(
                    title=title,
                    instance=exception,
                )
            with open(filename, 'wb') as file:
                file.write(response.content)

        else:
            raise BadRequestException(
                title='Content of type `{}` is not supported'.format(
                    content_type),
                instance=NotImplementedError('Invalid content')
            )  # pragma: no cover: unreachable due to schema validation

        combine_archive_content = archive_location_to_contents.get(os.path.relpath(content['location']['path'], '.'), None)
        if combine_archive_content is None:
            combine_archive_content = CombineArchiveContent(
                location=content['location']['path'],
                format=content['format'],
                master=content['master'],
            )

            archive.contents.append(combine_archive_content)

        else:
            combine_archive_content.format = content['format']
            combine_archive_content.master = content['master']

    # package COMBINE/OMEX archive
    CombineArchiveWriter().run(archive, archive_dirname, archive_filename)

    if download:
        return flask.send_file(archive_filename,
                               mimetype='application/zip',
                               as_attachment=True,
                               download_name='archive.omex')

    else:
        # save COMBINE/OMEX archive to S3 bucket
        archive_url = combine_api.s3.save_temporary_combine_archive_to_s3_bucket(archive_filename, public=True)

        # return URL for archive in S3 bucket
        return archive_url
