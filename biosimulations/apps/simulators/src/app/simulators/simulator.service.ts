export enum AlgorithmParameterType {
  boolean = 'boolean',
  integer = 'integer',
  float = 'float',
  string = 'string',
}

export interface OntologyId {
  ontology: string;
  id: string;
}

export interface OntologyTerm {
  ontology: string;
  id: string;
  name: string;
  description?: string;
  iri: string;
  url: string;  
}

export interface LicenseId {
  namespace: string;
  id: string;
}

export interface AlgorithmParameter {
  kisaoId: OntologyId;
  kisaoSynonyms?: OntologyId[];
  characteristics?: OntologyTerm[];
  id?: string;
  name?: string;
  type: AlgorithmParameterType;
  value: boolean | number | string
  recommendedRange?: (number | string)[];
}

export interface Algorithm {
  kisaoId: OntologyId;
  kisaoSynonyms?: OntologyId[];
  characteristics?: OntologyTerm[];
  modelingFrameworks: OntologyId[];
  modelFormats: OntologyId[];
  simulationFormats: OntologyId[];
  archiveFormats: OntologyId[];
  parameters: AlgorithmParameter[];
  citations?: JournalCitation[];
}

export interface Person {
  firstName?: string;
  middleName?: string;
  lastName: string;
}

export interface Reference {
  identifiers?: Identifier[];
  citations: JournalCitation[];
}

export interface Identifier {
  namespace: string;
  id: string;
  url?: string;
}

export interface JournalCitation {
  authors: string;
  title: string;
  journal: string;
  volume?: string | number;
  issue?: string | number;
  pages?: string;
  year: number;
  identifiers: Identifier[];
}

export interface Simulator {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string;
  imageUrl?: string;
  format: OntologyId;
  algorithms: Algorithm[];
  version: string;
  license: LicenseId;
  authors: Person[];
  references: Reference;
  created: number;
}

export class SimulatorService {
  static data: Simulator[] = [
    {
      id: 'copasi',
      name: 'COPASI',
      description: 'COPASI is a C++-based software application for the simulation and analysis of biochemical networks and their dynamics.',
      image: 'docker.io/biosimulators/copasi:4.28.226',
      imageUrl: 'https://hub.docker.com/r/biosimulators/copasi/tags',
      format: {ontology: 'EDAM', id: 'format_3973'},
      algorithms: [
        {
          kisaoId: {ontology: 'KISAO', id: '0000089'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000304'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000027'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000038'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000039'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000048'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000088'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000086'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000318'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [],
        },
      ],
      version: '4.28.226',
      url: 'http://copasi.org',
      license: {namespace: 'SPDX', id: 'Artistic-2.0'},
      authors: [
      ],
      references: {
        citations: [
        ],
      },
      created: new Date(2020, 9, 1).getTime(),
    },
    {
      id: 'vcell',
      name: 'VCell',
      description: 'VCell (Virtual Cell) is a comprehensive platform for modeling cell biological systems that is built on a central database and disseminated as a standalone application',
      image: 'docker.io/biosimulators/vcell:7.2',
      imageUrl: 'https://hub.docker.com/r/biosimulators/vcell/tags',
      format: {ontology: 'EDAM', id: 'format_3973'},
      algorithms: [
        {
          kisaoId: {ontology: 'KISAO', id: '0000019'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000064'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000030'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000032'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000086'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000280'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000283'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000027'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000352'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000285'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000292'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000057'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000294'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
      ],
      version: '7.2',
      url: 'https://vcell.org/',
      authors: [
      ],
      references: {
        citations: [
        ],
      },
      license: {namespace: 'SPDX', id: 'MIT'},
      created: new Date(2020, 9, 1).getTime(),
    },
    {
      id: 'tellurium',
      name: 'tellurium',
      description: 'tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
      image: 'docker.io/biosimulators/tellurium:2.4.1',
      imageUrl: 'https://hub.docker.com/r/biosimulators/tellurium/tags',
      format: {ontology: 'EDAM', id: 'format_3973'},
      algorithms: [
        {
          kisaoId: {ontology: 'KISAO', id: '0000019'},
          kisaoSynonyms: [],
          characteristics: [
            {
              ontology: "KISAO",
              id: "0000035",
              name: "algorithm using deterministic rules",
              description: "",
              iri: "http://www.biomodels.net/kisao/KISAO:KISAO_0000035",
              url: "https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000035"
            },
            {
              ontology: "KISAO",
              id: "0000288",
              name: "backward differentiation formula",
              description: "The backward differentiation formulas (BDF) are implicit multistep methods based on the numerical differentiation of a given function and are wildly used for integration of stiff differential equations.",
              iri: "http://www.biomodels.net/kisao/KISAO:KISAO_0000288",
              url: "https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000288"
            },
            {
              ontology: "KISAO",
              id: "0000280",
              name: "Adams-Moulton method",
              description: "The (k-1)-step Adams-Moulton method is an implicit linear multistep method that iteratively approximates the solution, y(x) at x = x0+kh, of the initial value problem by yk = yk - 1 + h * ( b0 f(xk,yk) + b1 f(xk - 1,yk - 1) + . . . + bk - 1 f(x1,y1) ), where b1, . . . , bk - 1 are constants.",
              iri: "http://www.biomodels.net/kisao/KISAO:KISAO_0000280",
              url: "https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000280"
            }
          ],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [
            {
              kisaoId: {ontology: 'KISAO', id: "0000209"},
              id: 'rTol',
              name: "Relative tolerance",
              type: AlgorithmParameterType.float,
              value: 0.000001,
              recommendedRange: [1e-4, 1e-8]
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000211"},
              id: 'aTol',
              name: "Absolute tolerance",
              type: AlgorithmParameterType.float,
              value: 1e-12
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000220"},
              id: 'bdfOrder',
              name: "Maximum Backward Differentiation Formula (BDF) order",
              type: AlgorithmParameterType.integer,
              value: 5
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000219"},
              id: 'adamsOrder',
              name: "Maximum Adams order",
              type: AlgorithmParameterType.integer,
              value: 12
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000415"},
              id: 'nSteps',
              name: "Maximum number of steps",
              type: AlgorithmParameterType.integer,
              value: 20000
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000467"},
              id: 'maxStep',
              name: "Maximum time step",
              type: AlgorithmParameterType.float,
              value: 0
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000485"},
              id: 'minStep',
              name: "Minimum time step",
              type: AlgorithmParameterType.float,
              value: 0
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000332"},
              id: 'firstStep',
              name: "Initial time step",
              type: AlgorithmParameterType.float,
              value: 0
            },
            {
              kisaoId: {ontology: 'KISAO', id: "0000107"},
              id: 'adaptiveSteps',
              name: "Adaptive time steps",
              type: AlgorithmParameterType.boolean,
              value: false
            }
          ],
          citations: [
            {
              "title": "CVODE, a stiff/nonstiff ODE solver in C",
              "authors": "Scott D Cohen, Alan C Hindmarsh & Paul F Dubois",
              "journal": "Computers in Physics",
              "volume": 10,
              "issue": 2,
              "pages": "138-143",
              "year": 1996,
              "identifiers": [
                {
                  namespace: "doi",
                  id: "10.1063/1.4822377",
                  url: "https://doi.org/10.1063/1.4822377"
                }
              ]
            }
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000032'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000029'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000408'},
          kisaoSynonyms: [
            {ontology: 'KISAO', id: '0000409'},
            {ontology: 'KISAO', id: '0000410'},
            {ontology: 'KISAO', id: '0000411'},
            {ontology: 'KISAO', id: '0000412'},
            {ontology: 'KISAO', id: '0000413'},
            {ontology: 'KISAO', id: '0000432'},
          ],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_2585'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
      ],
      version: '2.4.1',
      url: 'http://tellurium.analogmachine.org/',
      authors: [
        {
          "firstName": "Jayit",
          "lastName": "Biswas"
        },
        {
          "firstName": "Kiri",
          "lastName": "Choi"
        },
        {
          "firstName": "Wilbert",
          "lastName": "Copeland"
        },
        {
          "firstName": "Caroline",
          "lastName": "Cannistra"
        },
        {
          "firstName": "Alex",
          "lastName": "Darling"
        },
        {
          "firstName": "Nasir",
          "lastName": "Elmi"
        },
        {
          "firstName": "Michal",
          "lastName": "Galdzicki"
        },
        {
          "firstName": "Stanley",
          "lastName": "Gu"
        },
        {
          "firstName": "Totte",
          "lastName": "Karlsson"
        },
        {
          "firstName": "Matthias",
          "lastName": "König"
        },
        {
          "firstName": "J",
          "middleName": "Kyle",
          "lastName": "Medley"
        },
        {
          "firstName": "Herbert",
          "lastName": "Sauro"
        },
        {
          "firstName": "Andy",
          "lastName": "Somogyi"
        },
        {
          "firstName": "Lucian",
          "lastName": "Smith"
        },
        {
          "firstName": "Kaylene",
          "lastName": "Stocking"
        }
      ],
      references: {
        citations: [
          {
            "title": "tellurium: an extensible python-based modeling environment for systems and synthetic biology",
            "authors": "Kiri Choi, J. Kyle Medley, Matthias König, Kaylene Stocking, Lucian Smith, Stanley Gua & Herbert M. Sauro",
            "journal": "Biosystems",
            "volume": 171,
            "pages": "74-79",
            "year": 2018,
            "identifiers": [{
              namespace: "doi",
              id: "10.1016/j.biosystems.2018.07.006",
              url: "https://doi.org/10.1016/j.biosystems.2018.07.006"
            }]
          }
        ],
      },
      license: {namespace: 'SPDX', id: 'Apache-2.0'},
      created: new Date(2020, 9, 1).getTime(),
    },
    {
      id: 'bionetgen',
      name: 'BioNetGen',
      description: 'BioNetGen is an open-source software package for rule-based modeling of complex biochemical systems.',
      image: 'docker.io/biosimulators/bionetgen:2.5.0',
      imageUrl: 'https://hub.docker.com/r/biosimulators/bionetgen/tags',
      format: {ontology: 'EDAM', id: 'format_3973'},
      algorithms: [
        {
          kisaoId: {ontology: 'KISAO', id: '0000019'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000293'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_3972'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000029'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_3972'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
        {
          kisaoId: {ontology: 'KISAO', id: '0000263'},
          kisaoSynonyms: [],
          modelingFrameworks: [{ontology: 'SBO', id: '0000295'}],
          modelFormats: [{ontology: 'EDAM', id: 'format_3972'}],
          simulationFormats: [{ontology: 'EDAM', id: 'format_3685'}],
          archiveFormats: [{ontology: 'EDAM', id: 'format_3686'}],
          parameters: [],
          citations: [
          ],
        },
      ],
      version: '2.5.0',
      url: 'https://bionetgen.org',
      authors: [
      ],
      references: {
        citations: [
        ],
      },
      license: {namespace: 'SPDX', id: 'MIT'},
      created: new Date(2020, 9, 1).getTime(),
    },
  ];
}