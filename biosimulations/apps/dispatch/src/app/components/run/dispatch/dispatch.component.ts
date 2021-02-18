import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DispatchService,
  SimulatorSpecsMap,
} from '../../../services/dispatch/dispatch.service';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { Simulation } from '../../../datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { combineLatest, Observable } from 'rxjs';
import { ConfigService } from '@biosimulations/shared/services';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { SimulationRun } from '@biosimulations/dispatch/api-models';

interface SimulatorIdDisabled {
  id: string;
  disabled: boolean;
}

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {
  submitMethod: 'file' | 'url' = 'file';
  formGroup: FormGroup;
  simulators: SimulatorIdDisabled[] = [];
  simulatorVersions: string[] = [];

  simulatorSpecsMap: SimulatorSpecsMap | undefined = undefined;

  simulationId: string | undefined = undefined;

  exampleCombineArchiveUrl: string;
  exampleCombineArchivesUrl: string;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
  ) {
    this.formGroup = this.formBuilder.group({
      projectFile: [''],
      projectURL: [''],
      submitMethod: [this.submitMethod],
      simulator: ['', [Validators.required]],
      simulatorVersion: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
    });

    this.exampleCombineArchivesUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
    this.exampleCombineArchiveUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/raw' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoPath +
      this.config.appConfig.exampleCombineArchives.examplePath;
  }

  ngOnInit(): void {
    this.formGroup.controls.simulator.disable();
    this.formGroup.controls.simulatorVersion.disable();

    combineLatest([
      this.dispatchService.getSimulatorsFromDb(),
      this.route.queryParams,
    ]).subscribe((observerableValues: [SimulatorSpecsMap, Params]): void => {
      const simulatorSpecsMap = observerableValues[0];
      const params = observerableValues[1];

      this.simulatorSpecsMap = simulatorSpecsMap;
      this.simulators = Object.keys(this.simulatorSpecsMap).map(
        (id: string): SimulatorIdDisabled => {
          return { id: id, disabled: false };
        },
      );

      this.simulators.sort(
        (a: SimulatorIdDisabled, b: SimulatorIdDisabled): number => {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        },
      );

      this.formGroup.controls.simulator.enable();

      // process query arguments
      // const projectUrl = params?.projectUrl; // TODO: support loading COMBINE archive URL by query argument

      let modelFormat = params?.modelFormat?.toLowerCase();
      if (modelFormat) {
        const match = modelFormat.match(/^(format[:_])?(\d{1,4})$/);
        if (match) {
          modelFormat = 'format_' + '0'.repeat(4 - match[2].length) + match[2];
        }
      }

      let modelingFramework = params?.modelingFramework?.toUpperCase();
      if (modelingFramework) {
        const match = modelingFramework.match(/^(SBO[:_])?(\d{1,7})$/);
        if (match) {
          modelingFramework =
            'SBO_' + '0'.repeat(7 - match[2].length) + match[2];
        }
      }

      const simulator: string = params?.simulator?.toLowerCase();
      const simulatorVersion: string = params?.simulatorVersion;

      if (modelFormat || modelingFramework) {
        this.simulators.forEach(
          (simulatorIdDisabled: SimulatorIdDisabled): void => {
            let enabled = false;
            for (const modelingFrameworksForModelFormats of simulatorSpecsMap[
              simulatorIdDisabled.id
            ].modelingFrameworksForModelFormats) {
              if (
                (!modelFormat ||
                  modelingFrameworksForModelFormats.formatEdamIds.includes(
                    modelFormat,
                  )) &&
                (!modelingFramework ||
                  modelingFrameworksForModelFormats.frameworkSboIds.includes(
                    modelingFramework,
                  ))
              ) {
                enabled = true;
                break;
              }
            }
            simulatorIdDisabled.disabled = !enabled;
          },
        );
      }

      if (simulator) {
        this.formGroup.controls.simulator.setValue(simulator);
        this.onSimulatorChange({ value: simulator });
        if (simulatorVersion) {
          this.formGroup.controls.simulatorVersion.setValue(simulatorVersion);
        }
      }
    });
    this.toggleSubmitMethod(this.submitMethod);
  }

  toggleSubmitMethod(method: 'file' | 'url') {
    this.submitMethod = method;
    if (method == 'file') {
      this.formGroup.controls.projectFile.enable();
      this.formGroup.controls.projectFile.setValidators(Validators.required);
      this.formGroup.controls.projectFile.updateValueAndValidity();
      this.formGroup.controls.projectURL.disable();
    } else {
      this.formGroup.controls.projectFile.disable();
      this.formGroup.controls.projectURL.enable();
      this.formGroup.controls.projectURL.setValidators(Validators.required);
      this.formGroup.controls.projectURL.updateValueAndValidity();
    }
  }
  onFormSubmit() {
    this.simulationId = undefined;

    if (!this.formGroup.valid) {
      return;
    }

    const simulator: string = this.formGroup.value.simulator;
    const simulatorVersion: string = this.formGroup.value.simulatorVersion;
    const name: string = this.formGroup.value.name;
    const email: string = this.formGroup.value.email;

    let simulationResponse: Observable<SimulationRun>;
    if (this.submitMethod == 'file') {
      const projectFile: File = this.formGroup.value.projectFile;

      simulationResponse = this.dispatchService.submitJob(
        projectFile,
        simulator,
        simulatorVersion,
        name,
        email,
      );
    } else {
      const projectURL: string = this.formGroup.value.projectURL;
      simulationResponse = this.dispatchService.sumbitJobURL(
        projectURL,
        simulator,
        simulatorVersion,
        name,
        email,
      );
    }
    simulationResponse.subscribe((data: SimulationRun) =>
      this.processSimulationResponse(
        data,
        name,
        simulator,
        simulatorVersion,
        email,
      ),
    );
  }

  private processSimulationResponse(
    data: any,
    name: string,
    simulator: string,
    simulatorVersion: string,
    email?: string,
  ): void {
    const simulationId = data['id'];

    this.simulationId = simulationId;

    const simulation: Simulation = {
      id: simulationId,
      name: name,
      email: email,
      simulator: simulator,
      simulatorVersion: simulatorVersion,
      submittedLocally: true,
      status: SimulationRunStatus.QUEUED,
      runtime: undefined,
      submitted: new Date(),
      updated: new Date(),
    };
    this.simulationService.storeNewLocalSimulation(simulation);
  }
  onSimulatorChange($event: any) {
    if (this.simulatorSpecsMap !== undefined) {
      this.simulatorVersions = this.simulatorSpecsMap[$event.value].versions;
      this.formGroup.controls.simulatorVersion.enable();
      this.formGroup.controls.simulatorVersion.setValue(
        this.simulatorVersions[0],
      );
    }
  }
}
