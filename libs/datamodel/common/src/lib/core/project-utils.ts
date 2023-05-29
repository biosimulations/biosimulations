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
