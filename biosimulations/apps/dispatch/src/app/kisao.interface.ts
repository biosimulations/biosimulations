export interface Algorithm {
  _type: 'Algorithm';
  id: string;
  name: string;
}

export interface AlgorithmSubstitutionPolicy {
  _type: 'AlgorithmSubstitutionPolicy';
  id: string;
  name: string;
  level: number;
}

export interface AlgorithmSubstitution {
  _type: 'AlgorithmSubstitution';
  algorithm: Algorithm;
  maxPolicy: AlgorithmSubstitutionPolicy;
}
