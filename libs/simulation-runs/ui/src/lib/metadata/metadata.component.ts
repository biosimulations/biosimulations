/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Component, Input } from '@angular/core';
import { ProjectMetadata, SimulationRunMetadata } from '@biosimulations/datamodel-simulation-runs';
import {
  ProjectSummary,
  getProjectSummary_Biologies,
  getProjectSummary_ModelFormats,
  getProjectSummary_SimulationTypes,
  getProjectSummary_Simulators,
  getProjectSummary_Taxa,
  getProjectSummary_CitationLabeledIdentifiers,
  LabeledIdentifier,
} from '@biosimulations/datamodel/common';

@Component({
  selector: 'biosimulations-project-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss'],
})
export class MetadataComponent {
  @Input()
  public project?: ProjectMetadata;

  @Input()
  public projectSummary?: ProjectSummary | null;

  @Input()
  public simulationRun?: SimulationRunMetadata;

  @Input()
  public simulationViz!: any;

  public panelOpenState = false;

  constructor() {
    /* constructor is empty */
  }

  public togglePanel(event: Event): void {
    event.stopPropagation();
    this.panelOpenState = !this.panelOpenState;
  }

  public biologyList(projectSummary: ProjectSummary): string[] | undefined {
    const biologySet: Set<string> = getProjectSummary_Biologies(projectSummary);
    if (biologySet.size == 0) {
      return undefined;
    } else {
      return Array.from(biologySet);
    }
  }

  public taxaList(projectSummary: ProjectSummary): string[] | undefined {
    const taxaSet: Set<string> = getProjectSummary_Taxa(projectSummary);
    if (taxaSet.size == 0) {
      return undefined;
    } else {
      return Array.from(taxaSet);
    }
  }

  public formats(projectSummary: ProjectSummary): string | undefined {
    const modelFormats: Set<string> = getProjectSummary_ModelFormats(projectSummary);
    if (modelFormats.size > 0) {
      return Array.from(modelFormats)[0];
    } else {
      return undefined;
    }
  }

  public simulationType(projectSummary: ProjectSummary): string | undefined {
    const simTypes: Set<string> = getProjectSummary_SimulationTypes(projectSummary);
    if (simTypes.size > 0) {
      return Array.from(simTypes)[0];
    } else {
      return undefined;
    }
  }

  public simulator(projectSummary: ProjectSummary): string | undefined {
    const simulators: Set<string> = getProjectSummary_Simulators(projectSummary);
    if (simulators.size > 0) {
      return Array.from(simulators)[0];
    } else {
      return undefined;
    }
  }

  public citation(projectSummary: ProjectSummary): LabeledIdentifier | undefined {
    const citations: Set<LabeledIdentifier> = getProjectSummary_CitationLabeledIdentifiers(projectSummary);
    if (citations.size > 0) {
      return Array.from(citations)[0];
    } else {
      return undefined;
    }
  }

  public identifiersText(_projectSummary: ProjectSummary): string {
    return 'identifiers text';
  }
}
