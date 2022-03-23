import { Ontologies, EdamTerm, OntologyTermMap } from '@biosimulations/datamodel/common';
import biosimulationsFormatsJson from './edam-biosimulations-formats.json';

export const BIOSIMULATIONS_FORMATS: EdamTerm[] = biosimulationsFormatsJson.map(
  (jsonFormat: any, iFormat: number): EdamTerm => {
    const isPropsedTerm = jsonFormat.id.startsWith('format_90');

    if (isPropsedTerm) {
      if (!jsonFormat?.description) {
        throw new Error(`Proposed term '${jsonFormat.id}' must have a description.`);
      }
      if (!jsonFormat?.parents?.length) {
        throw new Error(`Proposed term '${jsonFormat.id}' must have parents.`);
      }
    }
    const format: any = { ...jsonFormat };
    format.namespace = Ontologies.EDAM;
    format.iri = 'http://edamontology.org/' + format.id;

    if (isPropsedTerm) {
      format.url = format.moreInfoUrl;
    } else {
      format.url = 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=' + encodeURIComponent(format.iri);
    }
    return format;
  },
);

export const BIOSIMULATIONS_FORMATS_BY_ID: OntologyTermMap<EdamTerm> = BIOSIMULATIONS_FORMATS.reduce(function (
  result: OntologyTermMap<EdamTerm>,
  format: EdamTerm,
) {
  if (format.id) {
    result[format.id] = format;
  }
  return result;
},
{});
