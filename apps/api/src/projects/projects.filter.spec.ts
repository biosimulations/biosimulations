import { describe, expect, it } from '@jest/globals';
import { ProjectFilterQueryItem, ProjectSummary } from '@biosimulations/datamodel/api';

import { projectSummary_mock1, projectSummary_mock2, projectSummary_mock3 } from './projects.mock';
import {
  applyFilter,
  getProjectSummary_Biologies,
  getProjectSummary_Citations,
  getProjectSummary_Keywords,
  getProjectSummary_ModelFormats,
  getProjectSummary_Reports,
  getProjectSummary_SimulationAlgorithms,
  getProjectSummary_SimulationTypes,
  getProjectSummary_Simulators,
  getProjectSummary_Taxa,
} from './projects.filter';
import { ProjectFilterTarget } from '@biosimulations/datamodel/common';

describe('ProjectsFilter', () => {
  let projects: ProjectSummary[] = [projectSummary_mock1, projectSummary_mock2, projectSummary_mock3];

  it('should extract biology project attribute', () => {
    expect(getProjectSummary_Biologies(projectSummary_mock1)).toEqual(new Set<string>());
    expect(getProjectSummary_Biologies(projectSummary_mock2)).toEqual(new Set<string>(['signaling']));
    expect(getProjectSummary_Biologies(projectSummary_mock3)).toEqual(new Set<string>(['metabolism']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.biology, allowable_values: ['signaling'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock2]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.biology, allowable_values: ['cell cycle'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([]);
    const filters3: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.biology, allowable_values: ['cell cycle', 'signaling'] },
    ];
    expect(applyFilter(projects, filters3)).toEqual([projectSummary_mock2]);
    const filters4: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.biology, allowable_values: ['metabolism', 'signaling'] },
    ];
    expect(applyFilter(projects, filters4)).toEqual([projectSummary_mock2, projectSummary_mock3]);
    const filters5: ProjectFilterQueryItem[] = [];
    expect(applyFilter(projects, filters5)).toEqual([projectSummary_mock1, projectSummary_mock2, projectSummary_mock3]);
  });

  it('should extract citations project attribute', () => {
    expect(getProjectSummary_Citations(projectSummary_mock1)).toEqual(new Set<string>());
    expect(getProjectSummary_Citations(projectSummary_mock2)).toEqual(new Set<string>(['paper2 (2021)']));
    expect(getProjectSummary_Citations(projectSummary_mock3)).toEqual(new Set<string>(['paper3 (2020)']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.citations, allowable_values: ['paper3 (2020)'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock3]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.citations, allowable_values: ['paper4 (1999)'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([]);
  });

  it('should extract keywords project attribute', () => {
    expect(getProjectSummary_Keywords(projectSummary_mock1)).toEqual(new Set<string>());
    expect(getProjectSummary_Keywords(projectSummary_mock2)).toEqual(new Set<string>(['keyword2']));
    expect(getProjectSummary_Keywords(projectSummary_mock3)).toEqual(new Set<string>(['keyword3']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.keywords, allowable_values: ['keyword3'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock3]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.keywords, allowable_values: ['keyword4'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([]);
  });

  it('should extract modelFormats project attribute', () => {
    expect(getProjectSummary_ModelFormats(projectSummary_mock1)).toEqual(new Set<string>(['SBML']));
    expect(getProjectSummary_ModelFormats(projectSummary_mock2)).toEqual(new Set<string>(['CellML']));
    expect(getProjectSummary_ModelFormats(projectSummary_mock3)).toEqual(new Set<string>(['VCML']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.modelFormats, allowable_values: ['SBML'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock1]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.modelFormats, allowable_values: ['CellML', 'VCML'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([projectSummary_mock2, projectSummary_mock3]);
  });

  it('should extract reports project attribute', () => {
    expect(getProjectSummary_Reports(projectSummary_mock1)).toEqual(new Set<string>(['false']));
    expect(getProjectSummary_Reports(projectSummary_mock2)).toEqual(new Set<string>(['true']));
    expect(getProjectSummary_Reports(projectSummary_mock3)).toEqual(new Set<string>(['true']));
    const filters1: ProjectFilterQueryItem[] = [{ target: ProjectFilterTarget.reports, allowable_values: ['true'] }];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock2, projectSummary_mock3]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.reports, allowable_values: ['true', 'false'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([projectSummary_mock1, projectSummary_mock2, projectSummary_mock3]);
  });

  it('should extract simulationAlgorithm project attribute', () => {
    expect(getProjectSummary_SimulationAlgorithms(projectSummary_mock1)).toEqual(new Set<string>(['defaultAlgorithm']));
    expect(getProjectSummary_SimulationAlgorithms(projectSummary_mock2)).toEqual(new Set<string>(['algorithm2']));
    expect(getProjectSummary_SimulationAlgorithms(projectSummary_mock3)).toEqual(new Set<string>(['algorithm3']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.simulationAlgorithms, allowable_values: ['algorithm2'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock2]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.simulationAlgorithms, allowable_values: ['algorithm2', 'algorithm3'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([projectSummary_mock2, projectSummary_mock3]);
  });

  it('should extract simulationType project attribute', () => {
    expect(getProjectSummary_SimulationTypes(projectSummary_mock1)).toEqual(new Set<string>(['DefaultSimType']));
    expect(getProjectSummary_SimulationTypes(projectSummary_mock2)).toEqual(new Set<string>(['SimType2']));
    expect(getProjectSummary_SimulationTypes(projectSummary_mock3)).toEqual(new Set<string>(['SimType3']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.simulationTypes, allowable_values: ['SimType2'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock2]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.simulationTypes, allowable_values: ['SimType2', 'SimType3'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([projectSummary_mock2, projectSummary_mock3]);
  });

  it('should extract simulator project attribute', () => {
    expect(getProjectSummary_Simulators(projectSummary_mock1)).toEqual(new Set<string>(['defaultSimulator1.0.0']));
    expect(getProjectSummary_Simulators(projectSummary_mock2)).toEqual(new Set<string>(['VCell7.5.0.27']));
    expect(getProjectSummary_Simulators(projectSummary_mock3)).toEqual(new Set<string>(['COPASI1.2.3']));
    const filters1: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.simulator, allowable_values: ['VCell7.5.0.27'] },
    ];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock2]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.simulator, allowable_values: ['VCell7.5.0.27', 'COPASI1.2.3'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([projectSummary_mock2, projectSummary_mock3]);
  });

  it('should extract taxa project attribute', () => {
    expect(getProjectSummary_Taxa(projectSummary_mock1)).toEqual(new Set<string>(['defaultTaxa']));
    expect(getProjectSummary_Taxa(projectSummary_mock2)).toEqual(new Set<string>(['yeast']));
    expect(getProjectSummary_Taxa(projectSummary_mock3)).toEqual(new Set<string>(['mouse']));
    const filters1: ProjectFilterQueryItem[] = [{ target: ProjectFilterTarget.taxa, allowable_values: ['yeast'] }];
    expect(applyFilter(projects, filters1)).toEqual([projectSummary_mock2]);
    const filters2: ProjectFilterQueryItem[] = [
      { target: ProjectFilterTarget.taxa, allowable_values: ['yeast', 'mouse'] },
    ];
    expect(applyFilter(projects, filters2)).toEqual([projectSummary_mock2, projectSummary_mock3]);
  });
});
