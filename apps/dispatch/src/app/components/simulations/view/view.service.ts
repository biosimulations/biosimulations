import { Injectable } from '@angular/core';
import { urls } from '@biosimulations/config/common';
import { Simulation } from '../../../datamodel';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { FormattedSimulation } from './view.model';
import { UtilsService } from '@biosimulations/shared/services';
import { ArchiveMetadata, SimulationRunMetadata } from '@biosimulations/datamodel/api';
import {
  CombineArchiveElementMetadata,
  Metadata,
} from '../../../datamodel/metadata.interface';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor() { }

  private formatElementMetadata(elementMetadata: ArchiveMetadata | undefined): CombineArchiveElementMetadata {
    return {
      ...elementMetadata,
      sources: elementMetadata?.sources || [],
      encodes: elementMetadata?.encodes || [],
      taxa: elementMetadata?.taxa || [],
      thumbnails: elementMetadata?.thumbnails || [],
      description: elementMetadata?.description || null,
      keywords: elementMetadata?.keywords?.map(k => k.label || "") || [],
      abstract: elementMetadata?.abstract ? elementMetadata.abstract : null,
      uri: elementMetadata?.uri ? elementMetadata.uri : null,
      title: elementMetadata?.title ? elementMetadata.title : null,
      predecessors: elementMetadata?.predecessors || [],
      successors: elementMetadata?.successors || [],
      creators: elementMetadata?.creators || [],
      contributors: elementMetadata?.contributors || [],
      license: elementMetadata?.license || null,
      funders: elementMetadata?.funders || [],
      seeAlso: elementMetadata?.seeAlso || [],
      identifiers: elementMetadata?.identifiers || [],
      citations: elementMetadata?.citations || [],
      created: elementMetadata?.created || null,
      modified: elementMetadata?.modified || [],
      other: elementMetadata?.other?.map(value => {
        return {
          attribute: { uri: value.attribute_uri || null, label: value.attribute_label || null },
          value: { uri: value.uri, label: value.label }
        }
      }) || [],
    }
  }
    
  public formatMetadata(simulationMetadata: SimulationRunMetadata): Metadata {
    const allMetadta = simulationMetadata.metadata;
    const archiveMetadata =this.formatElementMetadata( allMetadta.find(
      (m) => (m.uri = simulationMetadata.id),
    ));
 
    const otherMetadata =
      (allMetadta.filter((m) => m.uri !== simulationMetadata.id) || []).map(this.formatElementMetadata);

    const metadata: Metadata = {
      archive: archiveMetadata,
      other: otherMetadata,
      validationReport: null,
    };
    return metadata as Metadata;
  }

  public formatSimulation(simulation: Simulation): FormattedSimulation {
    const statusRunning = SimulationStatusService.isSimulationStatusRunning(
      simulation.status,
    );
    const statusSucceeded = SimulationStatusService.isSimulationStatusSucceeded(
      simulation.status,
    );
    return {
      id: simulation.id,
      name: simulation.name,
      simulator: simulation.simulator,
      simulatorVersion: simulation.simulatorVersion,
      cpus: simulation.cpus || 1,
      memory: simulation.memory || 8,
      maxTime: simulation.maxTime || 20,
      envVars: simulation.envVars || [],
      status: simulation.status,
      statusRunning: statusRunning,
      statusSucceeded: statusSucceeded,
      statusLabel: SimulationStatusService.getSimulationStatusMessage(
        simulation.status,
        true,
      ),
      // runtime:
      //   simulation.runtime !== undefined
      //     ? Math.round(simulation.runtime / 1000).toString() + ' s'
      //     : 'N/A',
      submitted: UtilsService.getDateTimeString(new Date(simulation.submitted)),
      updated: UtilsService.getDateTimeString(new Date(simulation.updated)),
      projectSize:
        simulation.projectSize !== undefined
          ? (simulation.projectSize / 1024).toFixed(2) + ' KB'
          : '',
      resultsSize:
        simulation.resultsSize !== undefined
          ? (simulation.resultsSize / 1024).toFixed(2) + ' KB'
          : 'N/A',
      projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
      simulatorUrl: `${urls.simulators}/simulators/${simulation.simulator}/${simulation.simulatorVersion}`,
      resultsUrl: `${urls.dispatchApi}results/${simulation.id}/download`,
    };
  }
}
