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

import { BiosimulationsIcon } from '@biosimulations/shared/icons';

export interface EdamModelingFormat {
  name: string;
  acronym: string | null;
  edamId: string;
  sedUrn: string;
  combineUris: string[];
  mediaTypes: string[];
  extensions: string[];
  validationAvailable: boolean;
  introspectionAvailable: boolean;
  url: string;
}

export const MODEL_FORMATS: EdamModelingFormat[] = [
  {
    name: 'BioNetGen Language',
    acronym: 'BNGL',
    edamId: 'format_3972',
    sedUrn: 'urn:sedml:language:bngl',
    combineUris: ['http://purl.org/NET/mediatypes/text/bngl+plain'],
    mediaTypes: [
      'text/bngl+plain',
      'text/plain',
      'text/x-bngl',
      'application/x-bngl',
    ],
    extensions: ['bngl'],
    validationAvailable: true,
    introspectionAvailable: true,
    url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3972',
  },
  {
    name: 'CellML',
    acronym: null,
    edamId: 'format_3240',
    sedUrn: 'urn:sedml:language:cellml',
    combineUris: ['http://identifiers.org/combine.specifications/cellml'],
    mediaTypes: [
      'application/cellml+xml',
      'application/x-cellml',
      'application/xml',
    ],
    extensions: ['cellml', 'xml'],
    validationAvailable: true,
    introspectionAvailable: true,
    url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3240',
  },
  {
    name: 'COPASI Markup Language',
    acronym: 'CopasiML',
    edamId: 'format_9003',
    sedUrn: 'urn:sedml:language:copasiml',
    combineUris: ['http://purl.org/NET/mediatypes/application/x-copasi'],
    mediaTypes: [
      'application/x-copasi',
      'application/copasiml+xml',
      'application/xml',
    ],
    extensions: ['cps'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'http://copasi.org',
  },
  {
    name: 'GINsim Markup Language',
    acronym: 'GINML',
    edamId: 'format_9009',
    sedUrn: 'urn:sedml:language:ginml',
    combineUris: ['http://purl.org/NET/mediatypes/application/ginml+xml'],
    mediaTypes: ['application/ginml+xml', 'application/xml'],
    extensions: ['ginml'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'http://ginsim.org',
  },
  {
    name: 'High Order Calculator',
    acronym: 'HOC',
    edamId: 'format_9005',
    sedUrn: 'urn:sedml:language:hoc',
    combineUris: ['http://purl.org/NET/mediatypes/text/x-hoc'],
    mediaTypes: ['text/x-hoc', 'text/plain'],
    extensions: ['hoc'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'https://en.wikipedia.org/wiki/Hoc_(programming_language)',
  },
  {
    name: 'Kappa',
    acronym: null,
    edamId: 'format_9006',
    sedUrn: 'urn:sedml:language:kappa',
    combineUris: ['http://purl.org/NET/mediatypes/text/x-kappa'],
    mediaTypes: ['text/x-kappa', 'text/plain'],
    extensions: ['ka'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'https://kappalanguage.org/',
  },
  {
    name: 'Low Entropy Model Specification',
    acronym: 'LEMS',
    edamId: 'format_9004',
    sedUrn: 'urn:sedml:language:lems',
    combineUris: ['http://purl.org/NET/mediatypes/application/lems+xml'],
    mediaTypes: [
      'application/lems+xml',
      'application/x-lems',
      'application/xml',
    ],
    extensions: ['xml'],
    validationAvailable: true,
    introspectionAvailable: false,
    url: 'https://lems.github.io/LEMS/',
  },
  {
    name: 'Mass Action Stoichiometric Simulation',
    acronym: 'MASS',
    edamId: 'format_9011',
    sedUrn: 'urn:sedml:language:mass',
    combineUris: ['http://purl.org/NET/mediatypes/application/mass+json'],
    mediaTypes: ['application/mass+json', 'application/json'],
    extensions: ['json'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'https://masspy.readthedocs.io/en/stable/tutorials/reading_writing_models.html',
  },
  {
    name: 'Morpheus Markup Language',
    acronym: 'MorpheusML',
    edamId: 'format_9002',
    sedUrn: 'urn:sedml:language:morpheusml',
    combineUris: ['http://purl.org/NET/mediatypes/application/morpheusml+xml'],
    mediaTypes: ['application/morpheusml+xml', 'application/xml'],
    extensions: ['xml'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'https://gitlab.com/morpheus.lab/morpheus/-/wikis/morpheusml',
  },
  {
    name: 'NeuroML',
    acronym: null,
    edamId: 'format_3971',
    sedUrn: 'urn:sedml:language:neuroml',
    combineUris: ['http://identifiers.org/combine.specifications/neuroml'],
    mediaTypes: ['application/neuroml+xml', 'application/xml'],
    extensions: ['nml'],
    validationAvailable: true,
    introspectionAvailable: false,
    url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3971',
  },
  {
    name: 'Pharmacometrics Markup Language ',
    acronym: 'pharmML',
    edamId: 'format_9007',
    sedUrn: 'urn:sedml:language:pharmml',
    combineUris: ['http://purl.org/NET/mediatypes/application/pharmml+xml'],
    mediaTypes: ['application/pharmml+xml', 'application/xml'],
    extensions: ['xml'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'http://www.pharmml.org/',
  },
  {
    name: 'RBA models',
    acronym: null,
    edamId: 'format_9012',
    sedUrn: 'urn:sedml:language:rba',
    combineUris: ['http://purl.org/NET/mediatypes/application/rba+zip'],
    mediaTypes: ['application/rba+zip', 'application/zip'],
    extensions: ['zip'],
    validationAvailable: true,
    introspectionAvailable: true,
    url: 'https://sysbioinra.github.io/RBApy/usage.html',
  },
  {
    name: 'Systems Biology Markup Language',
    acronym: 'SBML',
    edamId: 'format_2585',
    sedUrn: 'urn:sedml:language:sbml',
    combineUris: ['http://identifiers.org/combine.specifications/sbml'],
    mediaTypes: [
      'application/sbml+xml',
      'application/x-sbml',
      'application/xml',
    ],
    extensions: ['xml', 'sbml'],
    validationAvailable: true,
    introspectionAvailable: true,
    url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3972',
  },
  {
    name: 'Smoldyn',
    acronym: null,
    edamId: 'format_9001',
    sedUrn: 'urn:sedml:language:smoldyn',
    combineUris: ['http://purl.org/NET/mediatypes/text/smoldyn+plain'],
    mediaTypes: [
      'text/smoldyn+plain',
      'text/plain',
      'text/x-smoldyn',
      'application/x-smoldyn',
    ],
    extensions: ['txt'],
    validationAvailable: true,
    introspectionAvailable: true,
    url: 'http://www.smoldyn.org/',
  },
  {
    name: 'Virtual Cell Markup Language',
    acronym: 'VCML',
    edamId: 'format_9000',
    sedUrn: 'urn:sedml:language:vcml',
    combineUris: ['http://purl.org/NET/mediatypes/application/vcml+xml'],
    mediaTypes: ['application/vcml+xml', 'application/xml'],
    extensions: ['vcml'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'https://vcell.org/',
  },
  {
    name: 'XPP',
    acronym: null,
    edamId: 'format_9010',
    sedUrn: 'urn:sedml:language:xpp',
    combineUris: ['http://purl.org/NET/mediatypes/text/x-xpp'],
    mediaTypes: [
      'text/x-xpp',
      'text/plain',
      'text/xpp+plain',
      'application/x-xpp',
    ],
    extensions: ['ode', 'xpp'],
    validationAvailable: true,
    introspectionAvailable: true,
    url: 'http://www.math.pitt.edu/~bard/xpp/xpp.html',
  },
  {
    name: 'GINsim Markup Language, Zipped',
    acronym: 'ZGINML',
    edamId: 'format_9008',
    sedUrn: 'urn:sedml:language:zginml',
    combineUris: ['http://purl.org/NET/mediatypes/application/zginml+zip'],
    mediaTypes: [
      'application/zginml+zip',
      'application/x-zginml',
      'application/zip',
    ],
    extensions: ['zginml', 'zip'],
    validationAvailable: false,
    introspectionAvailable: false,
    url: 'http://ginsim.org',
  },
];

export const SEDML_FORMAT = {
  name: 'Simulation Experiment Description Markup Language',
  acronym: 'SED-ML',
  edamId: 'format_3685',
  combineUris: ['http://identifiers.org/combine.specifications/sed-ml'],
  mediaTypes: ['application/sedml+xml', 'application/xml'],
  extensions: ['sedml'],
  url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3685',
  icon: 'simulation' as BiosimulationsIcon,
};

export const COMBINE_OMEX_FORMAT = {
  name: 'Open Modeling and Exchange',
  acronym: 'OMEX',
  edamId: 'format_3686',
  combineUris: ['http://identifiers.org/combine.specifications/omex'],
  mediaTypes: ['application/omex+zip', 'application/zip'],
  extensions: ['omex', 'zip'],
  url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686',
  icon: 'archive' as BiosimulationsIcon,
};

export const VEGA_FORMAT = {
  name: 'Vega',
  acronym: null,
  edamId: 'format_3969',
  combineUris: [
    'http://purl.org/NET/mediatypes/application/vnd.vega.v5+json',
    'http://purl.org/NET/mediatypes/application/vnd.vega+json',
    'http://purl.org/NET/mediatypes/application/vega+json',
  ],
  mediaTypes: [
    'application/vnd.vega.v5+json',
    'application/vega+json',
    'application/json',
  ],
  extensions: ['vg.json', 'vg', 'json'],
  url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3969',
  icon: 'chart' as BiosimulationsIcon,
};

export interface CombineArchiveContentFormat {
  combineUris: string[];
  name: string;
  acronym: string | null;
  url: string;
  icon: BiosimulationsIcon;
}

export const FORMATS: CombineArchiveContentFormat[] = MODEL_FORMATS.map(
  (modelFormat: EdamModelingFormat): CombineArchiveContentFormat => {
    return {
      combineUris: modelFormat.combineUris,
      name: modelFormat.name,
      acronym: modelFormat.acronym,
      url: modelFormat.url,
      icon: 'model',
    };
  },
)
  .concat([
    {
      combineUris: SEDML_FORMAT.combineUris,
      name: SEDML_FORMAT.name,
      acronym: SEDML_FORMAT.acronym,
      url: SEDML_FORMAT.url,
      icon: SEDML_FORMAT.icon,
    },
    {
      combineUris: COMBINE_OMEX_FORMAT.combineUris,
      name: COMBINE_OMEX_FORMAT.name,
      acronym: COMBINE_OMEX_FORMAT.acronym,
      url: COMBINE_OMEX_FORMAT.url,
      icon: COMBINE_OMEX_FORMAT.icon,
    },
    {
      combineUris: VEGA_FORMAT.combineUris,
      name: VEGA_FORMAT.name,
      acronym: VEGA_FORMAT.acronym,
      url: VEGA_FORMAT.url,
      icon: VEGA_FORMAT.icon,
    },
  ])
  .concat([
    {
      name: 'Bitmap Image File',
      acronym: 'BMP',
      combineUris: ['http://purl.org/NET/mediatypes/image/bmp'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3592',
      icon: 'image',
    },
    {
      name: 'BioPAX',
      acronym: null,
      combineUris: ['http://identifiers.org/combine.specifications/biopax'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3156',
      icon: 'file',
    },
    {
      name: 'Escher',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/escher+json'],
      url: 'https://escher.github.io/',
      icon: 'chart',
    },
    {
      name: 'Graphics Interchange Format',
      acronym: 'GIF',
      combineUris: ['http://purl.org/NET/mediatypes/image/gif'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3467',
      icon: 'image',
    },
    {
      name: 'Hierarchical Data Format 5',
      acronym: 'HDF5',
      combineUris: ['http://purl.org/NET/mediatypes/application/x-hdf'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3590',
      icon: 'report',
    },
    {
      name: 'IPython Notebook',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/x-ipynb+json'],
      url: 'https://ipython.org/notebook.html',
      icon: 'python',
    },
    {
      name: 'Joint Photographic Experts Group',
      acronym: 'JPEG',
      combineUris: ['http://purl.org/NET/mediatypes/image/jpeg'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3579',
      icon: 'image',
    },
    {
      name: 'JavaScript Object Notation',
      acronym: 'JSON',
      combineUris: ['http://purl.org/NET/mediatypes/application/json'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3464',
      icon: 'code',
    },
    {
      name: 'Mass Action Stoichiometric Simulation',
      acronym: 'MASS',
      combineUris: ['http://purl.org/NET/mediatypes/application/mass+json'],
      url: 'https://masspy.readthedocs.io/en/stable/tutorials/reading_writing_models.html',
      icon: 'model',
    },
    {
      name: 'MATLAB',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/text/x-matlab'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_4007',
      icon: 'code',
    },
    {
      name: 'MATLAB data',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/x-matlab-data'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3626',
      icon: 'report',
    },
    {
      name: 'OMEX Manifest',
      acronym: null,
      combineUris: [
        'http://identifiers.org/combine.specifications/omex-manifest',
      ],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686',
      icon: 'file',
    },
    {
      name: 'OMEX Metadata',
      acronym: null,
      combineUris: [
        'http://identifiers.org/combine.specifications/omex-metadata',
      ],
      url: 'https://co.mbine.org/standards/omex-metadata',
      icon: 'file',
    },
    {
      name: 'Web Ontology Language',
      acronym: 'OWL',
      combineUris: ['http://purl.org/NET/mediatypes/application/rdf+xml'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_2197',
      icon: 'file',
    },
    {
      name: 'Portable Document Format',
      acronym: 'PDF',
      combineUris: ['http://purl.org/NET/mediatypes/application/PDF'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3508',
      icon: 'pdf',
    },
    {
      name: 'Portable Network Graphics',
      acronym: 'PNG',
      combineUris: ['http://purl.org/NET/mediatypes/image/png'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3603',
      icon: 'image',
    },
    {
      name: 'Python',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/x-python-code'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3603',
      icon: 'python',
    },
    {
      name: 'R',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/text/x-r'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3999',
      icon: 'r',
    },
    {
      name: 'R project',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/x-r-project'],
      url: 'https://support.rstudio.com/hc/en-us/articles/200526207-Using-Projects',
      icon: 'r',
    },
    {
      name: 'Systems Biology Graphical Notation',
      acronym: 'SBGN',
      combineUris: ['http://identifiers.org/combine.specifications/sbgn'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3692',
      icon: 'chart',
    },
    {
      name: 'Synthetic Biology Open Language',
      acronym: 'SBOL',
      combineUris: ['http://identifiers.org/combine.specifications/sbol'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3692',
      icon: 'file',
    },
    {
      name: 'SBOL Visual',
      acronym: null,
      combineUris: [
        'http://identifiers.org/combine.specifications/sbol-visual',
      ],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3692',
      icon: 'file',
    },
    {
      name: 'Scilab',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/x-scilab'],
      url: 'https://www.scilab.org/',
      icon: 'code',
    },
    {
      name: 'SimBiology project',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/x-sbproj'],
      url: 'https://www.mathworks.com/help/simbio/ref/sbioloadproject.html',
      icon: 'archive',
    },
    {
      name: 'Scalable Vector Graphics',
      acronym: 'SVG',
      combineUris: ['http://purl.org/NET/mediatypes/image/svg+xml'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3604',
      icon: 'image',
    },
    {
      name: 'TEXT',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/text/plain'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3591',
      icon: 'file',
    },
    {
      name: 'Tag Image File Format',
      acronym: 'TIFF',
      combineUris: ['http://purl.org/NET/mediatypes/image/tiff'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3591',
      icon: 'image',
    },
    {
      name: 'Vega-Lite',
      acronym: null,
      combineUris: [
        'http://purl.org/NET/mediatypes/application/vnd.vegalite.v3+json',
        'http://purl.org/NET/mediatypes/application/vnd.vegalite+json',
        'http://purl.org/NET/mediatypes/application/vega-lite+json',
      ],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3970',
      icon: 'chart',
    },
    {
      name: 'WEBP',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/image/webp'],
      url: 'https://developers.google.com/speed/webp',
      icon: 'image',
    },
    {
      name: 'Extensible Markup Language',
      acronym: 'XML',
      combineUris: ['http://purl.org/NET/mediatypes/application/xml'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_2332',
      icon: 'code',
    },
    {
      name: 'Yet Another Markup Language',
      acronym: 'YAML',
      combineUris: ['http://purl.org/NET/mediatypes/application/x-yaml'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3750',
      icon: 'code',
    },
    {
      name: 'Zip',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/zip'],
      url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3987',
      icon: 'archive',
    },
    {
      name: 'Octet stream',
      acronym: null,
      combineUris: ['http://purl.org/NET/mediatypes/application/octet-stream'],
      url: 'https://www.iana.org/assignments/media-types/application/octet-stream',
      icon: 'file',
    },
  ]);
