import {
  ProjectSummary,
  SimulationRunAlgorithmSummary,
  SimulationRunMetadataSummary,
  SimulationRunModelLanguageSummary,
  SimulationRunModelSummary,
  SimulationRunRunSummary,
  SimulationRunSimulationSummary,
  SimulationRunSimulatorSummary,
  SimulationRunSummary,
  SimulationRunTaskSummary,
  TypeSummary,
} from '@biosimulations/datamodel/api';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';

const _simRunModelLanguageSummary_SBML: SimulationRunModelLanguageSummary = {
  acronym: 'SBML',
  name: 'Systems Biology Markup Language',
  sedmlUrn: 'SBML_URN',
};
const _simRunModelLanguageSummary_VCML: SimulationRunModelLanguageSummary = {
  acronym: 'VCML',
  name: 'Virtual Cell Markup Language',
  sedmlUrn: 'VCML_URN',
};
const _simRunModelLanguageSummary_CELLML: SimulationRunModelLanguageSummary = {
  acronym: 'CellML',
  name: 'Cell Markup Language',
  sedmlUrn: 'CellML_URN',
};
const _simRunModelSummary: SimulationRunModelSummary = {
  id: '',
  language: _simRunModelLanguageSummary_SBML,
  source: '',
  uri: '',
};
const _simRunAlgorithmSummary: SimulationRunAlgorithmSummary = {
  kisaoId: 'default_KISAO_id',
  name: 'defaultAlgorithm',
  url: 'defaultAlgorithm_URL',
};
const _typeSummary: TypeSummary = {
  id: '',
  name: 'SED-ML defaultSimType simulation',
  url: '',
};
const _simRunSimulationSummary: SimulationRunSimulationSummary = {
  algorithm: _simRunAlgorithmSummary,
  id: '',
  type: _typeSummary,
  uri: '',
};
const _simRunTaskSummary: SimulationRunTaskSummary = {
  id: '',
  model: _simRunModelSummary,
  simulation: _simRunSimulationSummary,
  uri: '',
};
const _simRunSimSummary: SimulationRunSimulatorSummary = {
  digest: '',
  id: '',
  name: 'defaultSimulator',
  url: '',
  version: '1.0.0',
};
const _simRunRunSummary: SimulationRunRunSummary = {
  cpus: 0,
  envVars: [],
  maxTime: 0,
  memory: 0,
  simulator: { ..._simRunSimSummary },
  status: SimulationRunStatus.SUCCEEDED,
};
const _simRunSummary: SimulationRunSummary = {
  id: '',
  name: '',
  run: { ..._simRunRunSummary },
  submitted: '',
  updated: '',
  tasks: [],
  outputs: [],
  metadata: [],
};
const _projectSummary_mock: ProjectSummary = {
  created: '',
  id: '',
  simulationRun: { ..._simRunSummary },
  updated: '',
};

const _simulationRunMetadataSummary_mock: SimulationRunMetadataSummary = {
  citations: [],
  contributors: [],
  creators: [],
  encodes: [],
  funders: [],
  identifiers: [],
  keywords: [],
  other: [],
  predecessors: [],
  references: [],
  seeAlso: [],
  sources: [],
  successors: [],
  taxa: [],
  thumbnails: [],
  uri: '',
};

export const projectSummary_mock1: ProjectSummary = {
  ..._projectSummary_mock,
  id: 'Ca2i-oscillations-in-sympathetic-neurons--an-experimental-test-of-a-theoretical-model',
  simulationRun: {
    ..._simRunSummary,
    outputs: [{ type: { id: 'SedReport_wrong', url: '', name: '' }, uri: '' }],
    id: 'id2',
    metadata: [
      {
        ..._simulationRunMetadataSummary_mock,
        taxa: [{ label: 'defaultTaxa', uri: 'defaultTaxaURI' }],
        title: '[Ca2+]i oscillations in sympathetic neurons: an experimental test of a theoretical model',
        description:
          'This CellML model runs in OpenCell and COR, and reproduces Figure 4 from the original paper. ' +
          'The results match output from a reference (IgorPro) implementation of the model provided by David Friel.',
        abstract:
          '[Ca2+]i oscillations have been described in a variety of cells. This study focuses on caffeine-induced ' +
          '[Ca2+]i oscillations in sympathetic neurons. Previous work has shown that these oscillations require Ca2+ ' +
          'entry from the extracellular medium and Ca(2+)-induced Ca2+ release from a caffeine- and ryanodine-sensitive ' +
          'store. The aim of the study was to understand the mechanism responsible for the oscillations. As a starting ' +
          'point, [Ca2+]i relaxations were examined after membrane depolarization and exposure to caffeine. For both ' +
          'stimuli, post-stimulus relaxations could be described by the sum of two decaying exponential functions, ' +
          'consistent with a one-pool system in which Ca2+ transport between compartments is regulated by linear Ca2+ ' +
          'pumps and leaks. After modifying the store to include a [Ca2+]i-sensitive leak, the model also exhibits ' +
          'oscillations such as those observed experimentally. The model was tested by comparing measured and predicted ' +
          'net Ca2+ fluxes during the oscillatory cycle. Three independent fluxes were measured, describing the rates ' +
          'of 1) Ca2+ entry across the plasma membrane, 2) Ca2+ release by the internal store, and 3) Ca2+ extrusion ' +
          'across the plasma membrane and uptake by the internal store. Starting with estimates of the model parameters ' +
          'deduced from post-stimulus relaxations and the rapid upstroke, a set of parameter values was found that ' +
          'provides a good description of [Ca2+]i throughout the oscillatory cycle. With the same parameter values, ' +
          'there was also good agreement between the measured and simulated net fluxes. Thus, a one-pool model with a ' +
          'single [Ca2+]i-sensitive Ca2+ permeability is adequate to account for many of the quantitative properties ' +
          'of steady-state [Ca2+]i oscillations in sympathetic neurons. Inactivation of the intracellular Ca2+ ' +
          'permeability, cooperative nonlinear Ca2+ uptake and extrusion mechanisms, and functional links between ' +
          'plasma membrane Ca2+ transport and the internal store are not required.',
      },
    ],
    tasks: [
      {
        ..._simRunTaskSummary,
        simulation: { ..._simRunSimulationSummary },
        model: { ..._simRunModelSummary, language: _simRunModelLanguageSummary_SBML },
      },
    ],
  },
};

export const projectSummary_mock2: ProjectSummary = {
  ..._projectSummary_mock,
  id: '3fd',
  simulationRun: {
    ..._simRunSummary,
    run: {
      ..._simRunRunSummary,
      simulator: { name: 'VCell', url: 'VCell_URL', id: 'VCell_id', version: '7.5.0_27', digest: 'abc' },
    },
    outputs: [{ type: { id: 'SedReport', url: '', name: '' }, uri: '' }],
    id: 'id2',
    metadata: [
      {
        ..._simulationRunMetadataSummary_mock,
        citations: [{ label: 'paper2 (2021)', uri: 'doi:paper2' }],
        encodes: [{ label: 'signaling', uri: 'signaling_uri' }],
        keywords: [{ label: 'keyword2', uri: 'obo:keyword2' }],
        taxa: [{ label: 'yeast', uri: 'yeastURI' }],
        title: '3fd',
        description:
          'This CellML model runs in COR and OpenCell and the units are consistent throughout. It reproduces ' +
          'the published results and was converted from SBML with the help of Lukas Endler. Validation was done in both ' +
          'CellML and Matlab, Matlab was used to simulate variations in GAP and R concentrations and to reproduce figures ' +
          '3A and B.',
        abstract:
          'There is increasing evidence for a major and critical involvement of lipids in signal transduction ' +
          'and cellular trafficking, and this has motivated large-scale studies on lipid pathways. The Lipid Metabolites ' +
          'and Pathways Strategy consortium is actively investigating lipid metabolism in mammalian cells and has made ' +
          'available time-course data on various lipids in response to treatment with KDO(2)-lipid A ' +
          '(a lipopolysaccharide analog) of macrophage RAW 264.7 cells. The lipids known as eicosanoids play an important ' +
          'role in inflammation. We have reconstructed an integrated network of eicosanoid metabolism and signaling ' +
          'based on the KEGG pathway database and the literature and have developed a kinetic model. A matrix-based ' +
          'approach was used to estimate the rate constants from experimental data and these were further refined using ' +
          'generalized constrained nonlinear optimization. The resulting model fits the experimental data well for all ' +
          'species, and simulated enzyme activities were similar to their literature values. The quantitative model for ' +
          'eicosanoid metabolism that we have developed can be used to design experimental studies utilizing genetic and ' +
          'pharmacological perturbations to probe fluxes in lipid pathways.',
      },
    ],
    tasks: [
      {
        ..._simRunTaskSummary,
        simulation: {
          ..._simRunSimulationSummary,
          algorithm: { name: 'algorithm2', url: 'algorithm2_URL', kisaoId: 'algorithm2_KISAOid' },
          type: { id: '', url: '', name: 'SED-ML simType2 simulation' },
        },
        model: { ..._simRunModelSummary, language: _simRunModelLanguageSummary_CELLML },
      },
    ],
  },
};

export const projectSummary_mock3: ProjectSummary = {
  ..._projectSummary_mock,
  id: 'model3',
  simulationRun: {
    ..._simRunSummary,
    run: {
      ..._simRunRunSummary,
      simulator: { name: 'COPASI', url: 'COPASI_URL', id: 'COPASI_id', version: '1.2.3', digest: 'def' },
    },
    outputs: [{ type: { id: 'SedReport', url: '', name: '' }, uri: '' }],
    id: 'model3',
    metadata: [
      {
        ..._simulationRunMetadataSummary_mock,
        citations: [{ label: 'paper3 (2020)', uri: 'doi:paper3' }],
        encodes: [{ label: 'metabolism', uri: 'metabolism_uri' }],
        keywords: [{ label: 'keyword3', uri: 'obo:keyword3' }],
        taxa: [{ label: 'mouse', uri: 'mouseURI' }],
        title: 'simple model',
        description: 'This is a simple model',
        abstract:
          'When in the Course of human events it becomes necessary for one people to dissolve the political ' +
          'bands which have connected them with another, and to assume among the Powers of the earth, the separate ' +
          "and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the " +
          'opinions of',
      },
    ],
    tasks: [
      {
        ..._simRunTaskSummary,
        simulation: {
          ..._simRunSimulationSummary,
          algorithm: { name: 'algorithm3', url: 'algorithm3_URL', kisaoId: 'algorithm3_KISAOid' },
          type: { id: '', url: '', name: 'SED-ML simType3 simulation' },
        },
        model: { ..._simRunModelSummary, language: _simRunModelLanguageSummary_VCML },
      },
    ],
  },
};
