import {
  Ontologies,
  EdamTerm,
  OntologyInfo,
} from '@biosimulations/datamodel/common';
import isUrl from 'is-url';
import edamJson from './edam.json';
import edamProposedJson from './edam-proposed.json';
let edamVersion = '';
function getEdamTerms(input: any): { [id: string]: EdamTerm } {
  const edamTerms: { [id: string]: EdamTerm } = {};

  // Drop context
  const edamJsonParse = input['@graph'];

  edamJsonParse.forEach((jsonTerm: any) => {
    if (jsonTerm['@id'] === 'http://edamontology.org') {
      edamVersion = jsonTerm['http://usefulinc.com/ns/doap#Version'];
    } else if (
      jsonTerm['@id'].startsWith('http://edamontology.org/') &&
      !jsonTerm?.['owl:deprecated']
    ) {
      const termIRI = jsonTerm['@id'];
      const termNameSpace = Ontologies.EDAM;
      const termId = jsonTerm['@id'].replace('http://edamontology.org/', '');
      if (!termId.match(/^(format)_\d{4}$/)) {
        return;
      }
      const termDescription =
        jsonTerm[
          'http://www.geneontology.org/formats/oboInOwl#hasDefinition'
        ] || null;
      const termName = jsonTerm['rdfs:label'];
      const termUrl =
        'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=' +
        encodeURIComponent('http://edamontology.org/' + termId);
      let moreInfoUrl: string | null = null;
      if (isUrl(jsonTerm?.['http://edamontology.org/documentation']?.['@id'])) {
        moreInfoUrl =
          jsonTerm?.['http://edamontology.org/documentation']?.['@id'];
      } else if (
        isUrl(
          jsonTerm?.[
            'http://www.geneontology.org/formats/oboInOwl#hasDbXref'
          ]?.['@id'],
        )
      ) {
        moreInfoUrl =
          jsonTerm?.[
            'http://www.geneontology.org/formats/oboInOwl#hasDbXref'
          ]?.['@id'];
      }

      let parents!: string[];
      if ('rdfs:subClassOf' in jsonTerm) {
        parents = (
          Array.isArray(jsonTerm['rdfs:subClassOf']) 
          ? jsonTerm['rdfs:subClassOf'] 
          : [jsonTerm['rdfs:subClassOf']]
          )
          .filter((term: string): boolean => {
            return term.startsWith('http://edamontology.org/');
          })
          .map((term) => term.replace('http://edamontology.org/', ''));
      } else {
        parents = [];
      }

      const term: EdamTerm = {
        id: termId,
        name: termName,
        description: termDescription,
        namespace: termNameSpace,
        iri: termIRI,
        url: termUrl,
        moreInfoUrl: moreInfoUrl,
        parents: parents,
        children: [],
      };

      edamTerms[termId] = term;
    } else {
      return;
    }
  });

  edamProposedJson.forEach((term: any): void => {
    term.namespace = Ontologies.EDAM;
    term.children = [];
    edamTerms[term.id] = term;
  });

  Object.values(edamTerms).forEach((term: EdamTerm): void => {
    term.parents.forEach((parent: string): void => {
      edamTerms[parent].children.push(term.id);
    });
  });

  return edamTerms;
}
export const edamTerms = getEdamTerms(edamJson);

export const edamInfo: OntologyInfo = {
  id: Ontologies.EDAM,
  acronym: Ontologies.EDAM,
  name: 'EMBRACE Data And Methods',
  description:
    'EDAM is a simple ontology of well established, familiar concepts that are prevalent within bioinformatics, including types of data and data identifiers, data formats, operations and topics. EDAM provides a set of terms with synonyms and definitions - organised into an intuitive hierarchy for convenient use.',
  bioportalId: 'EDAM',
  olsId: 'edam',
  version: edamVersion,
  source:
    'https://raw.githubusercontent.com/edamontology/edamontology/master/releases/EDAM.owl',
};
