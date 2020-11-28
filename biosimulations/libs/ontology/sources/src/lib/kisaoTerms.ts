import { Ontologies, KisaoTerm, OntologyInfo } from '@biosimulations/datamodel/common';
import kisaoJson from './kisao.json';
import isUrl from 'is-url';

let kisaoVersion = '';
function getKisaoTerms(input: any): { [id: string]: KisaoTerm } {

    const kisaoTerms: { [id: string]: KisaoTerm } = {}
    input = kisaoJson
    const kisaoJsonParse = input["@graph"]

    kisaoJsonParse.forEach((jsonTerm: any) => {
        if (jsonTerm["@id"] === "http://www.biomodels.net/kisao/KISAO#") {
            kisaoVersion = jsonTerm["owl:versionInfo"]["@value"];
        } else  if (jsonTerm?.["@id"].startsWith("http://www.biomodels.net/kisao/KISAO#")) {
            const termIRI = jsonTerm["@id"];
            const termNamespace = Ontologies.KISAO;
            const termId = jsonTerm["@id"].replace("http://www.biomodels.net/kisao/KISAO#", "")
            const termName = jsonTerm["rdfs:label"]
            const termDescription = jsonTerm["http://www.w3.org/2004/02/skos/core#definition"] || null;
            const termUrl = "https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23" + encodeURIComponent(termId)

            let moreInfoUrl: string | null = null;
            const seeAlsos = jsonTerm["http://www.w3.org/2000/01/rdf-schema#seeAlso"];
            if (seeAlsos) {
              if (Array.isArray(seeAlsos)) {
                for (const seeAlso of seeAlsos) {
                  if (seeAlso?.["@type"] === "xsd:anyURI" && seeAlso?.["@value"] && isUrl(seeAlso?.["@value"])) {
                    moreInfoUrl = seeAlso?.["@value"];
                    break;
                  }
                }
              } else {
                if (seeAlsos?.["@type"] === "xsd:anyURI" && seeAlsos?.["@value"] && isUrl(seeAlsos?.["@value"])) {
                  moreInfoUrl = seeAlsos?.["@value"];
                }
              }
            }

            const term: KisaoTerm = {
                id: termId,
                name: termName,
                description: termDescription,
                namespace: termNamespace,
                iri: termIRI,
                url: termUrl,
                moreInfoUrl: moreInfoUrl,
            }

            kisaoTerms[termId] = term;
        } else {
            return;
        }
    });

    return kisaoTerms;
}


export const kisaoTerms = getKisaoTerms(kisaoJson);

export const kisaoInfo: OntologyInfo = {
  id: Ontologies.KISAO,
  acronym: 'KiSAO',
  name: 'Kinetic Simulation Algorithm Ontology',
  description: 'A classification of algorithms available for the simulation of models in biology.',
  bioportalId: 'KISAO',
  olsId: 'kisao',
  version: kisaoVersion,
  source: 'http://www.biomodels.net/kisao/KISAO',
};