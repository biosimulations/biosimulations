import flask
import os
import shutil
import tempfile
from biosimulators_utils.combine.data_model import CombineArchiveContent  # noqa: F401
from biosimulators_utils.sedml.data_model import Output, DataSet, DataGenerator  # noqa: F401
from .s3 import S3Bucket
import uuid

s3_bucket = None


__all__ = [
    'get_temp_dir',
    'get_temp_file',
    'save_file_to_s3_bucket',
    'get_results_data_set_id',
    'make_validation_report',
    'convert_nested_list_to_validation_messages'
]


def get_temp_dir():
    ''' Get a temporary directory that will be cleaned up after the request is completed

    Returns:
        :obj:`str`: path to temporary directory
    '''
    dirname = tempfile.mkdtemp()

    @flask.after_this_request
    def cleanup(response, dirname=dirname):
        shutil.rmtree(dirname)
        return response

    return dirname


def get_temp_file():
    ''' Get a temporary file that will be cleaned up after the request is completed

    Returns:
        :obj:`str`: path to temporary file
    '''
    file_id, file_name = tempfile.mkstemp()
    os.close(file_id)

    @flask.after_this_request
    def cleanup(response, file_name=file_name):
        os.remove(file_name)
        return response

    return file_name


def save_file_to_s3_bucket(filename, public=False, id=None):
    """ Save a file to the BioSimulations S3 bucket

    Args:
        filename (:obj:`str`): path of file to save to S3 bucket

    Returns:
        :obj:`str`: URL for saved file
    """
    global s3_bucket
    if s3_bucket is None:
        s3_bucket = S3Bucket()

    if id is None:
        id = str(uuid.uuid4())

    url = s3_bucket.uploadFile(filename, public=public, id="temp/createdCombineArchive/" + id)

    return url


def get_results_data_set_id(content, output, data_element):
    ''' Get the runBioSimulations id for the results of a data set of a report
    or a data generator of a curve or surface of a plot.

    Args:
        content (:obj:`CombineArchiveContent`): content item of a COMBINE/OMEX
            archive
        output (:obj:`Output`): SED report or plot
        data_element (:obj:`DataSet` or :obj:`DataGenerator`): data set or
            generator

    Returns:
        :obj:`str`: id for the results of a data set of a report or a data
            generator of a curve or surface of a plot.
    '''
    sed_doc_id = os.path.relpath(content.location, '.')

    if isinstance(data_element, DataSet):
        return '{}/{}/{}'.format(
            sed_doc_id,
            output.id,
            data_element.id
        )
    elif isinstance(data_element, DataGenerator):
        return '{}/{}/{}'.format(
            sed_doc_id,
            output.id,
            data_element.id,
        )


def make_validation_report(errors, warnings, filenames=None):
    """ Create a validation report for lists of errors and warnings

    Args:
        errors (nested :obj:`list` of :obj:`str`): errors
        warnings (nested :obj:`list` of :obj:`str`): warnings
        filenames (:obj:`list` of :obj:`str`, optional): filenames to strip from the message

    Returns:
        ``#/components/schemas/ValidationReport``: information about the validity or
            lack thereof of a COMBINE/OMEX archive
    """
    report = {
        "_type": "ValidationReport",
        "status": "valid"
    }

    if warnings:
        report['status'] = 'warnings'
        report['warnings'] = convert_nested_list_to_validation_messages(warnings, filenames=filenames)

    if errors:
        report['status'] = 'invalid'
        report['errors'] = convert_nested_list_to_validation_messages(errors, filenames=filenames)

    return report


def convert_nested_list_to_validation_messages(nested, filenames=None):
    """ Convert a nested list of errors or warnings into a list of validation messages

    Args:
        nested (nested :obj:`list` of :obj:`str`): list of errors or warnings
        filenames (:obj:`list` of :obj:`str`, optional): filenames to strip from the message

    Returns:
        :obj:`list` of ``#/components/schemas/ValidationMessage``: validation message
    """
    msgs = []
    for el in nested:
        msg = {
            "_type": "ValidationMessage",
            "summary": el[0],
        }

        for filename in filenames or []:
            msg['summary'] = (
                msg['summary']
                .replace('`' + filename + '`', 'file' + os.path.splitext(filename)[1])
                .replace(filename, 'file' + os.path.splitext(filename)[1])
            )

        if len(el) > 1:
            msg['details'] = convert_nested_list_to_validation_messages(el[1], filenames=filenames)
        msgs.append(msg)
    return msgs
