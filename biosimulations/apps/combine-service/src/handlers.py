from biosimulators_utils.combine.data_model import (
    CombineArchive,
    CombineArchiveContent,
    CombineArchiveContentFormat,
    CombineArchiveContentFormatPattern,
)
from biosimulators_utils.combine.io import (
    CombineArchiveReader,
    CombineArchiveWriter,
)
from biosimulators_utils.sedml.data_model import (  # noqa: F401
    ModelLanguagePattern,
    DataGenerator,
    Output,
    Report,
    DataSet,
    Plot2D,
    Plot3D,
    AxisScale,
)
from biosimulators_utils.sedml.io import SedmlSimulationReader
import connexion
import flask
import os
import re
import requests
import requests.exceptions
import shutil
import tempfile
import werkzeug  # noqa: F401
import werkzeug.wrappers.response  # noqa: F401


def get_sedml_output_specs_for_combine_archive(archiveUrl):
    ''' Get the specifications of the SED plots in a COMBINE/OMEX archive

    Args:
        archiveUrl (:obj:`str`): URL for COMBINE archive

    Returns:
        ``CombineArchive``: specifications of the SED plots in a COMBINE/OMEX
            archive
    '''

    # create temporary working directory
    temp_dirname = tempfile.mkdtemp()

    # get COMBINE/OMEX archive
    try:
        response = requests.get(archiveUrl)
        response.raise_for_status()
    except requests.exceptions.RequestException:
        msg = 'COMBINE/OMEX archive could not be loaded from `{}`'.format(
            archiveUrl)
        return connexion.problem(400, 'URL unavailable', msg)

    # save archive to local temporary file
    archive_filename = os.path.join(temp_dirname, 'archive.omex')
    with open(archive_filename, 'wb') as file:
        file.write(response.content)

    # read archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    try:
        archive = CombineArchiveReader.run(archive_filename, archive_dirname)
    except Exception:
        # cleanup temporary files
        shutil.rmtree(temp_dirname)

        # return exception
        return connexion.problem(
            400,
            'Invalid COMBINE/OMEX archive',
            '`{}` is not a valid COMBINE/OMEX archive'.format(archiveUrl))

    # get specifications of SED outputs
    contents_specs = []

    for content in archive.contents:
        if (
            content.format and
            re.match(CombineArchiveContentFormatPattern.SED_ML.value,
                     content.format)
        ):
            sed_doc_filename = os.path.join(archive_dirname,
                                            content.location)
            try:
                sed_doc = SedmlSimulationReader().run(sed_doc_filename,
                                                      validate_semantics=False)
            except Exception:
                continue

            sed_doc_outputs_specs = []
            for output in sed_doc.outputs:
                if isinstance(output, Report):
                    sed_doc_output_specs = {
                        '_type': 'SedReport',
                        'id': output.id,
                        'dataSets': [],
                    }

                    if output.name:
                        sed_doc_output_specs['name'] = output.name

                    for data_set in output.data_sets:
                        data_set_specs = {
                            'id': data_set.id,
                            'dataGenerator': {
                                '_resultsDataSetId': get_results_data_set_id(
                                    content, output, data_set),
                                'id': data_set.data_generator.id,
                                'variables': [],
                                'math': data_set.data_generator.math,
                            }
                        }

                        if data_set.name:
                            data_set_specs['name'] = data_set.name
                        if data_set.label:
                            data_set_specs['label'] = data_set.label
                        if data_set.data_generator.name:
                            data_set_specs['dataGenerator']['name'] = \
                                data_set.data_generator.name

                        sed_doc_output_specs['dataSets'].append(data_set_specs)

                elif isinstance(output, Plot2D):
                    sed_doc_output_specs = {
                        '_type': 'SedPlot2D',
                        'id': output.id,
                        'curves': [],
                        'xScale': None,
                        'yScale': None,
                    }

                    if output.name:
                        sed_doc_output_specs['name'] = output.name

                    if output.curves:
                        x_scale = output.curves[0].x_scale
                        y_scale = output.curves[0].y_scale
                    else:
                        x_scale = None
                        y_scale = None

                    for curve in output.curves:
                        curve_specs = {
                            'id': curve.id,
                            'xDataGenerator': {
                                '_resultsDataSetId': get_results_data_set_id(
                                    content, output, curve.x_data_generator),
                                'id': curve.x_data_generator.id,
                                'variables': [],
                                'math': curve.x_data_generator.math,
                            },
                            'yDataGenerator': {
                                '_resultsDataSetId': get_results_data_set_id(
                                    content, output, curve.y_data_generator),
                                'id': curve.y_data_generator.id,
                                'variables': [],
                                'math': curve.y_data_generator.math,
                            },
                        }

                        if curve.name:
                            curve_specs['name'] = curve.name
                        if curve.x_data_generator.name:
                            curve_specs['xDataGenerator']['name'] = \
                                curve.x_data_generator.name
                        if curve.y_data_generator.name:
                            curve_specs['yDataGenerator']['name'] = \
                                curve.y_data_generator.name

                        sed_doc_output_specs['curves'].append(curve_specs)

                        if curve.x_scale != x_scale:
                            x_scale = None
                        if curve.y_scale != y_scale:
                            y_scale = None

                    sed_doc_output_specs['xScale'] = (
                        x_scale or AxisScale.linear).value
                    sed_doc_output_specs['yScale'] = (
                        y_scale or AxisScale.linear).value

                elif isinstance(output, Plot3D):
                    sed_doc_output_specs = {
                        '_type': 'SedPlot3D',
                        'id': output.id,
                        'surfaces': [],
                        'xScale': None,
                        'yScale': None,
                        'zScale': None,
                    }

                    if output.name:
                        sed_doc_output_specs['name'] = output.name

                    if output.surfaces:
                        x_scale = output.surfaces[0].x_scale
                        y_scale = output.surfaces[0].y_scale
                        z_scale = output.surfaces[0].z_scale
                    else:
                        x_scale = None
                        y_scale = None
                        z_scale = None

                    for surface in output.surfaces:
                        surface_specs = {
                            'id': surface.id,
                            'xDataGenerator': {
                                '_resultsDataSetId': get_results_data_set_id(
                                    content, output, surface.x_data_generator),
                                'id': surface.x_data_generator.id,
                                'variables': [],
                                'math': surface.x_data_generator.math,
                            },
                            'yDataGenerator': {
                                '_resultsDataSetId': get_results_data_set_id(
                                    content, output, surface.y_data_generator),
                                'id': surface.y_data_generator.id,
                                'variables': [],
                                'math': surface.y_data_generator.math,
                            },
                            'zDataGenerator': {
                                '_resultsDataSetId': get_results_data_set_id(
                                    content, output, surface.z_data_generator),
                                'id': surface.z_data_generator.id,
                                'variables': [],
                                'math': surface.z_data_generator.math,
                            },
                        }

                        if surface.name:
                            surface_specs['name'] = surface.name
                        if surface.x_data_generator.name:
                            surface_specs['xDataGenerator']['name'] = \
                                surface.x_data_generator.name
                        if surface.y_data_generator.name:
                            surface_specs['yDataGenerator']['name'] = \
                                surface.y_data_generator.name
                        if surface.z_data_generator.name:
                            surface_specs['zDataGenerator']['name'] = \
                                surface.z_data_generator.name

                        sed_doc_output_specs['surfaces'].append(surface_specs)

                        if surface.x_scale != x_scale:
                            x_scale = None
                        if surface.y_scale != y_scale:
                            y_scale = None
                        if surface.z_scale != z_scale:
                            z_scale = None

                    sed_doc_output_specs['xScale'] = (
                        x_scale or AxisScale.linear).value
                    sed_doc_output_specs['yScale'] = (
                        y_scale or AxisScale.linear).value
                    sed_doc_output_specs['zScale'] = (
                        z_scale or AxisScale.linear).value

                else:
                    continue

                sed_doc_outputs_specs.append(sed_doc_output_specs)

            sed_doc_specs = {
                'level': sed_doc.level,
                'version': sed_doc.version,
                'models': [],
                'simulations': [],
                'tasks': [],
                'dataGenerators': [],
                'outputs': sed_doc_outputs_specs,
            }

            content_specs = {
                'location': {
                    'path': content.location,
                    'value': sed_doc_specs,
                },
                'format': content.format,
                'master': content.master,
            }
            contents_specs.append(content_specs)

    # cleanup temporary files
    shutil.rmtree(temp_dirname)

    # format response
    response = {
        'contents': contents_specs
    }

    # return reponse
    return response


def create_combine_archive(sed_doc_specs, model_files):
    ''' Create a COMBINE/OMEX archive for a model with a SED-ML document
    according to a particular specification.

    Args:
        sed_doc_specs (``SedDocument``): specifications of the desired SED
            document
        model_files (:obj:`list` of :obj:`werkzeug.FileStorage`): model file
            (e.g., SBML file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response with COMBINE/OMEX
            archive
    '''
    # create temporary working directory
    temp_dirname = tempfile.mkdtemp()

    # create temporary files for archive
    archive_dirname = os.path.join(temp_dirname, 'archive')
    archive_filename = os.path.join(temp_dirname, 'archive.omex')

    # initialize archive
    archive = CombineArchive()

    # add models to archive
    for model, model_file in zip(sed_doc_specs['models'], model_files):
        content = CombineArchiveContent(
            location=model['source'],
            format=None,
            master=False,
        )
        if re.match(ModelLanguagePattern.BNGL.value, model['langauage']):
            content.format = CombineArchiveContentFormat.BNGL
        elif re.match(ModelLanguagePattern.CellML.value, model['langauage']):
            content.format = CombineArchiveContentFormat.CellML
        elif re.match(ModelLanguagePattern.SBML.value, model['langauage']):
            content.format = CombineArchiveContentFormat.SBML
        else:
            msg = 'Model language `{}` is not supported'.format(
                model['langauage'])
            return connexion.problem(400, 'Unsupported model language', msg)

        shutil.copyfile(model_file.filename,
                        os.path.join(archive_dirname, model['source']))

        archive.contents.append(content)

    # generate SED-ML files and add to archive
    # TODO

    # package COMBINE/OMEX archive
    CombineArchiveWriter.run(archive, archive_dirname, archive_filename)

    # clean up temporary archive files
    shutil.rmtree(archive_dirname)

    @ flask.after_this_request
    def cleanup():
        os.remove(archive_filename)

    # return COMBINE/OMEX archive
    return flask.send_file(archive_filename,
                           mimetype='application/zip',
                           as_attachment=True,
                           attachment_filename='project.omex')


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
        # TODO: change last argument to `data_element.id`
        return '{}/{}/{}'.format(
            sed_doc_id,
            output.id,
            data_element.label or data_element.id
        )
    elif isinstance(data_element, DataGenerator):
        # TODO: change last argument to a unique id based on `data_element.id`
        return '{}/{}/{}'.format(
            sed_doc_id,
            output.id,
            data_element.name or data_element.id
        )
