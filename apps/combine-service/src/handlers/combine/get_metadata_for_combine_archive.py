from ...exceptions import BadRequestException
from ...utils import get_temp_dir
from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.omex_meta.data_model import OmexMetaSchema, BIOSIMULATIONS_PREDICATE_TYPES
from biosimulators_utils.omex_meta.io import read_omex_meta_files_for_archive
from biosimulators_utils.utils.core import flatten_nested_list_of_strings
import os
import rdflib.term
import requests
import requests.exceptions
import shutil


def handler_biosimulations(body, file=None):
    ''' Get the metadata about a COMBINE/OMEX archive and its contents in BioSimulations' schema

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value has schema ``#/components/schemas/Url``
              with the URL for a COMBINE/OMEX archive

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file

    Returns:
        :obj:`list` of ``#/components/schemas/BioSimulationsCombineArchiveLocationMetadata``:
            metadata about a COMBINE/OMEX archive and its contents
    '''
    el_metadatas = handler(body, file=file, schema=OmexMetaSchema.biosimulations)

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

    return el_metadatas


def handler_rdf_triples(body, file=None):
    ''' Get the metadata about a COMBINE/OMEX archive and its contents as a list of RDF triples

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value has schema ``#/components/schemas/Url``
              with the URL for a COMBINE/OMEX archive

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file

    Returns:
        :obj:`list` of ``#/components/schemas/RdfTriple``: metadata about a COMBINE/OMEX archive
            and its contents
    '''
    triples = handler(body, file=file, schema=OmexMetaSchema.rdf_triples)

    triples_json = []
    for triple in triples:
        triples_json.append({
            '_type': 'RdfTriple',
            'subject': _convert_rdf_node_to_json(triple.subject),
            'predicate': _convert_rdf_node_to_json(triple.predicate),
            'object': _convert_rdf_node_to_json(triple.object),
        })

    return triples_json


def handler(body, file=None, schema=OmexMetaSchema.biosimulations):
    ''' Get the metadata about a COMBINE/OMEX archive and its contents

    Args:
        body (:obj:`dict`): dictionary with keys

            * ``url`` whose value has schema ``#/components/schemas/Url``
              with the URL for a COMBINE/OMEX archive

        file (:obj:`werkzeug.datastructures.FileStorage`, optional): COMBINE/OMEX archive file
        schema (:obj:`OmexMetaSchema`, optional): schema to encode the metadata

    Returns:
        :obj:`list` of ``#/components/schemas/BioSimulationsCombineArchiveLocationMetadata``
            or ``#/components/schemas/RdfTriple``: metadata about a COMBINE/OMEX archive
            and its contents
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
    try:
        archive = CombineArchiveReader().run(archive_filename, archive_dirname)
    except Exception as exception:
        # return exception
        raise BadRequestException(
            title='`{}` is not a valid COMBINE/OMEX archive'.format(archive_url if archive_url else archive_file.filename),
            instance=exception,
        )

    metadata, errors, warnings = read_omex_meta_files_for_archive(archive, archive_dirname, schema=schema)
    shutil.rmtree(archive_dirname)

    if errors:
        msg = 'The OMEX Meta files for the COMBINE archive are invalid:\n{}'.format(
            flatten_nested_list_of_strings(errors))
        raise BadRequestException(
            title=msg,
            instance=ValueError())

    # return response
    return metadata


def _convert_rdf_node_to_json(node):
    """ Convert an RDF node to the ``#/components/schemas/RdfNode`` schema

    Args:
        node (:obj:`rdflib.term.BNode`, :obj:`rdflib.term.Literal`, or :obj:`rdflib.term.URIRef`): RDF triple

    Returns:
        :obj:`dict` in ``#/components/schemas/RdfNode`` schema
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
