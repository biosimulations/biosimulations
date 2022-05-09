import { Ontologies, EdamTerm, OntologyInfo, OntologyTermMap } from '@biosimulations/datamodel/common';
import isUrl from 'is-url';
import edamJson from './edam.json';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
let edamVersion = '';
function getEdamTerms(input: any): OntologyTermMap<EdamTerm> {
  const edamTerms: OntologyTermMap<EdamTerm> = {};

  // Drop context
  const edamJsonParse = input['@graph'];

  edamJsonParse.forEach((jsonTerm: any) => {
    if (jsonTerm['@id'] === 'http://edamontology.org') {
      edamVersion = jsonTerm['http://usefulinc.com/ns/doap#Version'];
    } else if (jsonTerm['@id'].startsWith('http://edamontology.org/') && !jsonTerm?.['owl:deprecated']) {
      const termIRI = jsonTerm['@id'];
      const termNameSpace = Ontologies.EDAM;
      const termId = jsonTerm['@id'].replace('http://edamontology.org/', '');
      if (!termId.match(/^(format)_\d{4}$/)) {
        return;
      }
      const termDescription = jsonTerm['http://www.geneontology.org/formats/oboInOwl#hasDefinition'] || null;

      const termName = jsonTerm['rdfs:label'];

      const mediaTypes = makeArray(jsonTerm?.['http://edamontology.org/media_type']).map((mediaType: any): string => {
        if (typeof mediaType === 'object') {
          mediaType = mediaType['@id'];
        }

        if (mediaType.startsWith('http://www.iana.org/assignments/media-types/')) {
          return mediaType.substring('http://www.iana.org/assignments/media-types/'.length);
        } else {
          return mediaType;
        }
      });
      const fileExtensions = makeArray(jsonTerm?.['http://edamontology.org/file_extension']);

      const termUrl =
        'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=' +
        encodeURIComponent('http://edamontology.org/' + termId);

      let moreInfoUrl: string | null = null;
      if (isUrl(jsonTerm?.['http://edamontology.org/documentation']?.['@id'])) {
        moreInfoUrl = jsonTerm?.['http://edamontology.org/documentation']?.['@id'];
      } else if (isUrl(jsonTerm?.['http://www.geneontology.org/formats/oboInOwl#hasDbXref']?.['@id'])) {
        moreInfoUrl = jsonTerm?.['http://www.geneontology.org/formats/oboInOwl#hasDbXref']?.['@id'];
      }

      let parents!: string[];
      if ('rdfs:subClassOf' in jsonTerm) {
        parents = (
          Array.isArray(jsonTerm['rdfs:subClassOf']) ? jsonTerm['rdfs:subClassOf'] : [jsonTerm['rdfs:subClassOf']]
        )
          .filter((term: string): boolean => {
            return term.startsWith('http://edamontology.org/');
          })
          .map((term) => term.replace('http://edamontology.org/', ''));
      } else {
        parents = [];
      }

      const term: EdamTerm = {
        namespace: termNameSpace,
        id: termId,
        name: termName,
        description: termDescription,
        mediaTypes: mediaTypes,
        fileExtensions: fileExtensions,
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

  BIOSIMULATIONS_FORMATS.forEach((format: EdamTerm): void => {
    const id = format.id;
    if (id in edamTerms) {
      const term = edamTerms[id];

      const mediaTypes = [...format.mediaTypes];
      term.mediaTypes.forEach((mediaType: string): void => {
        if (!mediaTypes.includes(mediaType)) {
          mediaTypes.push(mediaType);
        }
      });
      term.mediaTypes = mediaTypes;

      const fileExtensions = [...format.fileExtensions];
      term.fileExtensions.forEach((fileExtension: string): void => {
        if (!fileExtensions.includes(fileExtension)) {
          fileExtensions.push(fileExtension);
        }
      });
      term.fileExtensions = fileExtensions;

      term.biosimulationsMetadata = format?.biosimulationsMetadata;
    } else {
      if (!format.description) {
        throw new Error(`Proposed EDAM term '${format.id}' must include a description.`);
      }
      if (!format.parents || format.parents.length === 0) {
        throw new Error(`Proposed EDAM term '${format.id}' must include proposed parents.`);
      }

      edamTerms[id] = {
        namespace: format.namespace,
        id: format.id,
        name: format.name,
        description: format.description,
        mediaTypes: format.mediaTypes,
        fileExtensions: format.fileExtensions,
        iri: format.iri,
        url: format.url,
        moreInfoUrl: format.moreInfoUrl,
        parents: format.parents,
        children: [],
        biosimulationsMetadata: format?.biosimulationsMetadata,
      };
    }
  });

  Object.values(edamTerms).forEach((term: EdamTerm): void => {
    term.parents.forEach((parent: string): void => {
      edamTerms[parent].children.push(term.id);
    });
  });

  return edamTerms;
}

function makeArray(value: any): any[] {
  if (value === undefined) {
    return [];
  } else {
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  }
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
  source: 'https://raw.githubusercontent.com/edamontology/edamontology/master/releases/EDAM.owl',
};
