import { beforeAll, describe, expect, it } from '@jest/globals';
import { ProjectsSearch } from './projects.search';
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

describe('ProjectsSearch', () => {
  let projectsSearch: ProjectsSearch;

  beforeAll(() => {
    const simRunMetadata: SimulationRunMetadataSummary = {
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
    const simRunModelLanguageSummary_SBML: SimulationRunModelLanguageSummary = {
      name: 'SBML',
      sedmlUrn: '',
    };
    const simRunModelLanguageSummary_VCML: SimulationRunModelLanguageSummary = {
      name: 'VCML',
      sedmlUrn: '',
    };
    const simRunModelLanguageSummary_CELLML: SimulationRunModelLanguageSummary = {
      name: 'CELLML',
      sedmlUrn: '',
    };
    const simRunModelSummary: SimulationRunModelSummary = {
      id: '',
      language: simRunModelLanguageSummary_SBML,
      source: '',
      uri: '',
    };
    const simRunAlgorithmSummary: SimulationRunAlgorithmSummary = {
      kisaoId: '',
      name: '',
      url: '',
    };
    const typeSummary: TypeSummary = {
      id: '',
      name: '',
      url: '',
    };
    const simRunSimulationSummary: SimulationRunSimulationSummary = {
      algorithm: simRunAlgorithmSummary,
      id: '',
      type: typeSummary,
      uri: '',
    };
    const simRunTaskSummary: SimulationRunTaskSummary = {
      id: '',
      model: simRunModelSummary,
      simulation: simRunSimulationSummary,
      uri: '',
    };
    const simRunSimSummary: SimulationRunSimulatorSummary = {
      digest: '',
      id: '',
      name: '',
      url: '',
      version: '',
    };
    const simRunRunSummary: SimulationRunRunSummary = {
      cpus: 0,
      envVars: [],
      maxTime: 0,
      memory: 0,
      simulator: { ...simRunSimSummary },
      status: SimulationRunStatus.SUCCEEDED,
    };
    const simRunSummary: SimulationRunSummary = {
      id: '',
      name: '',
      run: { ...simRunRunSummary },
      submitted: '',
      updated: '',
    };
    const projectSummary_mock: ProjectSummary = {
      created: '',
      id: '',
      simulationRun: { ...simRunSummary },
      updated: '',
    };
    projectsSearch = new ProjectsSearch();

    const projectSummary1: ProjectSummary = {
      ...projectSummary_mock,
      id: 'Ca2i-oscillations-in-sympathetic-neurons--an-experimental-test-of-a-theoretical-model',
      simulationRun: {
        ...simRunSummary,
        id: 'id2',
        metadata: [
          {
            ...simRunMetadata,
            title: '[Ca2+]i oscillations in sympathetic neurons: an experimental test of a theoretical model',
            description:
              'This CellML model runs in OpenCell and COR, and reproduces Figure 4 from the original paper. ' +
              'The results match output from a reference (IgorPro) implementation of the model provided by David Friel.',
            abstract:
              '[Ca2+]i oscillations have been described in a variety of cells. This study focuses on caffeine-induced ' +
              '[Ca2+]i oscillations in sympathetic neurons. Previous work has shown that these oscillations require Ca2+ ' +
              'entry from the extracellular medium and Ca(2+)-induced Ca2+ release from a caffeine- and ryanodine-sensitive store. ' +
              'The aim of the study was to understand the mechanism responsible for the oscillations. As a starting point, ' +
              '[Ca2+]i relaxations were examined after membrane depolarization and exposure to caffeine. For both stimuli, ' +
              'post-stimulus relaxations could be described by the sum of two decaying exponential functions, consistent with ' +
              'a one-pool system in which Ca2+ transport between compartments is regulated by linear Ca2+ pumps and leaks. ' +
              'After modifying the store to include a [Ca2+]i-sensitive leak, the model also exhibits oscillations such as ' +
              'those observed experimentally. The model was tested by comparing measured and predicted net Ca2+ fluxes during ' +
              'the oscillatory cycle. Three independent fluxes were measured, describing the rates of 1) Ca2+ entry across the ' +
              'plasma membrane, 2) Ca2+ release by the internal store, and 3) Ca2+ extrusion across the plasma membrane and uptake ' +
              'by the internal store. Starting with estimates of the model parameters deduced from post-stimulus relaxations and ' +
              'the rapid upstroke, a set of parameter values was found that provides a good description of [Ca2+]i throughout the ' +
              'oscillatory cycle. With the same parameter values, there was also good agreement between the measured and simulated ' +
              'net fluxes. Thus, a one-pool model with a single [Ca2+]i-sensitive Ca2+ permeability is adequate to account for many ' +
              'of the quantitative properties of steady-state [Ca2+]i oscillations in sympathetic neurons. Inactivation of the ' +
              'intracellular Ca2+ permeability, cooperative nonlinear Ca2+ uptake and extrusion mechanisms, and functional links ' +
              'between plasma membrane Ca2+ transport and the internal store are not required.',
          },
        ],
        tasks: [{ ...simRunTaskSummary, model: { ...simRunModelSummary, language: simRunModelLanguageSummary_SBML } }],
      },
    };
    const projectSummary2: ProjectSummary = {
      ...projectSummary_mock,
      id: '3fd',
      simulationRun: {
        ...simRunSummary,
        id: 'id2',
        metadata: [
          {
            ...simRunMetadata,
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
              'role in inflammation. We have reconstructed an integrated network of eicosanoid metabolism and signaling based ' +
              'on the KEGG pathway database and the literature and have developed a kinetic model. A matrix-based approach ' +
              'was used to estimate the rate constants from experimental data and these were further refined using generalized ' +
              'constrained nonlinear optimization. The resulting model fits the experimental data well for all species, and ' +
              'simulated enzyme activities were similar to their literature values. The quantitative model for eicosanoid ' +
              'metabolism that we have developed can be used to design experimental studies utilizing genetic and ' +
              'pharmacological perturbations to probe fluxes in lipid pathways.',
          },
        ],
        tasks: [
          { ...simRunTaskSummary, model: { ...simRunModelSummary, language: simRunModelLanguageSummary_CELLML } },
        ],
      },
    };
    const projectSummary3: ProjectSummary = {
      ...projectSummary_mock,
      id: 'model3',
      simulationRun: {
        ...simRunSummary,
        id: 'model3',
        metadata: [
          {
            ...simRunMetadata,
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
            ...simRunTaskSummary,
            model: {
              ...simRunModelSummary,
              language: simRunModelLanguageSummary_VCML,
            },
          },
        ],
      },
    };
    projectsSearch.addDocument(projectSummary1);
    projectsSearch.addDocument(projectSummary2);
    projectsSearch.addDocument(projectSummary3);
  });

  it('should find one result for KEGG', () => {
    const results: ProjectSummary[] = projectsSearch.search('KEGG');
    expect(results).toBeDefined();
    expect(results.length == 1).toBeTruthy();
    expect(results[0].id == '3fd').toBeTruthy();
  });

  it('should find one result for VCML', () => {
    const results: ProjectSummary[] = projectsSearch.search('VCML');
    expect(results).toBeDefined();
    expect(results.length == 1).toBeTruthy();
    expect(results[0].id == 'model3').toBeTruthy();
  });

  it('should find not find "needle"', () => {
    const results: ProjectSummary[] = projectsSearch.search('needle');
    expect(results).toBeDefined();
    expect(results.length == 0).toBeTruthy();
  });
});
