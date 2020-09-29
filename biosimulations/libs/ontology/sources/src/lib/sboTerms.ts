import { Ontologies, SBOTerm } from '@biosimulations/shared/datamodel';

import sboJson from './sbo.json';

function getSboTerms(input: any): { [id: string]: SBOTerm } {
    const Terms: { [id: string]: SBOTerm } = {};


    const jsonParse = input["@graph"]
    jsonParse.forEach(
        (jsonTerm: any) => {
            if (jsonTerm["@id"].startsWith("http://biomodels.net/SBO/")) {


                const termIRI = jsonTerm["@id"];
                const termNameSpace = Ontologies.SBO
                const termId = jsonTerm["@id"].replace("http://biomodels.net/SBO/", "")
                const termDescription = jsonTerm["rdfs:comment"]
                const termName = jsonTerm["rdf:label"]
                const termUrl = encodeURI("http://bioportal.bioontology.org/ontologies/SBO/?p=classes&conceptid=http://purl.obolibrary.org/obo/" + termId)
                const term: SBOTerm = {
                    id: termId,
                    name: termName,
                    description: termDescription,
                    namespace: termNameSpace,
                    iri: termIRI,
                    url: termUrl
                }


                Terms[termId] = term
            } else {
                return
            }
        })


    return Terms;

}

export const sboTerms = getSboTerms(sboJson)