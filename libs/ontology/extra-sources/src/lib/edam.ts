import edamProposedTermsJson from './edam-proposed.json';

export interface ProposedEdamTerm {
  id: string;
  name: string;
  description: string;
  namespace: string;
  iri?: string;
  url: string;
  moreInfoUrl: string;
  parents: string[];
}

export const edamProposedTerms: ProposedEdamTerm[] = edamProposedTermsJson;
