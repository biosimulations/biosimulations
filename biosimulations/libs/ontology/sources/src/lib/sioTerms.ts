import { Ontologies, SioTerm } from '@biosimulations/datamodel/common';

import sioJson from './sio.json';

function getSioTerms(input: any): { [id: string]: SioTerm } {
    const Terms: { [id: string]: SioTerm } = {};


    const jsonParse = input["@graph"]
    jsonParse.forEach(
        (jsonTerm: any) => {
            if (jsonTerm["@id"].startsWith("http://semanticscience.org/resource/SIO_")) {


                const termIRI = jsonTerm["@id"];
                const termNameSpace = Ontologies.SIO
                const termId = jsonTerm["@id"].replace("http://semanticscience.org/resource/", "")
                const termDescription = jsonTerm["rdfs:comment"]
                const termName = jsonTerm["rdfs:label"]
                const termUrl = encodeURI("https://www.ebi.ac.uk/ols/ontologies/sio/terms?iri=http%3A%2F%2Fsemanticscience.org%2Fresource%2F" + termId)
                const term: SioTerm = {
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

export const sioTerms = getSioTerms(sioJson)