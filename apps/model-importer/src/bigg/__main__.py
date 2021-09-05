#!/usr/bin/env python3
from Bio import Entrez
from biosimulators_utils.biosimulations.utils import submit_project_to_runbiosimulations
from biosimulators_utils.combine.data_model import CombineArchive, CombineArchiveContent, CombineArchiveContentFormat
from biosimulators_utils.combine.io import CombineArchiveWriter
from biosimulators_utils.config import Config
# from biosimulators_utils.omex_meta.data_model import OmexMetaOutputFormat
from biosimulators_utils.omex_meta.io import BiosimulationsOmexMetaWriter, BiosimulationsOmexMetaReader
# from biosimulators_utils.omex_meta.utils import build_omex_meta_file_for_model
from biosimulators_utils.ref.data_model import Reference, PubMedCentralOpenAccesGraphic  # noqa: F401
from biosimulators_utils.ref.utils import get_reference, get_pubmed_central_open_access_graphics
from biosimulators_utils.sedml.data_model import (
    SedDocument, Model, ModelLanguage, SteadyStateSimulation,
    Task, DataGenerator, Report, DataSet)
from biosimulators_utils.sedml.io import SedmlSimulationWriter
from biosimulators_utils.sedml.model_utils import get_parameters_variables_for_simulation
from biosimulators_utils.viz.vega.escher import escher_to_vega
from biosimulators_utils.warnings import BioSimulatorsWarning
import argparse
import biosimulators_cobrapy
import datetime
import dateutil.parser
import os
import requests_cache
import shutil
import tempfile
import time
import warnings
import yaml

SOURCE_DIRNAME = os.path.join(os.path.dirname(__file__), 'source')
SOURCE_MODELS_DIRNAME = os.path.join(SOURCE_DIRNAME, 'models')
SOURCE_VISUALIZATIONS_DIRNAME = os.path.join(SOURCE_DIRNAME, 'visualizations')
SOURCE_THUMBNAILS_DIRNAME = os.path.join(SOURCE_DIRNAME, 'thumbnails')
SOURCE_LICENSE_FILENAME = os.path.join(SOURCE_DIRNAME, 'LICENSE')

FINAL_DIRNAME = os.path.join(os.path.dirname(__file__), 'final')
FINAL_VISUALIZATIONS_DIRNAME = os.path.join(FINAL_DIRNAME, 'visualizations')
FINAL_METADATA_DIRNAME = os.path.join(FINAL_DIRNAME, 'metadata')
FINAL_PROJECTS_DIRNAME = os.path.join(FINAL_DIRNAME, 'projects')
FINAL_SIMULATION_RESULTS_DIRNAME = os.path.join(FINAL_DIRNAME, 'simulation-results')

STATUS_FILENAME = os.path.join(os.path.dirname(__file__), 'status.yml')
ISSUES_FILENAME = os.path.join(os.path.dirname(__file__), 'issues.yml')
SOURCE_API_ENDPOINT = 'http://bigg.ucsd.edu/api/v2'
SOURCE_MODEL_FILES_ENDPOINT = 'http://bigg.ucsd.edu/static'
SOURCE_MAP_FILE_ENDPOINT = 'http://bigg.ucsd.edu/escher_map_json'

Entrez.email = 'biosimulators.daemon@gmail.com'

SOURCE_SESSION = requests_cache.CachedSession(
    os.path.join(SOURCE_DIRNAME, 'source'),
    expire_after=datetime.timedelta(4 * 7))
CROSS_REF_SESSION = requests_cache.CachedSession(
    os.path.join(SOURCE_DIRNAME, 'crossref'),
    expire_after=datetime.timedelta(4 * 7))
PUBMED_CENTRAL_OPEN_ACESS_SESSION = requests_cache.CachedSession(
    os.path.join(SOURCE_DIRNAME, 'pubmed-central-open-access'),
    expire_after=datetime.timedelta(4 * 7))

CURATORS_FILENAME = os.path.join(os.path.dirname(__file__), 'curators.yml')
with open(CURATORS_FILENAME, 'r') as file:
    CURATORS = yaml.load(file, Loader=yaml.Loader)


def get_models():
    """ Get a list of the models in the source database

    Returns:
        :obj:`list` of :obj:`dict`: models
    """
    response = SOURCE_SESSION.get(SOURCE_API_ENDPOINT + '/models')
    response.raise_for_status()
    models = response.json()['results']
    models.sort(key=lambda model: model['bigg_id'])
    return models


def get_model_details(model):
    """ Get the details of a model from the source database and download the associated files

    Args:
        model (:obj:`dict`): model

    Returns:
        :obj:`dict`: detailed information about the model
    """
    # get information about the model
    response = SOURCE_SESSION.get(SOURCE_API_ENDPOINT + '/models/' + model['bigg_id'])
    response.raise_for_status()
    model_detail = response.json()

    # download the file for the model
    model_filename = os.path.join(SOURCE_MODELS_DIRNAME, model['bigg_id'] + '.xml')
    if not os.path.isfile(model_filename):
        response = SOURCE_SESSION.get(SOURCE_MODEL_FILES_ENDPOINT + '/models/{}.xml'.format(model['bigg_id']))
        response.raise_for_status()
        with open(model_filename, 'wb') as file:
            file.write(response.content)

    # download flux map visualizations associated with the model
    for escher_map in model_detail['escher_maps']:
        escher_filename = os.path.join(SOURCE_VISUALIZATIONS_DIRNAME, escher_map['map_name'] + '.json')
        if not os.path.isfile(escher_filename):
            response = SOURCE_SESSION.get(SOURCE_MAP_FILE_ENDPOINT + '/' + escher_map['map_name'])
            response.raise_for_status()
            with open(escher_filename, 'wb') as file:
                file.write(response.content)

    # return the details of the model
    return model_detail


def get_metadata_for_model(model_detail):
    """ Get additional metadata about a model

    * NCBI Taxonomy id of the organism
    * PubMed id, PubMed Central id and DOI for the reference
    * Open access figures for the reference

    Args:
        model_detail (:obj:`dict`): information about a model

    Returns:
        :obj:`tuple`:

            * :obj:`dict`: NCBI taxonomy identifier and name
            * :obj:`Reference`: structured information about the reference
            * :obj:`list` of :obj:`PubMedCentralOpenAccesGraphic`: figures of the reference
    """
    # delay to prevent overloading NCBI servers
    time.sleep(0.5)

    # NCBI id for organism
    handle = Entrez.esearch(db="nucleotide", term='{}[Assembly] OR {}[Primary Accession]'.format(
        model_detail['genome_name'], model_detail['genome_name']), retmax=1, retmode="xml")
    record = Entrez.read(handle)
    handle.close()
    if len(record["IdList"]) > 0:
        nucleotide_id = record["IdList"][0]

        handle = Entrez.esummary(db="nucleotide", id=nucleotide_id, retmode="xml")
        records = list(Entrez.parse(handle))
        handle.close()
        assert len(records) == 1

        taxon_id = records[0]['TaxId'].real

    else:
        handle = Entrez.esearch(db="assembly", term='{}'.format(
            model_detail['genome_name']), retmax=1, retmode="xml")
        record = Entrez.read(handle)
        handle.close()
        if len(record["IdList"]) == 0:
            raise ValueError('Genome assembly `{}` could not be found for model `{}`'.format(
                model_detail['genome_name'], model_detail['model_bigg_id']))

        assembly_id = record["IdList"][0]

        handle = Entrez.esummary(db="assembly", id=assembly_id, retmode="xml")
        record = Entrez.read(handle)['DocumentSummarySet']['DocumentSummary'][0]
        handle.close()

        taxon_id = int(record['SpeciesTaxid'])

    handle = Entrez.esummary(db="taxonomy", id=taxon_id, retmode="xml")
    record = Entrez.read(handle)
    assert len(record) == 1
    handle.close()

    taxon = {
        'id': taxon_id,
        'name': record[0]['ScientificName'],
    }

    # Citation information for the associated publication
    reference = get_reference(
        model_detail['reference_id'] or None if model_detail['reference_type'] == 'pmid' else None,
        model_detail['reference_id'] or None if model_detail['reference_type'] == 'doi' else None,
        cross_ref_session=CROSS_REF_SESSION,
    )

    # Figures for the associated publication from open-access subset of PubMed Central
    if reference and reference.pubmed_central_id:
        thumbnails = get_pubmed_central_open_access_graphics(
            reference.pubmed_central_id,
            os.path.join(SOURCE_THUMBNAILS_DIRNAME, reference.pubmed_central_id),
            session=PUBMED_CENTRAL_OPEN_ACESS_SESSION,
        )
    else:
        thumbnails = []

    return (taxon, reference, thumbnails)


def export_project_metadata_for_model_to_omex_metadata(model_detail, taxon, reference, thumbnails, metadata_filename):
    """ Export metadata about a model to an OMEX metadata RDF-XML file

    Args:
        model_detail (:obj:`str`): information about the model
        taxon (:obj:`dict`): NCBI taxonomy identifier and name
        reference (:obj:`Reference`): structured information about the reference
        thumbnails (:obj:`list` of :obj:`PubMedCentralOpenAccesGraphic`): figures of the reference
        metadata_filename (:obj:`str`): path to save metadata
    """
    created = reference.date
    last_updated = dateutil.parser.parse(model_detail['last_updated'])
    metadata = [{
        "uri": '.',
        'title': model_detail['model_bigg_id'],
        'abstract': 'Flux balance analysis model of the metabolism of {}.'.format(taxon['name']),
        'keywords': [
            'metabolism',
            'BiGG',
        ],
        'description': None,
        'taxa': [
            {
                'uri': 'http://identifiers.org/taxonomy:{}'.format(taxon['id']),
                'label': taxon['name'],
            },
        ],
        'encodes': [
            {
                'uri': 'http://identifiers.org/GO:0008152',
                'label': 'metabolic process',
            },
        ],
        'thumbnails': [reference.pubmed_central_id + '-' + os.path.basename(thumbnail.id) + '.jpg' for thumbnail in thumbnails],
        'sources': [],
        'predecessors': [],
        'successors': [],
        'see_also': [],
        'creators': [
            {
                'uri': None,
                'label': author,
            } for author in reference.authors
        ],
        'contributors': CURATORS,
        'identifiers': [
            {
                'uri': 'http://identifiers.org/bigg.model:{}'.format(model_detail['model_bigg_id']),
                'label': 'bigg.model:{}'.format(model_detail['model_bigg_id']),
            },
        ],
        'citations': [
            {
                'uri': (
                    'http://identifiers.org/doi:' + reference.doi
                    if reference.doi else
                    'http://identifiers.org/pubmed:' + reference.pubmed_id
                ),
                'label': reference.get_citation(),
            },
        ],
        'license': {
            'uri': 'http://bigg.ucsd.edu/license',
            'label': 'BiGG',
        },
        'funders': [],
        'created': created,
        'modified': [
            '{}-{:02d}-{:02d}'.format(last_updated.year, last_updated.month, last_updated.day),
        ],
        'other': [],
    }]
    BiosimulationsOmexMetaWriter().run(metadata, metadata_filename)
    _, errors, warnings = BiosimulationsOmexMetaReader().run(metadata_filename)
    assert not errors


def build_combine_archive_for_model(model_filename, archive_filename, extra_contents):
    params, sims, vars = get_parameters_variables_for_simulation(model_filename, ModelLanguage.SBML, SteadyStateSimulation, native_ids=True)

    obj_vars = list(filter(lambda var: var.target.startswith('/sbml:sbml/sbml:model/fbc:listOfObjectives/'), vars))
    rxn_flux_vars = list(filter(lambda var: var.target.startswith('/sbml:sbml/sbml:model/sbml:listOfReactions/'), vars))

    sedml_doc = SedDocument()
    model = Model(
        id='model',
        source=os.path.basename(model_filename),
        language=ModelLanguage.SBML.value,
        changes=params,
    )
    sedml_doc.models.append(model)
    sim = sims[0]
    sedml_doc.simulations.append(sim)

    task = Task(
        id='task',
        model=model,
        simulation=sim,
    )
    sedml_doc.tasks.append(task)

    report = Report(
        id='objective',
        name='Objective',
    )
    sedml_doc.outputs.append(report)
    for var in obj_vars:
        var_id = var.id
        var_name = var.name

        var.id = 'variable_' + var_id
        var.name = None

        var.task = task
        data_gen = DataGenerator(
            id='data_generator_{}'.format(var_id),
            variables=[var],
            math=var.id,
        )
        sedml_doc.data_generators.append(data_gen)
        report.data_sets.append(DataSet(
            id=var_id,
            label=var_id,
            name=var_name,
            data_generator=data_gen,
        ))

    report = Report(
        id='reaction_fluxes',
        name='Reaction fluxes',
    )
    sedml_doc.outputs.append(report)
    for var in rxn_flux_vars:
        var_id = var.id
        var_name = var.name

        var.id = 'variable_' + var_id
        var.name = None

        var.task = task
        data_gen = DataGenerator(
            id='data_generator_{}'.format(var_id),
            variables=[var],
            math=var.id,
        )
        sedml_doc.data_generators.append(data_gen)
        report.data_sets.append(DataSet(
            id=var_id,
            label=var_id,
            name=var_name if len(rxn_flux_vars) < 4000 else None,
            data_generator=data_gen,
        ))

    # make temporary directory for archive
    archive_dirname = tempfile.mkdtemp()
    shutil.copyfile(model_filename, os.path.join(archive_dirname, os.path.basename(model_filename)))

    SedmlSimulationWriter().run(sedml_doc, os.path.join(archive_dirname, 'simulation.sedml'))

    # form a description of the archive
    archive = CombineArchive()
    archive.contents.append(CombineArchiveContent(
        location=os.path.basename(model_filename),
        format=CombineArchiveContentFormat.SBML.value,
    ))
    archive.contents.append(CombineArchiveContent(
        location='simulation.sedml',
        format=CombineArchiveContentFormat.SED_ML.value,
    ))
    for local_path, extra_content in extra_contents.items():
        shutil.copyfile(local_path, os.path.join(archive_dirname, extra_content.location))
        archive.contents.append(extra_content)

    # save archive to file
    CombineArchiveWriter().run(archive, archive_dirname, archive_filename)

    # clean up temporary directory for archive
    shutil.rmtree(archive_dirname)


def run(max_models=None, dry_run=False):
    """ Download the source database, convert into COMBINE/OMEX archives, simulate the archives, and submit them to BioSimulations

    Args:
        max_models (:obj:`int`, optional): maximum number of models to download, convert, execute, and submit
        dry_run (:obj:`bool`, optional): whether to submit models to BioSimulations or not
    """

    # create directories for source files, thumbnails, projects, and simulation results
    if not os.path.isdir(SOURCE_DIRNAME):
        os.mkdir(SOURCE_DIRNAME)
    if not os.path.isdir(SOURCE_MODELS_DIRNAME):
        os.mkdir(SOURCE_MODELS_DIRNAME)
    if not os.path.isdir(SOURCE_VISUALIZATIONS_DIRNAME):
        os.mkdir(SOURCE_VISUALIZATIONS_DIRNAME)
    if not os.path.isdir(SOURCE_THUMBNAILS_DIRNAME):
        os.mkdir(SOURCE_THUMBNAILS_DIRNAME)

    if not os.path.isdir(FINAL_DIRNAME):
        os.mkdir(FINAL_DIRNAME)
    if not os.path.isdir(FINAL_VISUALIZATIONS_DIRNAME):
        os.mkdir(FINAL_VISUALIZATIONS_DIRNAME)
    if not os.path.isdir(FINAL_METADATA_DIRNAME):
        os.mkdir(FINAL_METADATA_DIRNAME)
    if not os.path.isdir(FINAL_PROJECTS_DIRNAME):
        os.mkdir(FINAL_PROJECTS_DIRNAME)
    if not os.path.isdir(FINAL_SIMULATION_RESULTS_DIRNAME):
        os.mkdir(FINAL_SIMULATION_RESULTS_DIRNAME)

    # read import status file
    if os.path.isfile(STATUS_FILENAME):
        with open(STATUS_FILENAME, 'r') as file:
            status = yaml.load(file, Loader=yaml.Loader)
    else:
        status = {}

    # read import issues file
    if os.path.isfile(ISSUES_FILENAME):
        with open(ISSUES_FILENAME, 'r') as file:
            issues = yaml.load(file, Loader=yaml.Loader)
    else:
        issues = {}

    # get a list of all models available in the source database
    models = get_models()

    model_details = []
    update_times = {}
    for i_model, model in enumerate(models):
        print('Retrieving {} of {}: {} ...'.format(i_model + 1, len(models), model['bigg_id']))

        # update status
        update_times[model['bigg_id']] = datetime.datetime.utcnow()

        # get the details of the model and download it from the source database
        model_detail = get_model_details(model)
        model_details.append(model_detail)
    models = model_details

    # filter out models that don't need to be imported because they've already been imported and haven't been updated
    models = list(filter(
        lambda model:
        (
            model['model_bigg_id'] not in status
            or (
                (dateutil.parser.parse(model['last_updated']) + datetime.timedelta(1))
                > dateutil.parser.parse(status[model['model_bigg_id']]['updated'])
            )
        ),
        models
    ))

    # filter out models with issues
    models = list(filter(lambda model: model['model_bigg_id'] not in issues, models))

    # limit the number of models to import
    models = models[0:max_models]

    # download models, convert them to COMBINE/OMEX archives, simulate them, and deposit them to the BioSimulations database
    for i_model, model in enumerate(models):
        model_filename = os.path.join(SOURCE_MODELS_DIRNAME, model['model_bigg_id'] + '.xml')

        # convert Escher map to Vega
        for escher_map in model['escher_maps']:
            escher_filename = os.path.join(SOURCE_VISUALIZATIONS_DIRNAME, escher_map['map_name'] + '.json')
            vega_filename = os.path.join(FINAL_VISUALIZATIONS_DIRNAME, escher_map['map_name'] + '.json')
            if not os.path.isfile(vega_filename):
                reaction_fluxes_data_set = {
                    'sedmlUri': ['simulation.sedml', 'reaction_fluxes'],
                }
                escher_to_vega(reaction_fluxes_data_set, escher_filename, vega_filename)

        # get additional metadata about the model
        print('Getting metadata for {} of {}: {}'.format(i_model + 1, len(models), model['model_bigg_id']))
        taxon, reference, thumbnails = get_metadata_for_model(model)

        # export metadata to RDF
        print('Exporting project metadata for {} of {}: {}'.format(i_model + 1, len(models), model['model_bigg_id']))
        project_metadata_filename = os.path.join(FINAL_METADATA_DIRNAME, model['model_bigg_id'] + '.rdf')
        export_project_metadata_for_model_to_omex_metadata(model, taxon, reference, thumbnails, project_metadata_filename)

        # print('Exporting model metadata for {} of {}: {}'.format(i_model + 1, len(models), model['model_bigg_id']))
        # model_metadata_filename = os.path.join(FINAL_METADATA_DIRNAME, model['model_bigg_id'] + '-omex-metadata.rdf')
        # build_omex_meta_file_for_model(model_filename, model_metadata_filename, metadata_format=OmexMetaOutputFormat.rdfxml_abbrev)

        # package model into COMBINE/OMEX archive
        print('Converting model {} of {}: {} ...'.format(i_model + 1, len(models), model['model_bigg_id']))

        project_filename = os.path.join(FINAL_PROJECTS_DIRNAME, model['model_bigg_id'] + '.omex')

        extra_contents = {}
        extra_contents[project_metadata_filename] = CombineArchiveContent(
            location='metadata.rdf',
            format=CombineArchiveContentFormat.OMEX_METADATA,
        )
        # extra_contents[model_metadata_filename] = CombineArchiveContent(
        #     location=model['model_bigg_id'] + '.rdf',
        #     format=CombineArchiveContentFormat.OMEX_METADATA,
        # )
        extra_contents[SOURCE_LICENSE_FILENAME] = CombineArchiveContent(
            location='LICENSE',
            format=CombineArchiveContentFormat.TEXT,
        )
        for escher_map in model['escher_maps']:
            escher_filename = os.path.join(SOURCE_VISUALIZATIONS_DIRNAME, escher_map['map_name'] + '.json')
            vega_filename = os.path.join(FINAL_VISUALIZATIONS_DIRNAME, escher_map['map_name'] + '.json')
            extra_contents[escher_filename] = CombineArchiveContent(
                location=escher_map['map_name'] + '.escher.json',
                format=CombineArchiveContentFormat.Escher,
            )
            extra_contents[vega_filename] = CombineArchiveContent(
                location=escher_map['map_name'] + '.vega.json',
                format=CombineArchiveContentFormat.Vega,
            )
        for thumbnail in thumbnails:
            extra_contents[thumbnail.filename] = CombineArchiveContent(
                location=reference.pubmed_central_id + '-' + os.path.basename(thumbnail.id) + '.jpg',
                format=CombineArchiveContentFormat.JPEG,
            )

        build_combine_archive_for_model(model_filename, project_filename, extra_contents=extra_contents)

        # simulate COMBINE/OMEX archives
        print('Simulating model {} of {}: {} ...'.format(i_model + 1, len(models), model['model_bigg_id']))

        project_filename = os.path.join(FINAL_PROJECTS_DIRNAME, model['model_bigg_id'] + '.omex')
        out_dirname = os.path.join(FINAL_SIMULATION_RESULTS_DIRNAME, model['model_bigg_id'])
        config = Config(COLLECT_COMBINE_ARCHIVE_RESULTS=True)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", BioSimulatorsWarning)
            results, log = biosimulators_cobrapy.exec_sedml_docs_in_combine_archive(project_filename, out_dirname, config=config)
        if log.exception:
            print('Simulation of `{}` failed'.format(model['model_bigg_id']))
            raise log.exception
        objective = results['simulation.sedml']['objective']['obj'].tolist()
        print('  {}: Objective: {}'.format(model['model_bigg_id'], objective))
        duration = log.duration

        # submit COMBINE/OMEX archive to BioSimulations
        if not dry_run:
            name = model['model_bigg_id']
            runbiosimulations_id = submit_project_to_runbiosimulations(name, project_filename, 'cobrapy')
        else:
            runbiosimulations_id = None

        # output status
        status[model['model_bigg_id']] = {
            'created': status.get(model['model_bigg_id'], {}).get('created', str(update_times[model['model_bigg_id']])),
            'updated': str(update_times[model['model_bigg_id']]),
            'objective': objective,
            'duration': duration,
            'runbiosimulationsId': runbiosimulations_id,
        }
        with open(STATUS_FILENAME, 'w') as file:
            file.write(yaml.dump(status))


def main():
    parser = argparse.ArgumentParser(description='Import models from BiGG into BioSimulations')
    parser.add_argument('--max-models', type=int, default=None,
                        help='Maximum number of models to import.')
    parser.add_argument('--dry-run', action='store_true',
                        help='If set, do not submit projects to runBioSimulations.')

    args = parser.parse_args()

    run(max_models=args.max_models, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
