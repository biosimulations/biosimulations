from ...exceptions import BadRequestException
from ...utils import get_temp_dir, make_validation_report
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.config import Config
from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema, BIOSIMULATIONS_PREDICATE_TYPES
from biosimulators_utils.omex_meta.io import read_omex_meta_files_for_archive
import os
import rdflib.term
import requests
import requests.exceptions
import shutil


def handler_biosimulations(body, file=None):
    ''' Get the metadata about a COMBINE/OMEX archive and its contents in BioSimulations' schema

    Args:
        body (:obj:`dict`): dictionary in schema ``GetCombineArchiveMetadataFileOrUrl`` with keys

            * ``url`` whose value has schema ``Url``
              with the URL for a COMBINE/OMEX archive
            * ``omexMetadataFormat` whose value is a value of :obj:`OmexMetadataInputFormat`

    Returns:
        :obj:`list` of ``BioSimulationsCombineArchiveLocationMetadata``:
            metadata about a COMBINE/OMEX archive and its contents
    '''
    el_metadatas = handler(body, file=file, omexMetadataSchema=OmexMetadataSchema.biosimulations.value)

    for el_metadata in el_metadatas:
        el_metadata['_type'] = 'BioSimulationsCombineArchiveElementMetadata'

        for predicate_type in BIOSIMULATIONS_PREDICATE_TYPES.values():
            if predicate_type['has_uri'] and predicate_type['has_label']:
                if predicate_type['multiple_allowed']:
                    objects = el_metadata[predicate_type['attribute']]
                else:
                    if el_metadata[predicate_type['attribute']] is None:
                        objects = []
                    else:
                        objects = [el_metadata[predicate_type['attribute']]]

                for object in objects:
                    object['_type'] = 'BioSimulationsMetadataValue'

        for other in el_metadata['other']:
            other['_type'] = 'BioSimulationsCustomMetadata'
            if other.get('attribute', None):
                other['attribute']['_type'] = 'BioSimulationsMetadataValue'
            if other.get('value', None):
                other['value']['_type'] = 'BioSimulationsMetadataValue'

        el_metadata['combineArchiveUri'] = el_metadata.pop('combine_archive_uri')
        el_metadata['seeAlso'] = el_metadata.pop('see_also')

    return el_metadatas


def handler_rdf_triples(body, file=None):
    ''' Get the metadata about a COMBINE/OMEX archive and its contents as a list of RDF triples

    Args:
        body (:obj:`dict`): dictionary in schema ``GetCombineArchiveMetadataFileOrUrl`` with keys

            * ``url`` whose value has schema ``Url``
              with the URL for a COMBINE/OMEX archive
            * ``omexMetadataFormat` whose value is a value of :obj:`OmexMetadataInputFormat`

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file

    Returns:
        :obj:`list` of ``RdfTriple``: metadata about a COMBINE/OMEX archive
            and its contents
    '''
    triples = handler(body, file=file,
                      omexMetadataSchema=OmexMetadataSchema.rdf_triples.value)

    triples_json = []
    for triple in triples:
        triples_json.append({
            '_type': 'RdfTriple',
            'subject': _convert_rdf_node_to_json(triple.subject),
            'predicate': _convert_rdf_node_to_json(triple.predicate),
            'object': _convert_rdf_node_to_json(triple.object),
        })

    return triples_json


def handler(body, file=None,
            omexMetadataSchema=OmexMetadataSchema.biosimulations.value):
    ''' Get the metadata about a COMBINE/OMEX archive and its contents

    Args:
        dictionary in schema ``GetCombineArchiveMetadataFileOrUrl`` with keys

            * ``url`` whose value has schema ``Url``
              with the URL for a COMBINE/OMEX archive
            * ``omexMetadataFormat` whose value is a value of :obj:`OmexMetadataInputFormat`

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file
        omexMetadataSchema (:obj:`str`, optional): schema for validating the OMEX Metadata files

    Returns:
        :obj:`list` of ``BioSimulationsCombineArchiveLocationMetadata``
            or ``RdfTriple``: metadata about a COMBINE/OMEX archive
            and its contents
    '''
    try:
        omexMetadataInputFormat = OmexMetadataInputFormat(body.get('omexMetadataFormat', 'rdfxml'))
    except ValueError as exception:
        raise BadRequestException(title='`omexMetadataFormat` must be a recognized format.', exception=exception)

    try:
        omexMetadataSchema = OmexMetadataSchema(omexMetadataSchema)
    except ValueError as exception:
        raise BadRequestException(title='`omexMetadataSchema` must be a recognized schema.', exception=exception)

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
    archive_dirname = os.path.join(temp_dirname, 'archive')
    try:
        archive = CombineArchiveReader().run(archive_filename, archive_dirname)
    except Exception as exception:
        # return exception
        raise BadRequestException(
            title='`{}` is not a valid COMBINE/OMEX archive'.format(archive_url if archive_url else archive_file.filename),
            instance=exception,
        )

    config = Config(
        OMEX_METADATA_INPUT_FORMAT=omexMetadataInputFormat,
        OMEX_METADATA_SCHEMA=omexMetadataSchema,
    )

    metadata, errors, warnings = read_omex_meta_files_for_archive(archive, archive_dirname, config=config)
    shutil.rmtree(archive_dirname)

    if errors:
        raise BadRequestException(
            title='The metadata for the COMBINE/OMEX archive is not valid.',
            instance=ValueError(),
            validation_report=make_validation_report(errors, warnings, filenames=[archive_filename]),
        )

    # return response
    return metadata


def _convert_rdf_node_to_json(node):
    """ Convert an RDF node to the ``RdfNode`` schema

    Args:
        node (:obj:`rdflib.term.BNode`, :obj:`rdflib.term.Literal`, or :obj:`rdflib.term.URIRef`): RDF triple

    Returns:
        :obj:`dict` in ``RdfNode`` schema
    """
    if isinstance(node, rdflib.term.BNode):
        _type = 'RdfBlankNode'
    elif isinstance(node, rdflib.term.Literal):
        _type = 'RdfLiteralNode'
    elif isinstance(node, rdflib.term.URIRef):
        _type = 'RdfUriNode'
    else:
        raise BadRequestException(
            title='`{}` nodes are not supported.'.format(node.__class__.__name__),
            instance=NotImplementedError(),
        )

    return {
        '_type': _type,
        'value': str(node),
    }
