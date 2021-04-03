from biosimulators_utils.combine.data_model import (CombineArchive, CombineArchiveContent,
                                                    CombineArchiveContentFormat, CombineArchiveContentFormatPattern)
from biosimulators_utils.combine.io import CombineArchiveReader, CombineArchiveWriter
from biosimulators_utils.sedml.data_model import ModelLanguagePattern, Report, Plot2D, Plot3D, AxisScale
from biosimulators_utils.sedml.io import SedmlSimulationReader
import flask
import os
import re
import requests
import shutil
import tempfile
import werkzeug  # noqa: F401
import werkzeug.wrappers.response  # noqa: F401


def get_sedml_output_specs_for_combine_archive(archive_url):
    """ Get the specifications of the SED plots in a COMBINE/OMEX archive

    Args:
        archive_url (:obj:`str`): URL for COMBINE archive

    Returns:
        ``CombineArchive``: specifications of the SED plots in a COMBINE/OMEX archive
    """

    # create temporary working directory
    temp_dirname = tempfile.mkdtemp()

    # get COMBINE/OMEX archive
    response = requests.get(archive_url)
    response.raise_for_status()

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

        # re-raise exception
        raise

    # get specifications of SED outputs
    contents_specs = []

    for content in archive.contents:
        if content.format and re.match(CombineArchiveContentFormatPattern.SED_ML.value, content.format):
            sed_doc_filename = os.path.join(archive_dirname, content.location)
            sed_doc_id = os.path.relpath(archive_dirname, sed_doc_filename)
            try:
                sed_doc = SedmlSimulationReader().run(sed_doc_filename, validate_semantics=False)
            except Exception:
                continue

            sed_doc_outputs_specs = []
            for output in sed_doc.outputs:
                if isinstance(output, Report):
                    sed_doc_output_specs = {
                        '_type': 'SedReport',
                        'id': output.id,
                        'name': output.name,
                        'dataSets': [],
                    }
                    for data_set in output.data_sets:
                        sed_doc_output_specs['dataSets'].append({
                            'id': data_set.id,
                            'name': data_set.name,
                            'label': data_set.label,
                            'dataGenerator': {
                                '_resultsDataSetId': '{}/{}/{}'.format(
                                    sed_doc_id,
                                    output.id,
                                    data_set.label
                                ),  # TODO: change last argument to `data_set.id`
                                'id': data_set.data_generator.id,
                                'name': data_set.data_generator.name,
                                'variables': [],
                                'math': data_set.data_generator.math,
                            }
                        })

                elif isinstance(output, Plot2D):
                    sed_doc_output_specs = {
                        '_type': 'SedPlot2D',
                        'id': output.id,
                        'name': output.name,
                        'curves': [],
                        'xScale': None,
                        'yScale': None,
                    }

                    if output.curves:
                        x_scale = output.curves[0].x_scale
                        y_scale = output.curves[0].y_scale

                    for curve in output.curves:
                        sed_doc_output_specs['curves'].append({
                            'id': curve.id,
                            'name': curve.name,
                            'xDataGenerator': {
                                '_resultsDataSetId': '{}/{}/{}'.format(
                                    sed_doc_id,
                                    output.id,
                                    curve.x_data_generator.name or curve.x_data_generator.id
                                ),  # TODO: change last argument to a unique id based on `curve.x_data_generator.id`
                                'id': curve.x_data_generator.id,
                                'name': curve.x_data_generator.name,
                                'variables': [],
                                'math': curve.x_data_generator.math,
                            },
                            'yDataGenerator': {
                                '_resultsDataSetId': '{}/{}/{}'.format(
                                    sed_doc_id,
                                    output.id,
                                    curve.y_data_generator.name or curve.y_data_generator.id
                                ),  # TODO: change last argument to a unique id based on `curve.x_data_generator.id`
                                'id': curve.y_data_generator.id,
                                'name': curve.y_data_generator.name,
                                'variables': [],
                                'math': curve.y_data_generator.math,
                            },
                        })

                        if curve.x_scale != x_scale:
                            x_scale = None
                        if curve.y_scale != y_scale:
                            y_scale = None

                    sed_doc_output_specs['xScale'] = (x_scale or AxisScale.linear).value
                    sed_doc_output_specs['yScale'] = (y_scale or AxisScale.linear).value

                elif isinstance(output, Plot3D):
                    sed_doc_output_specs = {
                        '_type': 'SedPlot3D',
                        'id': output.id,
                        'name': output.name,
                        'surfaces': [],
                        'xScale': None,
                        'yScale': None,
                        'zScale': None,
                    }

                    if output.surfaces:
                        x_scale = output.surfaces[0].x_scale
                        y_scale = output.surfaces[0].y_scale
                        z_scale = output.surfaces[0].z_scale

                    for surface in output.surfaces:
                        sed_doc_output_specs['surfaces'].append({
                            'id': surface.id,
                            'name': surface.name,
                            'xDataGenerator': {
                                '_resultsDataSetId': '{}/{}/{}'.format(
                                    sed_doc_id,
                                    output.id,
                                    surface.x_data_generator.name or surface.x_data_generator.id
                                ),  # TODO: change last argument to a unique id based on `surface.x_data_generator.id`
                                'id': surface.x_data_generator.id,
                                'name': surface.x_data_generator.name,
                                'variables': [],
                                'math': surface.x_data_generator.math,
                            },
                            'yDataGenerator': {
                                '_resultsDataSetId': '{}/{}/{}'.format(
                                    sed_doc_id,
                                    output.id,
                                    surface.y_data_generator.name or surface.y_data_generator.id
                                ),  # TODO: change last argument to a unique id based on `surface.y_data_generator.id`
                                'id': surface.y_data_generator.id,
                                'name': surface.y_data_generator.name,
                                'variables': [],
                                'math': surface.y_data_generator.math,
                            },
                            'zDataGenerator': {
                                '_resultsDataSetId': '{}/{}/{}'.format(
                                    sed_doc_id,
                                    output.id,
                                    surface.z_data_generator.name or surface.z_data_generator.id
                                ),  # TODO: change last argument to a unique id based on `surface.z_data_generator.id`
                                'id': surface.z_data_generator.id,
                                'name': surface.z_data_generator.name,
                                'variables': [],
                                'math': surface.z_data_generator.math,
                            },
                        })

                        if curve.x_scale != x_scale:
                            x_scale = None
                        if curve.y_scale != y_scale:
                            y_scale = None
                        if curve.z_scale != z_scale:
                            z_scale = None

                    sed_doc_output_specs['xScale'] = (x_scale or AxisScale.linear).value
                    sed_doc_output_specs['yScale'] = (y_scale or AxisScale.linear).value
                    sed_doc_output_specs['zScale'] = (z_scale or AxisScale.linear).value

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

    # return specifications of SED outputs
    return {
        'contents': contents_specs
    }


def create_combine_archive(sed_doc_specs, model_files):
    """ Create a COMBINE/OMEX archive for a model with a SED-ML document according to a particular specification.

    Args:
        sed_doc_specs (``SedDocument``): specifications of the desired SED document
        model_files (:obj:`list` of :obj:`werkzeug.FileStorage`): model file (e.g., SBML file)

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response with COMBINE/OMEX archive
    """
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
            raise NotImplementedError('Model language `{}` is not supported'.format(model['langauage']))

        shutil.copyfile(model_file.filename, os.path.join(archive_dirname, model['source']))

        archive.contents.append(content)

    # generate SED-ML files and add to archive
    # TODO

    # package COMBINE/OMEX archive
    CombineArchiveWriter.run(archive, archive_dirname, archive_filename)

    # clean up temporary archive files
    shutil.rmtree(archive_dirname)

    @flask.after_this_request
    def cleanup():
        os.remove(archive_filename)

    # return COMBINE/OMEX archive
    return flask.send_file(archive_filename, mimetype='application/zip', as_attachment=True, attachment_filename='project.omex')
