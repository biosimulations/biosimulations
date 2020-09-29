import { Ontologies, EDAMTerm } from '@biosimulations/shared/datamodel'
import edamJson from './edam.json'
function getEdamTerms(input: any): { [id: string]: EDAMTerm } {
    const edamTerms: { [id: string]: EDAMTerm } = {};

    // Drop context
    const edamJsonParse = input["@graph"]

    edamJsonParse.forEach(
        (jsonTerm: any) => {

            if (jsonTerm["@id"].startsWith("http://edamontology.org/") && !(jsonTerm?.["owl:deprecated"])) {

                const termIRI = jsonTerm["@id"];
                const termNameSpace = Ontologies.EDAM
                const termId = jsonTerm["@id"].replace("http://edamontology.org/", "")
                const termDescription = jsonTerm["http://www.geneontology.org/formats/oboInOwl#hasDefinition"]
                const termName = jsonTerm["rdfs:label"]
                const termUrl = jsonTerm?.["http://edamontology.org/documentation"]?.["@id"] || jsonTerm?.["http://www.geneontology.org/formats/oboInOwl#hasDbXref"]?.["@id"] || encodeURI("http://bioportal.bioontology.org/ontologies/EDAM/?p=classes&conceptid=" + termId)
                const term: EDAMTerm = {
                    id: termId,
                    name: termName,
                    description: termDescription,
                    namespace: termNameSpace,
                    iri: termIRI,
                    url: termUrl
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