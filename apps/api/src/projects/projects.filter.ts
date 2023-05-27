import { ProjectFilterQueryItem, ProjectFilterStatsItem, ProjectSummary } from '@biosimulations/datamodel/api';
import { ProjectFilterTarget } from '@biosimulations/datamodel/common';
import { logger } from 'nx/src/utils/logger';
import {
  getProjectSummary_Biologies,
  getProjectSummary_Keywords,
  getProjectSummary_ModelFormats,
  getProjectSummary_Reports,
  getProjectSummary_SimulationAlgorithms,
  getProjectSummary_SimulationTypes,
  getProjectSummary_Simulators,
  getProjectSummary_Taxa,
} from '@biosimulations/datamodel/common';

function getFrequencyMap(projectFilterTarget: ProjectFilterTarget, values: string[]): ProjectFilterStatsItem {
  const frequencyMap = new Map<string, number>();
  values.forEach((str: string): void => {
    const currCount: number | undefined = frequencyMap.get(str);
    if (currCount) {
      frequencyMap.set(str, currCount + 1);
    } else {
      frequencyMap.set(str, 1);
    }
  });
  const valueFrequencies: { value: string; count: number }[] = [];
  frequencyMap.forEach((count: number, key: string) => valueFrequencies.push({ value: key, count: count }));
  return { target: projectFilterTarget, valueFrequencies: valueFrequencies };
}

export function gatherFilterValueStatistics(projectSummaries: ProjectSummary[]): ProjectFilterStatsItem[] {
  const projFilterStatsItems: ProjectFilterStatsItem[] = [];
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.biology,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_Biologies(project).values())),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.taxa,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_Taxa(project).values())),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.simulator,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_Simulators(project).values())),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.reports,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_Reports(project).values())),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.simulationAlgorithms,
      projectSummaries.flatMap<string>((project) =>
        Array.from(getProjectSummary_SimulationAlgorithms(project).values()),
      ),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.simulationTypes,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_SimulationTypes(project).values())),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.keywords,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_Keywords(project).values())),
    ),
  );
  projFilterStatsItems.push(
    getFrequencyMap(
      ProjectFilterTarget.modelFormats,
      projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_ModelFormats(project).values())),
    ),
  );
  // projFilterStatsItems.push(
  //   getFrequencyMap(
  //     ProjectFilterTarget.citations,
  //     projectSummaries.flatMap<string>((project) => Array.from(getProjectSummary_Citations(project).values())),
  //   ),
  // );
  return projFilterStatsItems;
}

export function applyFilter(projectSummaries: ProjectSummary[], filters: ProjectFilterQueryItem[]): ProjectSummary[] {
  if (!filters || filters.length == 0) {
    return projectSummaries;
  }
  let filterdProjectSummaries: ProjectSummary[] = [...projectSummaries];
  for (const filter of filters) {
    if (filter.allowable_values.length < 1) {
      continue;
    }
    switch (filter.target) {
      case ProjectFilterTarget.biology:
        filterdProjectSummaries = filterdProjectSummaries.filter((project): boolean => {
          const biologySet: Set<string> = getProjectSummary_Biologies(project);
          return biologySet.size > 0 && filter.allowable_values.some((value) => biologySet.has(value));
        });
        break;
      // case ProjectFilterTarget.citations:
      //   filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
      //     const citationSet: Set<string> = getProjectSummary_Citations(project);
      //     return citationSet.size > 0 && filter.allowable_values.some((value) => citationSet.has(value));
      //   });
      //   break;
      case ProjectFilterTarget.keywords:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const keywordSet: Set<string> = getProjectSummary_Keywords(project);
          return keywordSet.size > 0 && filter.allowable_values.some((value) => keywordSet.has(value));
        });
        break;
      case ProjectFilterTarget.modelFormats:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const modelFormats: Set<string> = getProjectSummary_ModelFormats(project);
          return modelFormats.size > 0 && filter.allowable_values.some((value) => modelFormats.has(value));
        });
        break;
      case ProjectFilterTarget.reports:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const reportsSet: Set<string> = getProjectSummary_Reports(project);
          return reportsSet.size > 0 && filter.allowable_values.some((value) => reportsSet.has(value));
        });
        break;
      case ProjectFilterTarget.simulationAlgorithms:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const simulationAlgorithms: Set<string> = getProjectSummary_SimulationAlgorithms(project);
          return (
            simulationAlgorithms.size > 0 && filter.allowable_values.some((value) => simulationAlgorithms.has(value))
          );
        });
        break;
      case ProjectFilterTarget.simulationTypes:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const simulationTypes: Set<string> = getProjectSummary_SimulationTypes(project);
          return simulationTypes.size > 0 && filter.allowable_values.some((value) => simulationTypes.has(value));
        });
        break;
      case ProjectFilterTarget.simulator:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const simulators: Set<string> = getProjectSummary_Simulators(project);
          return simulators.size > 0 && filter.allowable_values.some((value) => simulators.has(value));
        });
        break;
      case ProjectFilterTarget.taxa:
        filterdProjectSummaries = filterdProjectSummaries.filter((project) => {
          const taxa: Set<string> = getProjectSummary_Taxa(project);
          return taxa.size > 0 && filter.allowable_values.some((value) => taxa.has(value));
        });
        break;
      default:
        logger.error(`skipping filter with unsupported target ${filter.target}`);
    }
  }
  return filterdProjectSummaries;
}
