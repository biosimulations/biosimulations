import { ArchiveMetadata } from '@biosimulations/datamodel/api';

export const metadata: ArchiveMetadata[] = [
  {
    abstract:
      'Hybrid-stochastic model of tumour suppression by the immune system through stochastic oscillations',
    citations: [
      {
        label:
          "Giulio Caravagna, Alberto d'Onofrio, Paolo Milazzo & Roberto Barbuti. Journal of Theoretical Biology 265, 3 (2010) 336-345.",
        uri: 'https://identifiers.org/doi:10.1016/j.jtbi.2010.05.013',
      },
    ],
    contributors: [
      {
        label: 'Mohammad Umer Sharif Shohan',
        uri: 'https://identifiers.org/orcid:0000-0001-9521-6012',
      },
      {
        label: 'Jonathan Karr',
        uri: 'https://identifiers.org/orcid:0000-0002-2605-5080',
      },
    ],
    created: '2010-05-16',
    creators: [
      {
        label: 'Giulio Caravagna',
        uri: 'https://identifiers.org/orcid:0000-0003-4240-3265',
      },
      {
        label: "Alberto d'Onofrio",
        uri: 'https://identifiers.org/orcid:0000-0002-2190-272X',
      },
      {
        label: 'Paolo Milazzo',
        uri: 'https://identifiers.org/orcid:0000-0002-7309-6424',
      },
      {
        label: 'Roberto Barbuti',
        uri: null,
      },
    ],
    description:
      'Hybrid-stochastic version of the Kirschner-Panetta model for tumour-immune System interplay which reproduces a number of features of this essential interaction, including tumour suppression by the immune system through stochastic oscillations.',
    encodes: [],
    funders: [],
    seeAlso: [],
    identifiers: [
      {
        label: 'biomodels.db:BIOMD0000000912',
        uri: 'https://identifiers.org/biomodels.db:BIOMD0000000912',
      },
    ],
    keywords: [
      { label: 'biological clock', uri: null },
      { label: 'immunology', uri: null },
      { label: 'immunotherapy', uri: null },
      { label: 'neoplasm', uri: null },
    ],
    license: {
      label: 'CC0',
      uri: 'https://identifiers.org/spdx:CC0',
    },
    modified: ['2021-06-26'],
    other: [],
    predecessors: [
      {
        label:
          'Denise Kirschner & John Carl Panetta. Modeling immunotherapy of the tumor-immune interaction. Journal of Mathematical Biology 37, 3 (1998): 235-252.',
        uri: 'https://identifiers.org/doi:10.1007/s002850050127',
      },
    ],

    sources: [],
    successors: [],
    taxa: [
      {
        label: 'Homo sapiens',
        uri: 'https://identifiers.org/taxonomy/9606',
      },
    ],
    thumbnails: [
      '/assets/images/resource-banners/models.svg',
      '/assets/images/resource-banners/visualizations.svg',
      '/assets/images/resource-banners/simulations.svg',
      '/assets/images/resource-banners/charts.svg',
    ],
    title:
      'Tumor-suppressive oscillations (Caravagna et al., Journal of Theoretical Biology, 2010)',
    uri: '.',
  },
  {
    abstract: 'null',
    citations: [],
    contributors: [],
    created: '2021-06-26',
    creators: [],
    description: 'null',
    encodes: [],
    funders: [],
    identifiers: [
      {
        label: 'Figure 1 (bottom left)',
        uri: 'https://identifiers.org/doi:10.1016/j.jtbi.2010.05.013',
      },
    ],
    keywords: [],
    license: { label: 'MIT', uri: 'mit' },
    modified: [],
    other: [],
    predecessors: [],
    seeAlso: [],
    sources: [],
    successors: [],
    taxa: [],
    thumbnails: [],
    title: 'null',
    uri: './BIOMD0000000912_sim.sedml/Figure_1',
  },
];
