import { Component, OnInit } from '@angular/core';
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
import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

  exampleCombineArchiveUrl: string;
  exampleCombineArchivesUrl: string;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group({
      projectFile: [''],
      projectUrl: [''],
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
      const projectUrl = params?.projectUrl;
      if (projectUrl) {
        this.formGroup.controls.submitMethod.setValue('url');
        this.toggleSubmitMethod('url')
        this.formGroup.controls.projectUrl.setValue(projectUrl);
      }

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

      let simulationAlgorithm = params?.simulationAlgorithm?.toUpperCase();
      if (simulationAlgorithm) {
        const match = simulationAlgorithm.match(/^(KISAO[:_])?(\d{1,7})$/);
        if (match) {
          simulationAlgorithm =
            'KISAO_' + '0'.repeat(7 - match[2].length) + match[2];
        }
      }

      const name = params?.name;
      if (name) {
        this.formGroup.controls.name.setValue(name);
      }

      if (modelFormat || modelingFramework || simulationAlgorithm) {
        this.simulators.forEach(
          (simulatorIdDisabled: SimulatorIdDisabled): void => {
            let enabled = false;
            for (const modelingFrameworksAlgorithmsForModelFormats of simulatorSpecsMap[
              simulatorIdDisabled.id
            ].modelingFrameworksAlgorithmsForModelFormats) {
              if (
                (!modelFormat ||
                  modelingFrameworksAlgorithmsForModelFormats.formatEdamIds.includes(
                    modelFormat,
                  )) &&
                (!modelingFramework ||
                  modelingFrameworksAlgorithmsForModelFormats.frameworkSboIds.includes(
                    modelingFramework,
                  )) &&
                (!simulationAlgorithm ||
                  modelingFrameworksAlgorithmsForModelFormats.algorithmKisaoIds.includes(
                    simulationAlgorithm,
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

      let simulatorId: string = params?.simulator?.toLowerCase();
      const simulatorVersion: string = params?.simulatorVersion;
      if (simulatorId) {
        for (const simulator of this.simulators) {
          if (simulator.id.toLowerCase() === simulatorId) {
            simulatorId = simulator.id;
            this.formGroup.controls.simulator.setValue(simulatorId);
            this.onSimulatorChange({ value: simulatorId });
            if (simulatorVersion) {
              for (const version of this.simulatorSpecsMap[simulatorId].versions) {
                if (this.versionsEqual(version, simulatorVersion)) {
                  this.formGroup.controls.simulatorVersion.setValue(version);
                  break;
                }
              }
            }
            break;
          }
        }
      }
    });
    this.toggleSubmitMethod(this.submitMethod);
  }

  versionsEqual(a: string, b: string) {
    let aArr = a.toLowerCase().split('.');
    let bArr = b.toLowerCase().split('.');

    const lastPos = Math.min(aArr.length, bArr.length);
    aArr = aArr.slice(0, lastPos);
    bArr = bArr.slice(0, lastPos);

    return aArr.every((val, index) => val === bArr[index]);
  }

  toggleSubmitMethod(method: 'file' | 'url') {
    this.submitMethod = method;
    if (method == 'file') {
      this.formGroup.controls.projectFile.enable();
      this.formGroup.controls.projectFile.setValidators(Validators.required);
      this.formGroup.controls.projectFile.updateValueAndValidity();
      this.formGroup.controls.projectUrl.disable();
    } else {
      this.formGroup.controls.projectFile.disable();
      this.formGroup.controls.projectUrl.enable();
      this.formGroup.controls.projectUrl.setValidators(Validators.required);
      this.formGroup.controls.projectUrl.updateValueAndValidity();
    }
  }

  onFormSubmit() {
    if (!this.formGroup.valid) {
      return;
    }

    const simulator: string = this.formGroup.value.simulator;
    const simulatorVersion: string = this.formGroup.value.simulatorVersion;
    const name: string = this.formGroup.value.name;
    const email: string | null = this.formGroup.value.email || null;

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
      const projectUrl: string = this.formGroup.value.projectUrl;
      simulationResponse = this.dispatchService.sumbitJobURL(
        projectUrl,
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
    email: string | null,
  ): void {
    const simulationId = data['id'];

    const simulation: Simulation = {
      id: simulationId,
      name: name,
      email: email || undefined,
      simulator: simulator,
      simulatorVersion: simulatorVersion,
      submittedLocally: true,
      status: SimulationRunStatus.QUEUED,
      runtime: undefined,
      submitted: new Date(),
      updated: new Date(),
    };
    this.simulationService.storeNewLocalSimulation(simulation);

    this.router.navigate(['/simulations', simulationId]);

    this.snackBar.open((
      `Your simulation was submitted. `
      + 'You can view the status of your simulation at this page '
      + 'or from the "Your simulations page". '
      + 'When your simulation completes, you will be able to '
      + 'retrieve and visualize its results here.'
      ), undefined, {
      duration: 10000,
    });
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
