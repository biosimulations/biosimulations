import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import {
  DispatchService,
  SimulatorSpecsMap,
  SimulatorData,
  OntologyTermsMap,
  OntologyTerm,
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

enum SubmitMethod {
  file = 'file',
  url = 'url',
}

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {
  submitMethod: SubmitMethod = SubmitMethod.file;
  formGroup: FormGroup;
  submitMethodControl: FormControl;
  projectFileControl: FormControl;
  projectUrlControl: FormControl;
  modelFormatsControl: FormControl;
  modelingFrameworksControl: FormControl;
  simulationAlgorithmsControl: FormControl;
  simulatorControl: FormControl;
  simulatorVersionControl: FormControl;
  cpusControl: FormControl;
  memoryControl: FormControl; // in GB
  maxTimeControl: FormControl; // in min
  nameControl: FormControl;
  emailControl: FormControl;
  emailConsentControl: FormControl;

  exampleCombineArchiveUrl: string;
  exampleCombineArchivesUrl: string;

  modelFormatsMap?: OntologyTermsMap;
  modelingFrameworksMap?: OntologyTermsMap;
  simulationAlgorithmsMap?: OntologyTermsMap;

  modelFormats?: OntologyTerm[];
  modelingFrameworks?: OntologyTerm[];
  simulationAlgorithms?: OntologyTerm[];

  simulatorIds = new Set<string>();
  simulators: SimulatorIdDisabled[] = [];
  simulatorVersions: string[] = [];
  simulatorSpecsMap: SimulatorSpecsMap | undefined = undefined;

  emailUrl!: string;

  submitPushed = false;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        submitMethod: [SubmitMethod.file],
        projectFile: [''],
        projectUrl: [''],
        modelFormats: [[]],
        modelingFrameworks: [[]],
        simulationAlgorithms: [[]],
        simulator: ['', [Validators.required]],
        simulatorVersion: ['', [Validators.required]],
        cpus: [1, [Validators.required, Validators.min(1), Validators.max(24), this.integerValidator]],
        memory: [8, [Validators.required, Validators.min(0), Validators.max(192)]], // in GB
        maxTime: [20, [Validators.required, Validators.min(0), Validators.max(20 * 24 * 60)]], // in min
        name: ['', [Validators.required]],
        email: ['', [Validators.email]],
        emailConsent: [false],
      },
      {
        validators: this.formValidator,
      },
    );

    this.submitMethodControl = this.formGroup.controls.submitMethod as FormControl;
    this.projectFileControl = this.formGroup.controls.projectFile as FormControl;
    this.projectUrlControl = this.formGroup.controls.projectUrl as FormControl;
    this.modelFormatsControl = this.formGroup.controls.modelFormats as FormControl;
    this.modelingFrameworksControl = this.formGroup.controls.modelingFrameworks as FormControl;
    this.simulationAlgorithmsControl = this.formGroup.controls.simulationAlgorithms as FormControl;
    this.simulatorControl = this.formGroup.controls.simulator as FormControl;
    this.simulatorVersionControl = this.formGroup.controls.simulatorVersion as FormControl;
    this.cpusControl = this.formGroup.controls.cpus as FormControl;
    this.memoryControl = this.formGroup.controls.memory as FormControl;
    this.maxTimeControl = this.formGroup.controls.maxTime as FormControl;
    this.nameControl = this.formGroup.controls.name as FormControl;
    this.emailControl = this.formGroup.controls.email as FormControl;
    this.emailConsentControl = this.formGroup.controls.emailConsent as FormControl;

    this.modelFormatsControl.disable();
    this.modelingFrameworksControl.disable();
    this.simulationAlgorithmsControl.disable();
    this.simulatorControl.disable();
    this.simulatorVersionControl.disable();

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
    this.emailUrl = 'mailto:' + config.email;
  }

  integerValidator(formControl: FormControl): ValidationErrors | null {
    const value = formControl.value as number;

    if (value == Math.floor(value)) {
      return null
    } else {
      return {integer: true};
    }
  }

  formValidator(formGroup: FormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};

    if (formGroup.value.submitMethod == SubmitMethod.file) {
      if (!formGroup.value.projectFile) {
        errors['noProjectFile'] = true;
      }
    } else {
      if (!formGroup.value.projectUrl) {
        errors['noProjectUrl'] = true;
      }
    }

    const email = formGroup.controls.email as FormControl;
    const emailConsent = formGroup.controls.emailConsent as FormControl;

    if (email.value && !email.hasError('email') && !emailConsent.value) {
      errors['emailNotConsented'] = true;
    }

    if (Object.keys(errors).length) {
      return errors;
    } else {
      return null;
    }
  }

  ngOnInit(): void {
    combineLatest([
      this.dispatchService.getSimulatorsFromDb(),
      this.route.queryParams,
    ]).subscribe((observerableValues: [SimulatorData, Params]): void => {
      const simulatorData = observerableValues[0] as SimulatorData;
      const params = observerableValues[1] as Params;

      // Setup options for select menus
      this.modelFormatsMap = simulatorData.modelFormats;
      this.modelingFrameworksMap = simulatorData.modelingFrameworks;
      this.simulationAlgorithmsMap  = simulatorData.simulationAlgorithms;
      this.simulatorSpecsMap = simulatorData.simulatorSpecs;

      this.modelFormats = Object.values(this.modelFormatsMap);
      this.modelingFrameworks = Object.values(this.modelingFrameworksMap);
      this.simulationAlgorithms = Object.values(this.simulationAlgorithmsMap);

      this.modelFormats.sort((a: OntologyTerm, b: OntologyTerm): number => {
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      });
      this.modelingFrameworks.sort((a: OntologyTerm, b: OntologyTerm): number => {
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      });
      this.simulationAlgorithms.sort((a: OntologyTerm, b: OntologyTerm): number => {
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      });

      this.simulatorIds = new Set(Object.keys(this.simulatorSpecsMap));
      this.simulators = Array.from(this.simulatorIds).map(
        (id: string): SimulatorIdDisabled => {
          return { id: id, disabled: false };
        },
      );

      this.simulators.sort(
        (a: SimulatorIdDisabled, b: SimulatorIdDisabled): number => {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        },
      );

      // Enable select menus
      this.modelFormatsControl.enable();
      this.modelingFrameworksControl.enable();
      this.simulationAlgorithmsControl.enable();
      this.simulatorControl.enable();

      // Initialize value of form according to query arguments
      const projectUrl = params?.projectUrl;
      if (projectUrl) {
        this.submitMethodControl.setValue(SubmitMethod.url);
        this.projectUrlControl.setValue(projectUrl);
      }

      this.modelFormatsControl.setValue(this.makeArray(params?.modelFormat)
        .map((modelFormat: string): string => {
          modelFormat = modelFormat.toLowerCase();
          const match = modelFormat.match(/^(format[:_])?(\d{1,4})$/);
          if (match) {
            modelFormat = 'format_' + '0'.repeat(4 - match[2].length) + match[2];
          }

          return modelFormat;
        })
        .filter((modelFormat: string): boolean => {
          return this.modelFormatsMap?.[modelFormat] != null;
        })
      );

      this.modelingFrameworksControl.setValue(this.makeArray(params?.modelingFramework)
        .map((modelingFramework: string): string => {
          modelingFramework = modelingFramework.toUpperCase();
          const match = modelingFramework.match(/^(SBO[:_])?(\d{1,7})$/);
          if (match) {
            modelingFramework = 'SBO_' + '0'.repeat(7 - match[2].length) + match[2];
          }
          return modelingFramework;
        })
        .filter((modelingFramework: string): boolean => {
          return this.modelingFrameworksMap?.[modelingFramework] != null;
        })
      );

      this.simulationAlgorithmsControl.setValue(this.makeArray(params?.simulationAlgorithm)
        .map((simulationAlgorithm: string): string => {
          simulationAlgorithm = simulationAlgorithm.toUpperCase();
          const match = simulationAlgorithm.match(/^(KISAO[:_])?(\d{1,7})$/);
          if (match) {
            simulationAlgorithm = 'KISAO_' + '0'.repeat(7 - match[2].length) + match[2];
          }
          return simulationAlgorithm;
        })
        .filter((simulationAlgorithm: string): boolean => {
          return this.simulationAlgorithmsMap?.[simulationAlgorithm] != null;
        })
      );

      const simulator = params?.simulator?.toLowerCase();
      if (simulator) {
        for (const simulatorId of this.simulatorIds) {
          if (simulatorId.toLowerCase() === simulator) {
            this.simulatorControl.setValue(simulatorId);

            const simulatorVersion = params?.simulatorVersion;
            if (this.simulatorSpecsMap[simulatorId].versions.includes(simulatorVersion)) {
              this.simulatorVersionControl.setValue(simulatorVersion);
            }

            break;
          }
        }
      }

      let cpus: any = params?.cpus;
      if (!isNaN(cpus)) {
        cpus = Math.ceil(parseFloat(cpus));
        if (cpus >= 1) {
          this.cpusControl.setValue(cpus);
        }
      }

      let memory: any = params?.memory;
      if (!isNaN(memory)) {
        memory = parseFloat(memory);
        if (memory > 0) {
          this.memoryControl.setValue(memory);
        }
      }

      let maxTime: any = params?.maxTime;
      if (!isNaN(maxTime)) {
        maxTime = parseFloat(maxTime);
        if (maxTime > 0) {
          this.maxTimeControl.setValue(maxTime);
        }
      }

      const name = params?.name;
      if (name) {
        this.nameControl.setValue(name);
      }
    });
  }

  makeArray(value: string | string[] | null): string[] {
    if (!value) {
      return [];
    } else if (typeof value === 'string') {
      return [value];
    } else {
      return value;
    }
  }

  versionsEqual(a: string, b: string) {
    let aArr = a.toLowerCase().split('.');
    let bArr = b.toLowerCase().split('.');

    const lastPos = Math.min(aArr.length, bArr.length);
    aArr = aArr.slice(0, lastPos);
    bArr = bArr.slice(0, lastPos);

    return aArr.every((val, index) => val === bArr[index]);
  }

  applyFilters(): void {
    const modelFormatIds = this.formGroup.value.modelFormats;
    const modelingFrameworkIds = this.formGroup.value.modelingFrameworks;
    const simulationAlgorithmIds = this.formGroup.value.simulationAlgorithms;

    let simulators = this.simulatorIds;
    modelFormatIds.forEach((modelFormatId: string): void => {
      simulators = this.setIntersection(simulators, this.modelFormatsMap?.[modelFormatId]?.simulators as Set<string>);
    });
    modelingFrameworkIds.forEach((modelingFrameworkId: string): void => {
      simulators = this.setIntersection(simulators, this.modelingFrameworksMap?.[modelingFrameworkId]?.simulators as Set<string>);
    });
    simulationAlgorithmIds.forEach((simulationAlgorithmId: string): void => {
      simulators = this.setIntersection(simulators, this.simulationAlgorithmsMap?.[simulationAlgorithmId]?.simulators as Set<string>);
    });

    this.modelFormats?.forEach((modelFormat: OntologyTerm): void => {
      modelFormat.disabled = this.setIntersection(simulators, modelFormat.simulators).size == 0;
    });
    this.modelingFrameworks?.forEach((modelingFramework: OntologyTerm): void => {
      modelingFramework.disabled = this.setIntersection(simulators, modelingFramework.simulators).size == 0;
    });
    this.simulationAlgorithms?.forEach((simulationAlgorithm: OntologyTerm): void => {
      simulationAlgorithm.disabled = this.setIntersection(simulators, simulationAlgorithm.simulators).size == 0;
    });

    this.simulators.forEach((simulator: SimulatorIdDisabled): void => {
      simulator.disabled = !simulators.has(simulator.id);
    });
  }

  setIntersection(a: Set<string>, b: Set<string>): Set<string> {
    const _intersection = new Set<string>();
    for (const elem of b.values()) {
      if (a.has(elem)) {
          _intersection.add(elem);
      }
    }
    return _intersection;
  }

  onFormSubmit(): void {
    this.submitPushed = true;

    if (!this.formGroup.valid) {
      return;
    }

    const simulator: string = this.formGroup.value.simulator;
    const simulatorVersion: string = this.formGroup.value.simulatorVersion;
    const cpus: number = this.formGroup.value.cpus;
    const memory: number = this.formGroup.value.memory; // in GB
    const maxTime: number = this.formGroup.value.maxTime; // in min
    const name: string = this.formGroup.value.name;
    const email: string | null = this.formGroup.value.email || null;

    let simulationResponse: Observable<SimulationRun>;
    if (this.formGroup.value.submitMethod == SubmitMethod.file) {
      const projectFile: File = this.formGroup.value.projectFile;

      simulationResponse = this.dispatchService.submitJob(
        projectFile,
        simulator,
        simulatorVersion,
        cpus,
        memory,
        maxTime,
        name,
        email,
      );
    } else {
      const projectUrl: string = this.formGroup.value.projectUrl;
      simulationResponse = this.dispatchService.sumbitJobURL(
        projectUrl,
        simulator,
        simulatorVersion,
        cpus,
        memory,
        maxTime,
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
        cpus,
        memory,
        maxTime,
        email,
      ),
    );
  }

  private processSimulationResponse(
    data: any,
    name: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // min min
    email: string | null,
  ): void {
    const simulationId = data['id'];

    const simulation: Simulation = {
      id: simulationId,
      name: name,
      email: email || undefined,
      simulator: simulator,
      simulatorVersion: simulatorVersion,
      cpus: cpus,
      memory: memory,
      maxTime: maxTime,
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

  onSimulatorChange() {
    if (this.simulatorSpecsMap !== undefined) {
      this.simulatorVersions = this.simulatorSpecsMap[this.simulatorControl.value].versions;
      this.simulatorVersionControl.enable();
      this.simulatorVersionControl.setValue(
        this.simulatorVersions[0],
      );
    }
  }
}
