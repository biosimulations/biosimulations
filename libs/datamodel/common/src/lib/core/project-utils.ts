import { LabeledIdentifier } from './archiveMetadata';
import { ProjectSummary } from './project';
import { SimulationRunOutputSummary } from './simulationRun';

export function getProjectSummary_Biologies(project: ProjectSummary): Set<string> {
  const biologies: string[] | undefined = project.simulationRun.metadata
    ?.flatMap((metadata) => metadata.encodes)
    .map((v: LabeledIdentifier) => v.label || v.uri || '');
  return biologies ? new Set<string>(biologies) : new Set<string>();
}

export function getProjectSummary_Citations(project: ProjectSummary): Set<string> {
  const citations: string[] | undefined = project.simulationRun.metadata
    ?.flatMap((metadata) => metadata.citations)
    .map((v: LabeledIdentifier) => v.label || v.uri || '');
  return citations ? new Set<string>(citations) : new Set<string>();
}

export function getProjectSummary_CitationLabeledIdentifiers(project: ProjectSummary): Set<LabeledIdentifier> {
  const citations: LabeledIdentifier[] | undefined = project.simulationRun.metadata
    ?.flatMap((metadata) => metadata.citations)
    .map((v: LabeledIdentifier) => v);
  return citations ? new Set<LabeledIdentifier>(citations) : new Set<LabeledIdentifier>();
}

export function getProjectSummary_Keywords(project: ProjectSummary): Set<string> {
  const keywords: string[] | undefined = project.simulationRun.metadata
    ?.flatMap((metadata) => metadata.keywords)
    .map((v: LabeledIdentifier) => v.label || v.uri || '');
  return keywords ? new Set<string>(keywords) : new Set<string>();
}

export function getProjectSummary_ModelFormats(project: ProjectSummary): Set<string> {
  const modelFormats: string[] | undefined = project.simulationRun.tasks?.flatMap(
    (task): string => task.model.language.acronym || task.model.language.name || task.model.language.sedmlUrn,
  );
  return modelFormats ? new Set<string>(modelFormats) : new Set<string>();
}

export function getProjectSummary_Reports(project: ProjectSummary): Set<string> {
  const simRunOutputSummary: SimulationRunOutputSummary | undefined = project.simulationRun.outputs?.find(
    (output) => output.type.id == 'SedReport',
  );
  return simRunOutputSummary ? new Set<string>(['true']) : new Set<string>(['false']);
}

export function getProjectSummary_SimulationAlgorithms(project: ProjectSummary): Set<string> {
  const simAlgorithms: string[] | undefined = project.simulationRun.tasks?.flatMap(
    (task): string => task.simulation.algorithm.name || task.simulation.algorithm.kisaoId,
  );
  return simAlgorithms ? new Set<string>(simAlgorithms) : new Set<string>();
}

export function getProjectSummary_SimulationTypes(project: ProjectSummary): Set<string> {
  const simulationTypes: string[] | undefined = project.simulationRun.tasks?.flatMap((task): string => {
    const sedmlLength = 'SED-ML'.length;
    return (
      task.simulation.type.name.substring(sedmlLength + 1, sedmlLength + 2).toUpperCase() +
      task.simulation.type.name.substring(sedmlLength + 2, task.simulation.type.name.length - ' simulation'.length)
    );
  });
  return simulationTypes ? new Set<string>(simulationTypes) : new Set<string>();
}

export function getProjectSummary_Simulators(project: ProjectSummary): Set<string> {
  return new Set<string>([
    project.simulationRun.run.simulator.name + ' ' + project.simulationRun.run.simulator.version,
  ]);
}

export function getProjectSummary_Taxa(project: ProjectSummary): Set<string> {
  const taxa: string[] | undefined = project.simulationRun.metadata
    ?.flatMap((metadata) => metadata.taxa)
    .map((v: LabeledIdentifier) => v.label || v.uri || '');
  return taxa ? new Set<string>(taxa) : new Set<string>();
}

export function getProjectSummary_Thumbnails(project: ProjectSummary): Set<string> {
  const thumbnails: string[] | undefined = project.simulationRun.metadata?.flatMap((metadata) => metadata.thumbnails);
  return thumbnails ? new Set<string>(thumbnails) : new Set<string>();
}

export function getProjectSummary_Abstract(project: ProjectSummary): Set<string> {
  if (project.simulationRun.metadata === undefined) return new Set<string>();
  const abstract = project.simulationRun.metadata
    ?.flatMap((metadata) => metadata.abstract)
    .filter((v) => v !== undefined) as string[];
  return abstract ? new Set<string>(abstract) : new Set<string>();
}

export function getProjectSummary_SimulationRunOutputSummaries(
  project: ProjectSummary,
): SimulationRunOutputSummary[] | undefined {
  return project.simulationRun.outputs;
}

export function getProjectSummaryScore(project: ProjectSummary): number {
  const biologySet: Set<string> = getProjectSummary_Biologies(project);
  const keywordSet: Set<string> = getProjectSummary_Keywords(project);
  const reportsSet: Set<string> = getProjectSummary_Reports(project);
  const taxa: Set<string> = getProjectSummary_Taxa(project);
  const thumbnails: Set<string> = getProjectSummary_Thumbnails(project);
  const citations: Set<LabeledIdentifier> = getProjectSummary_CitationLabeledIdentifiers(project);
  const abstract: Set<string> = getProjectSummary_Abstract(project);
  const outputSummaries: SimulationRunOutputSummary[] | undefined =
    getProjectSummary_SimulationRunOutputSummaries(project);
  //const modelFormats: Set<string> = getProjectSummary_ModelFormats(project);
  //const simulationAlgorithms: Set<string> = getProjectSummary_SimulationAlgorithms(project);
  //const simulationTypes: Set<string> = getProjectSummary_SimulationTypes(project);
  //const simulators: Set<string> = getProjectSummary_Simulators(project);

  let score = 0.0;
  score += biologySet.size > 0 ? 0.1 : 0.0;
  score += keywordSet.size > 0 ? 0.1 : 0.0;
  score += reportsSet.size > 0 ? 0.1 : 0.0;
  score += abstract.size > 0 ? 1.0 : 0.0;
  score += thumbnails.size > 0 ? 0.5 : 0.0;
  score += thumbnails.size > 1 ? (thumbnails.size - 1) * 0.002 : 0.0;
  score += taxa.size > 0 ? 0.1 : 0.0;
  score += citations.size > 0 ? 0.1 : 0.0;

  // give a boost to more recently updated projects
  const ms_per_month = 1000 * 60 * 60 * 24 * 30;
  const ageInMonths = (Date.now() - Date.parse(project.updated)) / ms_per_month;
  score += 0.1 * Math.exp(-ageInMonths / 12.0);

  const plots = outputSummaries?.filter((output) => output.type.id == 'SedPlot2D');
  const numPlots = plots?.length || 0;
  switch (numPlots) {
    case 0:
      break;
    case 1:
      score += 0.1;
      break;
    case 2:
      score += 0.2;
      break;
    case 3:
      score += 0.15;
      break;
    default:
      score -= 0.1;
  }
  return score;
}
