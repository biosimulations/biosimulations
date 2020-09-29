import { Ontologies, KISAOTerm } from '@biosimulations/shared/datamodel'
import kisaoJson from './kisao.json'

function getKisaoTerms(input: any): { [id: string]: KISAOTerm } {

    const kisaoTerms: { [id: string]: KISAOTerm } = {}
    input = kisaoJson
    const kisaoJsonParse = input["@graph"]

    kisaoJsonParse.forEach((jsonTerm: any) => {
        if (jsonTerm?.["@id"].startsWith("http://www.biomodels.net/kisao/KISAO#")) {
            const termIRI = jsonTerm["@id"];
            const termNamespace = Ontologies.KISAO;
            const termId = jsonTerm["@id"].replace("http://www.biomodels.net/kisao/KISAO#", "")
            const termName = jsonTerm["rdf:label"]
            const termDescription = jsonTerm["http://www.w3.org/2004/02/skos/core#definition"]
            const termUrl = encodeURI("http://bioportal.bioontology.org/ontologies/KISAO/?p=classes&conceptid=" + termIRI)
            const term: KISAOTerm = {
                id: termId,
                name: termName,
                description: termDescription,
                namespace: termNamespace,
                iri: termIRI,
                url: termUrl
            }

            kisaoTerms[termId] = term;
        } else {
            return;
        }
    });

    return kisaoTerms;
}


export const kisaoTerms = getKisaoTerms(kisaoJson);
