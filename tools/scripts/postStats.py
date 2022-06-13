from loguru import logger
from numpy import histogram
import requests
import requests_cache


API_ENDPOINT = 'http://localhost:3333'


def getProjects():
    response = requests.get('https://api.biosimulations.org/projects')
    return response.json()


def getRunIds():
    projects = getProjects()
    runs = [project['simulationRun'] for project in projects]
    return runs


def getRun(runId):
    response = requests.get('https://api.biosimulations.org/runs/' + runId)
    return response.json()


def getRuns():
    runIds = getRunIds()
    runs = [getRun(runId) for runId in runIds]
    return runs


def getFilesForRun(runId):
    response = requests.get('https://api.biosimulations.org/files/' + runId)
    files = response.json()
    return files


def getFiles():
    runIds = getRunIds()
    files = [getFilesForRun(runId) for runId in runIds]
    return files


def getMetadata():
    runIds = getRunIds()
    metadata = [getMetadataForRun(runId) for runId in runIds]
    return metadata


def getSummaryForRun(runId):
    response = requests.get('https://api.biosimulations.org/runs/' + runId + '/summary')
    return response.json()


def getRunSummaries():
    ids = getRunIds()
    summaries = [getSummaryForRun(id) for id in ids]
    return summaries


def getProjectSummary(projectId):
    response = requests.get('https://api.biosimulations.org/projects/' + projectId + '/summary')
    return response.json()


def getProjectSummaries():
    projects = getProjects()
    projectIds = [project['id'] for project in projects]
    projectSummaries = [getProjectSummary(projectId) for projectId in projectIds]
    return projectSummaries


def getProjectOwners():
    summaries = getProjectSummaries()
    owner = [summary['owner'] for summary in summaries if summary.get("owner", None)]
    return owner


def getRun(runId):
    response = requests.get('https://api.biosimulations.org/runs/' + runId)
    return response.json()


def getMetadataForRun(runId):
    response = requests.get('https://api.biosimulations.org/metadata/' + runId)
    run = response.json()
    metadata = run['metadata']
    return metadata


def makeHistogram(items: list, sort=True):
    
    histogram = {}
    for item in items:
        key = str(item)
        print(key)
        if key in histogram.keys():
            histogram[key] += 1
        else:
            histogram[key] = 1
   
    if sort:
        histogram = sorted(histogram.items(), key=lambda x: x[1], reverse=True)
        labels = [item[0] for item in histogram]
        counts = [item[1] for item in histogram]
    else:
        labels = [item for item in histogram.keys()]
        counts = [item for item in histogram.values()]
    print(labels)
    print(counts)
    return histogram, labels, counts


def postStats(id, statsFunction):
    histogram, labels, values = statsFunction()
    data = {
        "id": id,
        "labels": labels,
        "values": values
    }
    response = requests.post(API_ENDPOINT + '/statistics', json=data)
    try:
        logger.info("Posting stats for " + id)
        response.raise_for_status()
        logger.success("Successfully posted stats for " + id)
    except requests.exceptions.HTTPError as err:
        if(response.status_code == 409):
            logger.warning("Stats already exist for " + id)
            response = requests.put(API_ENDPOINT + '/statistics/' + id, json=data)
            response.raise_for_status()
            logger.success("Updated stats for " + id)
        else:
            logger.error("Error posting stats for " + id)
            logger.trace(err)
            raise err


def getRunTaxon(runId):
    metadata = getMetadataForRun(runId)
    taxa = []
    for data in metadata:
        taxons = data['taxa']
        for taxon in taxons:
            taxon_label = taxon['label']
            taxon_label = taxon_label.split(' ')[0:2]
            taxon_label = ' '.join(taxon_label)
            taxa.append(taxon_label)
    if(len(taxa) == 0):
        taxa = ['None']
    return taxa


def getEncodesForRun(runId):

    metadata = getMetadataForRun(runId)
    processes = []
    for data in metadata:
        encodes = data['encodes']
        for process in encodes:
            processes.append(process['label'])

    return processes


def getEncodes():
    projects = getProjects()
    simulationRuns = [project['simulationRun'] for project in projects]
    encodes = [getEncodesForRun(simulationRun) for simulationRun in simulationRuns]
    # flatten the list of lists
    encodes = [item for sublist in encodes for item in sublist]

    # change all occurances of "I na,t"  or "I Sodium" to  "Sodium"
    encodes = [encodes.replace('I Na,t', 'Sodium') for encodes in encodes]
    encodes = [encodes.replace('I Sodium', 'Sodium') for encodes in encodes]

    # change all occurances of "I K" and "I Potassium" to "Potassium"
    encodes = [encodes.replace('I K', 'Potassium') for encodes in encodes]
    encodes = [encodes.replace('I Potassium', 'Potassium') for encodes in encodes]

    # change all occurances of "I Ca" and "I Calcium" to "Calcium"
    encodes = [encodes.replace('I Ca', 'Calcium') for encodes in encodes]
    encodes = [encodes.replace('I Calcium', 'Calcium') for encodes in encodes]

    # Change "Neuron or other electrically excitable cell" to "Neuron"
    encodes = [encodes.replace('Neuron or other electrically excitable cell', 'Neuron') for encodes in encodes]

    # Change any term that includes the word "neuron" anywhere to "Neuron"
    encodes = map(lambda x: 'Neuron' if 'neuron' in x else x, encodes)

    # Change all

    histogram, labels, counts = makeHistogram(encodes)
    return histogram, labels, counts


def getTaxons():
    projects = getProjects()
    taxons = []
    taxon_list = [getRunTaxon(project['simulationRun']) for project in projects]
    for taxon in taxon_list:
        if len(taxon) > 0:
            taxons.extend(taxon)
    taxons = filter(lambda taxon: taxon != 'None', taxons)
    histogram, labels, counts = makeHistogram(taxons)
    return histogram, labels, counts

def getSimulatorNameFromId(simulatorId):
    response = requests.get('https://api.biosimulators.org/simulators/' + simulatorId)
    return response.json()[0]['name']

def getSimulators():
    projects = getProjects()
    simulators = []
    runs = [project['simulationRun'] for project in projects]
    runs = [getRun(run) for run in runs]

    simulators = [run["simulator"] for run in runs]
    simulators = [getSimulatorNameFromId(simulator) for simulator in simulators]
    histogram, labels, counts = makeHistogram(simulators)
    return histogram, labels, counts


def getContributors():
    runs = getRuns()
    metadatas = [getMetadataForRun(run['id']) for run in runs]
    contributors = [item['contributors'] for metadata in metadatas for item in metadata]
    contributors = [item['label'] for sublist in contributors for item in sublist]
    contributors = list(map(lambda x: x.replace('Jonathan Karr', 'Jonathan R. Karr'), contributors))
    histogram, labels, counts = makeHistogram(contributors)
    return histogram, labels, counts


def getLicenses():
    all_metadatas = getMetadata()
    metadatas = [metadata for metadata in all_metadatas]
    
    licenses = [item['license'] for metadata in metadatas for item in metadata if not "/" in item['uri']]
    licenses = [item['label'] for sublist in licenses for item in sublist]
    histogram, labels, counts = makeHistogram(licenses)
    return histogram, labels, counts


def getSizes():
    runs = getRuns()
    sizes = [run['projectSize'] for run in runs]
    sizes.sort()
    
    sizes = list(map(lambda x: round(x / 100000)*100000, sizes))
    
    histogram, labels, counts = makeHistogram(sizes, sort=False)
    return histogram, labels, counts
    
    


def getAllSimulators():
    simulators = requests.get('https://api.biosimulators.org/simulators')
    simulators = simulators.json()
    return simulators


def getFrameworkNameFromId(frameworkId):
    request = requests.get('https://api.biosimulators.org/ontologies/SBO/' + frameworkId)
    request = request.json()
    return request['name']


def getFrameworks():
    simulators = getAllSimulators()
    algorithms = [simulator['algorithms'] for simulator in simulators]
    algorithms = [item for sublist in algorithms for item in sublist]
    algorithms = [item for item in algorithms]
    algorithmFrameworks = {algorithm["kisaoId"]['id']: [framework["id"] for framework in algorithm["modelingFrameworks"]] for algorithm in algorithms}

    projectAlgorithms = getAlgorithmIds()
    projectFrameworks = [algorithmFrameworks[id] for id in projectAlgorithms]
    projectFrameworks = [item for sublist in projectFrameworks for item in sublist]
    projectFrameworks = [getFrameworkNameFromId(item) for item in projectFrameworks]
    histogram, labels, counts = makeHistogram(projectFrameworks)
    return histogram, labels, counts


def getTasks():
    summaries = getRunSummaries()

    tasks = [task for summary in summaries for task in summary['tasks']]
    return tasks


def getModelFormats():
    tasks = getTasks()
    model_formats = [task['model']['language']['acronym'] if (task.get(
        'model', None) and task['model'].get('language', None) and task['model']['language'].get('acronym', None)) else task["model"]['language']["name"]for task in tasks]
    return makeHistogram(model_formats)


def processAlgorithmNames(name: str) -> str:
    name = name.replace("Numerical Recipes in C ", "").replace("\"", "")
    name = name.replace("method", "")
    if("Runge-Kutta" in name):
        name = "Runge-Kutta"
    return name


def getAlgorithmIds():
    tasks = getTasks()
    algorithm_ids = [task['simulation']['algorithm']["kisaoId"] for task in tasks]
    return algorithm_ids


def getAlgorithmNames():
    tasks = getTasks()
    algorithms = [task['simulation']['algorithm']['name'] for task in tasks]
    return algorithms


def getAlgorithms():
    algorithms = getAlgorithmNames()
    algorithms = map(processAlgorithmNames, algorithms)
    return makeHistogram(algorithms)


def getRepositories():
    owners = getProjectOwners()
    repositories = [owner['name'] for owner in owners if owner['type'] == "machine"]
    return makeHistogram(repositories)


def postAllStats():
    postStats('repositories', getRepositories)
    postStats('algorithms', getAlgorithms)
    postStats("licenses",  getLicenses)
    postStats('formats', getModelFormats)
    postStats('contributors', getContributors)
    postStats('simulators', getSimulators)
    postStats('taxons', getTaxons)
    postStats('systems', getEncodes)
    postStats('sizes', getSizes)
    postStats('frameworks', getFrameworks)
def main():
    requests_cache.install_cache('biosimulations_cache', backend='sqlite')
    
    postAllStats()
    
    


if __name__ == "__main__":
    main()
