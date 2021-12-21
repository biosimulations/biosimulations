export class DataPaths {
  private static simulationRunResultsPath = 'results';

  public constructor() {}

  /**
   * Create a path for the results of a simulation run in a HSDS
   * @param runId Id of the simulation run
   */
  public getSimulationRunResultsPath(runId?: string): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    return `/${DataPaths.simulationRunResultsPath}${runId}`;
  }

  /**
   * Create a domain for the results of a simulation run in a HSDS
   * @param runId Id of the simulation run
   */
  public getSimulationRunResultsDomain(runId?: string): string {
    runId ? (runId = `${runId}.`) : (runId = '');
    return `${runId}${DataPaths.simulationRunResultsPath}`;
  }
}
