import { OntologyInfo } from '@biosimulations/datamodel/common';
import data from './gitHubLanguages.json';

export const gitHubLanguageTerms: string[] = [];
data.forEach((language: any): void => {
  if (language?.type === "programming") {
    gitHubLanguageTerms.push(language.name);
  }
})

export const gitHubLanguageInfo: OntologyInfo = {
  id: null,
  acronym: null,
  name: 'Git Hub languages',
  description: 'List of programming languages supported by Git Hub.',
  bioportalId: null,
  olsId: null,
  version: null,
  source: 'https://raw.githubusercontent.com/jaebradley/github-languages-client/master/src/languages.json',
};
