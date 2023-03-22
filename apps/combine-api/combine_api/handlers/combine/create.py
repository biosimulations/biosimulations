from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from .utils import export_sed_doc
from biosimulators_utils.combine.data_model import (
    CombineArchive,
    CombineArchiveContent,
)
from biosimulators_utils.combine.io import (
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
    ''' Create a COMBINE/OMEX archive.

    Args:
        body (:obj:`dict`): dictionary with schema ``CreateCombineArchiveSpecsAndFiles`` with the
            specifications of the COMBINE/OMEX archive to create
        files (:obj:`list` of :obj:`werkzeug.datastructures.FileStorage`, optional): files (e.g., SBML
            file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response` or :obj:`str`: response with COMBINE/OMEX
            archive or a URL to a COMBINE/OMEX archive
    '''
    download = body.get('download', False)
    archive_specs = body['specs']
    files = connexion.request.files.getlist('files')

    # create temporary working directory
    temp_dirname = get_temp_dir()

    # create temporary files for archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # initialize archive
    archive = CombineArchive()

    # build map from model filenames to file objects
    filename_map = {
        file.filename: file
        for file in files
    }

    # add files to archive
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

        content = CombineArchiveContent(
            location=content['location']['path'],
            format=content['format'],
            master=content['master'],
        )

        archive.contents.append(content)

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
