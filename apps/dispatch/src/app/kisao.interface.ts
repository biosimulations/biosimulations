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

export enum AlgorithmSubstitutionPolicyLevels {
  NONE = 0,
  SAME_METHOD = 1,
  SAME_MATH = 2,
  SIMILAR_APPROXIMATIONS = 3,
  DISTINCT_APPROXIMATIONS = 4,
  DISTINCT_SCALES = 5,
  SAME_VARIABLES = 6,
  SIMILAR_VARIABLES = 7,
  SAME_FRAMEWORK = 8,
  ANY = 9,
}

export const ALGORITHM_SUBSTITUTION_POLICIES: AlgorithmSubstitutionPolicy[] = [
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 0,
    id: 'NONE',
    name: 'None',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 1,
    id: 'SAME_METHOD',
    name: 'Same method',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 2,
    id: 'SAME_MATH',
    name: 'Same math',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 3,
    id: 'SIMILAR_APPROXIMATIONS',
    name: 'Similar approximations',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 4,
    id: 'DISTINCT_APPROXIMATIONS',
    name: 'Distinct approximations',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 5,
    id: 'DISTINCT_SCALES',
    name: 'Distinct scales',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 6,
    id: 'SAME_VARIABLES',
    name: 'Same variables',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 7,
    id: 'SIMILAR_VARIABLES',
    name: 'Similar variables',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 8,
    id: 'SAME_FRAMEWORK',
    name: 'Same framework',
  },
  {
    _type: 'AlgorithmSubstitutionPolicy',
    level: 9,
    id: 'ANY',
    name: 'Any',
  },
];

export interface AlgorithmSubstitution {
  _type: 'AlgorithmSubstitution';
  algorithms: Algorithm[];
  maxPolicy: AlgorithmSubstitutionPolicy;
}
