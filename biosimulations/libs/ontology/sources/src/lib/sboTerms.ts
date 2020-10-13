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
                const termName = jsonTerm["rdfs:label"]
                const termUrl = encodeURI("https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2F" + termId)
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