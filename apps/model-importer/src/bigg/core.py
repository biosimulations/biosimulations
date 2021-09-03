from Bio import Entrez
from biosimulators_utils.config import Config
from biosimulators_utils.sedml.data_model import ModelLanguage, SteadyStateSimulation
from biosimulators_utils.sedml.model_utils import build_combine_archive_for_model
from biosimulators_utils.warnings import BioSimulatorsWarning
import biosimulators_cobrapy
import dateutil.parser
import os
import requests_cache
import warnings

MODELS_DIR = 'models'
PROJECTS_DIR = 'projects'
SIMULATION_RESULTS_DIR = 'simulation-results'
MODEL_SKIP_SIMULATIONS = [
    'RECON1',
    'Recon3D',
]


def get_models(models_dir, max_models=None):
    """ Download the models in the BiGG database

    Args:
        max_models (:obj:`int`, optional): maximum number of models to download, convert and execute

    Returns:
        :obj:`list` of :obj:`dict`: models
    """
    # get list of models
    session = requests_cache.CachedSession('bigg')
    response = session.get('http://bigg.ucsd.edu/api/v2/models')
    response.raise_for_status()
    models = response.json()['results']
    models.sort(key=lambda model: model['bigg_id'])

    # get models and their metadata
    model_details = []
    for i_model, model in enumerate(models[0:max_models]):
        print('{} of {}'.format(i_model + 1, len(models)))

        # get information about the model
        response = session.get('http://bigg.ucsd.edu/api/v2/models/' + model['bigg_id'])
        response.raise_for_status()
        model_detail = response.json()
        model_details.append(model_detail)

        # download the SBML file for the model
        model_filename = os.path.join(models_dir, model['bigg_id'] + '.xml')
        if not os.path.isfile(model_filename):
            response = session.get('http://bigg.ucsd.edu/static/models/{}.xml'.format(model['bigg_id']))
            response.raise_for_status()
            with open(model_filename, 'wb') as file:
                file.write(response.content)

        # download flux map visualizations associated with the model
        for model_detail in model_details:
            for map in model_detail['escher_maps']:
                visualization_filename = os.path.join(models_dir, model['bigg_id'] + '-' + map['map_name'] + '.json')
                if not os.path.isfile(visualization_filename):
                    response = session.get('http://bigg.ucsd.edu/escher_map_json/' + map['map_name'])
                    response.raise_for_status()
                    with open(visualization_filename, 'wb') as file:
                        file.write(response.content)

    # return list of models
    return model_details


def fetch_metadata_for_model(model):
    # NCBI id for organism
    handle = Entrez.esearch(db="nucleotide", term='{}[Assembly] OR {}[Primary Accession]'.format(
        model['genome_name'], model['genome_name']), retmax=1, retmode="xml")
    record = Entrez.read(handle)
    handle.close()
    nucleotide_id = record["IdList"][0]

    handle = Entrez.esummary(db="nucleotide", id=nucleotide_id, retmode="xml")
    records = list(Entrez.parse(handle))
    handle.close()
    assert len(records) == 1

    taxon_id = records[0]['TaxId'].real

    # Citation information for the associated publication
    model = {
        'reference_type': 'pmid',
        'reference_id': '15197165',
    }

    if model['reference_type'] == 'pmid':
        pmid = model['reference_id']
        handle = Entrez.esummary(db="pubmed", id=pmid, retmode="xml")
        records = list(Entrez.parse(handle))
        handle.close()
        assert len(records) == 1

        record = records[0]

        doi = record.get('DOI', None)

        author_list = record['AuthorList']
        title = record['Title']
        journal = record['FullJournalName']
        volume = record['Volume']
        issue = record['Issue']
        pages = record['Pages']
        year = dateutil.parser.parse(record['PubDate']).year
    elif model['reference_type'] == 'pmid':
        pmid = None
        doi = model['reference_id']
        author_list = None
        title = None
        journal = None
        volume = None
        issue = None
        pages = None
        year = None
    else:
        raise NotImplementedError('Reference type `{}` is not supported.'.format(model['reference_type']))

    if doi is not None:
        session = requests_cache.CachedSession('crossref')
        response = session.get('https://api.crossref.org/works/' + doi)
        response.raise_for_status()
        record = response.json()['message']

        if author_list is None:
            author_list = [author['given'] + ' ' + author['family'] for author in record['author']]
        if title is None:
            title = record['title'][0]
        journal = record['container-title'][0]
        volume = record['volume']
        issue = record.get('journal-issue', {}).get('issue', None)
        pages = record['page']
        year = record['published']['date-parts'][0][0]

    if len(author_list) > 1:
        authors = '{} & {}'.format(', '.join(author_list[0:-1]), author_list[-1])
    else:
        authors = author_list[0]

    citation = '{}. {}{} {}'.format(authors, title, '' if title[-1] in '.?' else '.', journal)
    if volume:
        citation += ' ' + volume
    if issue:
        citation += ', ' + issue
    if pages:
        citation += ': ' + pages
    citation += ' (' + str(year) + ')'

    # Figures for the associated publication from open-access subset of PubMed Central
    figures = []

    return (taxon_id, pmid, doi, citation, figures)


def export_metadata_for_model_to_rdf(model, metadata_filename):
    pass


def run(max_models=5):
    """ Download BiGG database, convert into COMBINE/OMEX archives, and simulate archives

    Args:
        max_models (:obj:`int`, optional): maximum number of models to download, convert and execute
    """

    # create directories for models, projects, and simulation results
    if not os.path.isdir(MODELS_DIR):
        os.mkdir(MODELS_DIR)
    if not os.path.isdir(PROJECTS_DIR):
        os.mkdir(PROJECTS_DIR)
    if not os.path.isdir(SIMULATION_RESULTS_DIR):
        os.mkdir(SIMULATION_RESULTS_DIR)

    # download models from BiGG
    models = get_models(MODELS_DIR, max_models=max_models)

    # convert each model to COMBINE/OMEX archive
    for i_model, model in enumerate(models[0:max_models]):
        print('Converting model {} of {} ...'.format(i_model + 1, len(models)))

        model_filename = os.path.join(MODELS_DIR, model['model_bigg_id'] + '.xml')
        metadata_filename = os.path.join(PROJECTS_DIR, model['model_bigg_id'] + '.rdf')
        project_filename = os.path.join(PROJECTS_DIR, model['model_bigg_id'] + '.omex')

        # fetch_metadata_for_model(model)
        # export_metadata_for_model_to_rdf(model, metadata_filename)

        if not os.path.isfile(project_filename):
            build_combine_archive_for_model(model_filename, ModelLanguage.SBML, SteadyStateSimulation, project_filename)

    # simulate COMBINE/OMEX archives
    for i_model, model in enumerate(models[0:max_models]):
        if model['model_bigg_id'] in MODEL_SKIP_SIMULATIONS:
            continue

        print('Simulating model {} of {} ...'.format(i_model + 1, len(models)))

        project_filename = os.path.join(PROJECTS_DIR, model['model_bigg_id'] + '.omex')
        out_dirname = os.path.join(SIMULATION_RESULTS_DIR, model['model_bigg_id'])
        config = Config(COLLECT_COMBINE_ARCHIVE_RESULTS=True)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", BioSimulatorsWarning)
            results, log = biosimulators_cobrapy.exec_sedml_docs_in_combine_archive(project_filename, out_dirname, config=config)
        if log.exception:
            raise log.exception
        objective_value = results['simulation.sedml']['report']['data_set_value_objective_obj']
        print('{}: Objective: {}'.format(model['model_bigg_id'], objective_value))
        executable = objective_value > 0


if __name__ == "__main__":
    run()
