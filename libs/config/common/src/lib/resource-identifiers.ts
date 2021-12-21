export class ResourceIdentifiers {
  private static simulatorPrefix = 'biosimulators'
  private static simulationRunPrefix = 'runbiosimulations'
  private static projectPrefix = 'biosimulations'

  public constructor() {}

  public getIdentifier(prefix: string, id: string): string {
    return `http://identifiers.org/${prefix}:${id}`;
  }

  public getSimulatorIdentifier(id: string): string {
    return this.getIdentifier(ResourceIdentifiers.simulatorPrefix, id);
  }

  public getSimulationRunIdentifier(id: string): string {
    return this.getIdentifier(ResourceIdentifiers.simulationRunPrefix, id);
  }

  public getProjectIdentifier(id: string): string {
    return this.getIdentifier(ResourceIdentifiers.projectPrefix, id);
  }
}
