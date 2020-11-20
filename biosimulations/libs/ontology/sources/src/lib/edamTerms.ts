import { Ontologies, EdamTerm, OntologyInfo } from '@biosimulations/datamodel/common';
import edamJson from './edam.json';
let edamVersion: string = '';
function getEdamTerms(input: any): { [id: string]: EdamTerm } {
    const edamTerms: { [id: string]: EdamTerm } = {};

    // Drop context
    const edamJsonParse = input["@graph"]

    edamJsonParse.forEach(
        (jsonTerm: any) => {
            if (jsonTerm["@id"] === "http://edamontology.org") {
                edamVersion = jsonTerm["http://usefulinc.com/ns/doap#Version"];
            } else if (jsonTerm["@id"].startsWith("http://edamontology.org/") && !(jsonTerm?.["owl:deprecated"])) {

                const termIRI = jsonTerm["@id"];
                const termNameSpace = Ontologies.EDAM
                const termId = jsonTerm["@id"].replace("http://edamontology.org/", "")
                const termDescription = jsonTerm["http://www.geneontology.org/formats/oboInOwl#hasDefinition"]
                const termName = jsonTerm["rdfs:label"]
                const termUrl = encodeURI("https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2F" + termId)
                const docUrl = jsonTerm?.["http://edamontology.org/documentation"]?.["@id"] || jsonTerm?.["http://www.geneontology.org/formats/oboInOwl#hasDbXref"]?.["@id"]
                const term: EdamTerm = {
                    id: termId,
                    name: termName,
                    description: termDescription,
                    namespace: termNameSpace,
                    iri: termIRI,
                    url: termUrl,
                    externalUrl: docUrl
                }


                edamTerms[termId] = term
            }
            else {
                return;
            }


        }
    );
    return edamTerms;

}
export const edamTerms = getEdamTerms(edamJson);

export const edamInfo: OntologyInfo = {
  'bioportalId': 'EDAM',
  'olsId': 'edam',
  'version': edamVersion,
  'source': 'https://raw.githubusercontent.com/edamontology/edamontology/master/releases/EDAM.owl',
};
