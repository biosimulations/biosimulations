import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import {
  AbstractControl,
  FormArray,
  FormControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { CombineApiService } from '../../../services/combine-api/combine-api.service';
import {
  _IntrospectNewProject,
  CreateArchiveFromSedDoc,
  CustomizableSedDocumentData,
  FormStepData,
  IntrospectNewProject,
  OntologyTerm,
  OntologyTermsMap,
  SimulationProjectUtilData,
  SimulationProjectUtilLoaderService,
  SimulatorsData,
  SimulatorSpecs,
  SimulatorSpecsMap,
} from '@biosimulations/simulation-project-utils';
import { Simulation } from '../../../datamodel';
import {
  ALGORITHM_SUBSTITUTION_POLICIES,
  AlgorithmSubstitution,
  AlgorithmSubstitutionPolicy,
  AlgorithmSubstitutionPolicyLevels,
  AlgorithmSummary,
  CombineArchiveSedDocSpecs,
  CombineArchiveSedDocSpecsContent,
  EnvironmentVariable,
  Purpose,
  ReRunQueryParams,
  SedDocument,
  SedModel,
  SedModelAttributeChange as CommonAttributeChange,
  SedModelChange,
  SedSimulation,
  SimulationRun,
  SimulationRunStatus,
  SimulationType,
} from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { Observable, Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/config/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileInput } from '@biosimulations/material-file-input';
import { CreateMaxFileSizeValidator, INTEGER_VALIDATOR } from '@biosimulations/shared/ui';
import {
  SedModelAttributeChange,
  SedModelAttributeChangeTypeEnum,
  SedModelChange as ClientSedChange,
  SedTarget,
} from '@biosimulations/combine-api-angular-client';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ViewService } from '@biosimulations/simulation-runs/service';
import { Visualization, VisualizationList } from '@biosimulations/datamodel-simulation-runs';
import { Endpoints } from '@biosimulations/config/common';

interface SimulatorIdNameDisabled {
  id: string;
  name: string;
  disabled: boolean;
}

interface Simulator {
  id: string;
  name: string;
}

interface SimulatorPolicy {
  minPolicy: AlgorithmSubstitutionPolicy;
  simulator: Simulator;
}

interface Algorithm {
  id: string;
  name: string;
  simulatorPolicies: { [simulator: string]: SimulatorPolicy };
  disabled: boolean;
}

@Component({
  selector: 'biosimulations-customize-simulation',
  templateUrl: './customize-simulation.component.html',
  styleUrls: ['./customize-simulation.component.scss'],
})
export class CustomizeSimulationComponent implements OnInit, OnDestroy {
  public formGroup: UntypedFormGroup;
  public variablesFormGroup: UntypedFormGroup;

  // Form control option lists
  public modelFormats: OntologyTerm[] = [];
  public simulators: SimulatorIdNameDisabled[] = [];
  public simulatorVersions: string[] = [];
  public simulationAlgorithms: Algorithm[] = [];
  public algorithmSubstitutionPolicies: AlgorithmSubstitutionPolicy[];

  // Data loaded from configs
  public exampleCombineArchivesUrl: string;
  public emailUrl!: string;
  public isReRun = false;
  public needsLicense = false;
  public simMethodData!: FormStepData;
  public modelData!: FormStepData;
  public introspectionData$!: Observable<CustomizableSedDocumentData>;
  public options: SedModelAttributeChange[] = [];
  public modelChanges: UntypedFormGroup[] = [];
  public simParams!: ReRunQueryParams;
  public uploadedSedDoc!: SedDocument;
  public containsSimulationChanges = false;
  public useDropdown = true;
  public originalModelChanges: SedModelChange[] = [];
  public reRunId!: string;
  public vizList: Visualization[] = [];
  public viz$!: Observable<VisualizationList[]>;
  public visualization!: Visualization;
  public triggerViz = false;
  public gridLayout = false;
  public grid = 'grid';
  public auto = 'auto';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  public introspectionBtnColor = 'var(--accent-darker-color)';
  public viewBtnColor = 'var(--accent-darker-color)';
  public viewToggleMsg!: string;

  // Lifecycle state
  public submitPushed = false;
  public emailEnabled = false;
  public filteredRows: any[][] = [];
  public endpoints = new Endpoints();
  private subscriptions: Subscription[] = [];

  // Data loaded from network
  private modelFormatsMap?: OntologyTermsMap;
  private simulationAlgorithmsMap?: Record<string, Algorithm>;
  private simulatorSpecsMap?: SimulatorSpecsMap;

  public constructor(
    private config: ConfigService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
    private combineApiService: CombineApiService,
    private snackBar: MatSnackBar,
    private loader: SimulationProjectUtilLoaderService,
    private activateRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private sharedViewService: ViewService,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        projectFile: ['', [CreateMaxFileSizeValidator(config)]],
        projectUrl: ['', []],
        modelFormats: ['', []],
        simulationAlgorithms: ['', []],
        simulationAlgorithmSubstitutionPolicy: [AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK, []],
        simulator: ['', [Validators.required]],
        simulatorVersion: ['', [Validators.required]],
        academicPurpose: [true],
        cpus: [1, [Validators.required, Validators.min(1), Validators.max(24), INTEGER_VALIDATOR]],
        memory: [8, [Validators.required, Validators.min(0), Validators.max(192)]], // in GB
        maxTime: [20, [Validators.required, Validators.min(0), Validators.max(20 * 24 * 60)]], // in min
        name: ['', [Validators.required]],
        email: ['', [Validators.email]],
        emailConsent: [false],
      },
      {
        validators: this.formValidator.bind(this),
      },
    );

    this.algorithmSubstitutionPolicies = ALGORITHM_SUBSTITUTION_POLICIES.filter((policy) => {
      const minPolicy = AlgorithmSubstitutionPolicyLevels.SAME_METHOD;
      const maxPolicy = AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK;
      return policy.level >= minPolicy && policy.level <= maxPolicy;
    });

    this.formGroup.controls.modelFormats.disable();
    this.formGroup.controls.simulationAlgorithms.disable();
    this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.disable();
    this.formGroup.controls.simulator.disable();
    this.formGroup.controls.simulatorVersion.disable();

    const exampleCombineArchivesUrlTokens = [
      'https://github.com',
      this.config.appConfig.exampleCombineArchives.repoOwnerName,
      'tree',
      this.config.appConfig.exampleCombineArchives.repoRef,
      config.appConfig.exampleCombineArchives.repoPath,
    ];
    this.exampleCombineArchivesUrl = exampleCombineArchivesUrlTokens.join('/');
    this.emailUrl = 'mailto:' + config.email;

    this.variablesFormGroup = this.formBuilder.group({
      rows: this.formBuilder.array([]),
      selectedRowIndex: [null],
      parameterSelections: this.formBuilder.array([]),
      modelFiles: this.formBuilder.array([]),
    });
  }

  // Life cycle

  public ngOnInit(): void {
    const loadObs = this.loader.loadSimulationUtilData();
    const loadSub = loadObs.subscribe(this.loadComplete.bind(this));
    this.subscriptions.push(loadSub);

    const userEmailAddress = this.formGroup.value.email;
    this.formGroup.valueChanges.subscribe((values) => {
      const currentEmailAddress = values.email;
      if (currentEmailAddress != userEmailAddress) {
        this.formGroup.value.emailConsent = true;
      }
    });
    this.changeBtnTooltip();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public renderViz(visualization: Visualization): void {
    this.visualization = visualization;
  }

  public setupSearchFilter(index: number) {
    const searchControl = this.parameterSelections.at(index).get('searchControl') as FormControl;
    searchControl.valueChanges.subscribe((value) => {
      this.filterRows(value, index);
    });
  }

  public filterRows(searchValue: string, index: number): void {
    // TODO: complete this implementation
    const rowsArray = this.rows.value as Array<any>;
    if (!searchValue) {
      this.filteredRows[index] = rowsArray;
    } else {
      this.filteredRows[index] = rowsArray.filter(
        (row) =>
          row.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          row.default.toString().toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
  }

  public navigateToRun(): void {
    this.triggerViz = !this.triggerViz;
    this.gridLayout = !this.gridLayout;
    this.handleBtnColor();
  }

  private handleBtnColor(): void {
    if (this.triggerViz) {
      this.introspectionBtnColor = 'var(--tertiary-darker-color)';
    } else {
      this.introspectionBtnColor = 'var(--accent-darker-color)';
    }
  }

  public changeParamsLayoutButton(): void {
    this.useDropdown = !this.useDropdown;
    if (this.useDropdown) {
      this.viewBtnColor = 'var(--accent-darker-color)';
    } else {
      this.viewBtnColor = 'var(--tertiary-darker-color)';
    }
    this.changeBtnTooltip();
  }

  private changeBtnTooltip(): void {
    if (this.useDropdown) {
      this.viewToggleMsg = 'Toggle Grid View';
    } else {
      this.viewToggleMsg = 'Toggle Dropdown View';
    }
  }

  public get rows(): UntypedFormArray {
    return this.variablesFormGroup.get('rows') as UntypedFormArray;
  }

  public addParameterRow(modelChange: SedModelAttributeChange): void {
    if (modelChange.id !== null) {
      const newRow = this.formBuilder.group({
        name: [{ value: modelChange.name as string, disabled: true }],
        default: [{ value: +modelChange.newValue, disabled: true }],
        target: [modelChange.target],
        id: [modelChange.id as string],
        _type: [modelChange._type],
        newValue: [''],
      });

      this.rows.push(newRow);
      this.modelChanges.push(newRow);
    } else {
      console.log('null id');
    }
  }

  public enableEmail(checked: boolean): void {
    this.emailEnabled = checked;
  }

  public clearOverrides(checked: boolean): void {
    /* Clear original simulation parameter changes/overrides if checked */
    if (checked) {
      this.parameterSelections.removeAt(this.parameterSelections.length - 1);
      const originalChange = this.uploadedSedDoc.models[0].changes.pop();
      this.originalModelChanges.push(originalChange as SedModelChange);
    } else {
      this.originalModelChanges.forEach((change: SedModelChange): void => {
        this.uploadedSedDoc.models[0].changes.push(change as any);
      });
    }
  }

  public setAttributesFromQueryParams(): void {
    /* Set component attributes from Query params */
    this.activateRoute.queryParams.subscribe((params: ReRunQueryParams) => {
      this.simParams = params;

      // TODO: set urls here
      this.reRunId = params.runId as string;

      if (params.projectUrl) {
        this.isReRun = true;
      }

      this.modelData = {
        modelUrl: params.modelUrl as string,
        modelFormat: params.modelFormat as string,
      };

      this.simMethodData = {
        simulationType: params.simulationType as SimulationType,
        framework: params.modelingFramework as string,
        algorithm: params.simulationAlgorithm as string,
      };

      this.needsLicense = (params.simulator?.includes('cobra') || params.simulator?.includes('rba')) as boolean;
    });

    const handler = this.archiveError.bind(this);
    this.introspectionData$ = IntrospectNewProject(
      this.httpClient,
      this.modelData,
      this.simMethodData,
      handler,
    ) as Observable<CustomizableSedDocumentData>;
  }

  public get parameterSelections(): FormArray {
    return this.variablesFormGroup.get('parameterSelections') as FormArray;
  }

  public getDefault(index: number): any {
    const selectedRowIndex = this.parameterSelections.at(index).get('selectedRowIndex')?.value;
    return selectedRowIndex !== null ? this.rows.at(selectedRowIndex).get('default')?.value : '';
  }

  public addNewParameterSelection(): void {
    const newParameterSelection = this.formBuilder.group({
      selectedRowIndex: [null],
      searchControl: [''],
      newValue: [''],
    });

    this.parameterSelections.push(newParameterSelection);
    this.setupSearchFilter(this.parameterSelections.length - 1);
  }

  public getNewValueControl(index: number): FormControl {
    return this.parameterSelections.at(index).get('newValue') as FormControl;
  }

  public populateParamsForm(): void {
    /* Populate form with introspected data */
    this.introspectionData$.subscribe((data: CustomizableSedDocumentData) => {
      data.modelChanges.forEach((change: ClientSedChange) => {
        switch (change) {
          case change as SedModelAttributeChange:
            this.addParameterRow(change);
        }
      });
    });
    this.addNewParameterSelection();
  }

  public isOptionSelected(idx: number, currentIndex: number): boolean {
    return this.parameterSelections.controls.some((control: any, i) => {
      return i !== currentIndex && control.value.selectedRowIndex === idx;
    });
  }

  private archiveError(): void {
    console.log(`error.`);
  }

  private loadComplete(data: SimulationProjectUtilData): void {
    const curatedAlgSubs: AlgorithmSubstitution[] = data.algorithmSubstitutions;
    const simulatorsData: SimulatorsData = data.simulators;
    const params: Params = data.params;

    this.simulatorSpecsMap = simulatorsData.simulatorSpecs;

    const algSubs: AlgorithmSubstitution[] = curatedAlgSubs ? curatedAlgSubs : this.getBackupAlgSubs(simulatorsData);
    this.simulationAlgorithmsMap = this.getSimulationAlgorithmsMap(algSubs, simulatorsData);

    this.simulationAlgorithms = Object.values(this.simulationAlgorithmsMap);
    this.simulationAlgorithms.sort((a: Algorithm, b: Algorithm): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    this.modelFormatsMap = simulatorsData.modelFormats;

    this.modelFormats = Object.values(this.modelFormatsMap);
    this.modelFormats.sort((a: OntologyTerm, b: OntologyTerm): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    const simulatorSpecs = Object.values(this.simulatorSpecsMap);
    this.simulators = simulatorSpecs.map((specs: SimulatorSpecs): SimulatorIdNameDisabled => {
      return {
        id: specs.id,
        name: specs.name,
        disabled: false,
      };
    });

    this.simulators.sort((a: SimulatorIdNameDisabled, b: SimulatorIdNameDisabled): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    // Enable select menus
    this.formGroup.controls.modelFormats.enable();
    this.formGroup.controls.simulationAlgorithms.enable();
    this.formGroup.controls.simulator.enable();

    if (curatedAlgSubs) {
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.setValue(
        AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK,
      );
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.enable();
    } else {
      this.formGroup.controls.simulationAlgorithmSubstitutionPolicy.setValue(
        AlgorithmSubstitutionPolicyLevels.SAME_METHOD,
      );
    }
    this.setControlsFromParams(params, this.simulatorSpecsMap);

    // Gather introspection data and populate model form
    this.setAttributesFromQueryParams();
    this.populateParamsForm();

    const viz$ = this.sharedViewService.getVisualizations(this.reRunId);
    this.viz$ = viz$;
    if (viz$) {
      viz$.subscribe((value: VisualizationList[]) => {
        value.forEach((vizList: VisualizationList) => {
          vizList.visualizations.forEach((visualization: Visualization) => {
            this.vizList.push(visualization);
          });
        });
      });
    }
  }

  public removeModelChangeField(index: number): void {
    this.parameterSelections.removeAt(index);
  }

  // Form Submission

  public gatherModelChanges(): void {
    const sedModel = this.uploadedSedDoc.models.find((m) => m.id === this.uploadedSedDoc.models[0].id) as SedModel;

    if (!this.useDropdown) {
      this.rows.controls.forEach((val: AbstractControl<any, any>, i: number) => {
        const rowValueGroup = val as UntypedFormGroup;
        const newVal = rowValueGroup.controls.newValue.value;

        if (newVal) {
          this.containsSimulationChanges = true;
          const paramChange: SedModelAttributeChange = {
            _type: rowValueGroup.controls._type.value,
            newValue: newVal,
            target: rowValueGroup.controls.target.value,
            id: rowValueGroup.controls.id.value,
            name: rowValueGroup.controls.name.value,
          };
          // Add the parameter change to the sedModel
          sedModel.changes.push(paramChange);
        }
      });
    } else {
      const allParams = this.getAllParameterSelections();
      this.containsSimulationChanges = allParams.length >= 1;
      allParams.forEach((paramChange: SedModelAttributeChange) => {
        sedModel.changes.push(paramChange);
      });
    }

    // Update the model in its place in the uploadedSedDoc
    const modelIndex = this.uploadedSedDoc.models.findIndex((m) => m.id === sedModel.id);
    if (modelIndex > -1) {
      this.uploadedSedDoc.models[modelIndex] = sedModel; // Update the model in place
    }
  }

  public getAllParameterSelections(): SedModelAttributeChange[] | any[] {
    return this.parameterSelections.controls.map((group: AbstractControl<any, any>) => {
      const selectedIndex = group.get('selectedRowIndex')?.value;
      const selectedRow = selectedIndex !== null ? this.rows.at(selectedIndex).value : null;
      const newValue = group.get('newValue')?.value;

      if (selectedRow && newValue) {
        const selection: SedModelAttributeChange = {
          name: selectedRow.name,
          target: selectedRow.target,
          id: selectedRow.id,
          _type: selectedRow._type,
          newValue: newValue,
        };

        return selection as SedModelAttributeChange;
      }
    });
  }

  public createNewArchive(queryParams: ReRunQueryParams): Promise<Blob | null> {
    this.gatherModelChanges();
    return new Promise((resolve, reject) => {
      const errorHandler = this.archiveError.bind(this);

      const form = new FormData();
      form.append('modelUrl', queryParams.modelUrl as string);
      form.append('modelingFramework', queryParams.modelingFramework as string);
      form.append('simulationType', queryParams.simulationType as string);
      form.append('simulationAlgorithm', queryParams.simulationAlgorithm as string);

      const introspectedSedDoc$ = _IntrospectNewProject(
        this.httpClient,
        form as FormData,
        queryParams.modelUrl as string,
        errorHandler,
      );

      const archive = CreateArchiveFromSedDoc(
        this.uploadedSedDoc as SedDocument,
        queryParams.modelUrl as string,
        queryParams.modelFormat as string,
        queryParams.modelFile as File,
        queryParams.imageFileUrls as string[],
      );

      if (!archive) {
        resolve(null);
        return;
      }

      const formData = new FormData();
      formData.append('specs', JSON.stringify(archive));
      formData.append('download', 'true');
      if (queryParams.modelFile) {
        formData.append('files', queryParams.modelFile as Blob);
      }

      const createArchiveUrl = this.endpoints.getCombineArchiveCreationEndpoint(false);
      this.httpClient.post(createArchiveUrl, formData, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          if (blob) {
            console.log('Archive generated successfully');
            resolve(blob); // Return the blob instead of triggering download
          } else {
            console.error('Failed to generate the archive.');
            resolve(null);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Error creating archive:', error.message);
          console.error('Full error details:', error);
          reject(error);
        },
      );
    });
  }

  public downloadBlob(archiveBlob: Blob): void {
    const url = window.URL.createObjectURL(archiveBlob);
    const link = document.createElement('a');
    link.href = url;
    const customName: string = this.formGroup.value.name;
    const formattedName: string = customName.replace(/\s+/g, '-');
    link.setAttribute('download', `${formattedName}.omex`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // free up memory
    window.URL.revokeObjectURL(url);
  }

  public async onFormSubmit(): Promise<void> {
    /* Create customized archive and Submit the form for simulation */
    this.submitPushed = true;

    // Ensure that the form is valid
    if (!this.formGroup.valid) {
      return;
    }

    // Generate the archive and set it as projectFile
    const archiveBlob = await this.createNewArchive(this.simParams);
    if (archiveBlob) {
      // set form val to created archive
      const archiveFile = new File([archiveBlob], 'combineArchive.omex', { type: archiveBlob.type });
      this.formGroup.patchValue({ projectFile: { files: [archiveFile] } });

      // download archive
      this.downloadBlob(archiveBlob);
    }

    // Proceed with form submission
    const simulator: string = this.formGroup.value.simulator;
    const simulatorVersion: string = this.formGroup.value.simulatorVersion;
    const cpus: number = this.formGroup.value.cpus;
    const memory: number = this.formGroup.value.memory; // in GB
    const maxTime: number = this.formGroup.value.maxTime; // in min
    const envVars: EnvironmentVariable[] = [];
    const purpose: Purpose = this.formGroup.value.academicPurpose ? Purpose.academic : Purpose.other;
    const name: string = this.formGroup.value.name;
    const email: string | null = this.formGroup.value.email || null;

    if (this.emailEnabled && !email) {
      this.snackBar.open('You must provide a valid email address when consenting to email communication.', 'Ok', {
        duration: 5000,
      });
      return;
    }

    const fileInput: FileInput = this.formGroup.value.projectFile;
    const projectFile: File = fileInput.files[0];
    const simulationResponse: Observable<SimulationRun> = this.dispatchService.submitJobForFile(
      projectFile,
      simulator,
      simulatorVersion,
      cpus,
      memory,
      maxTime,
      envVars,
      purpose,
      name,
      email,
    );

    const sub = simulationResponse.subscribe((data: SimulationRun) =>
      this.processSimulationResponse(
        data,
        name,
        simulator,
        simulatorVersion,
        cpus,
        memory,
        maxTime,
        envVars,
        purpose,
        email,
      ),
    );
    this.subscriptions.push(sub);
    window.scrollTo(0, 0);
  }

  // Algorithms getters

  private getSimulationAlgorithmsMap(
    algSubs: AlgorithmSubstitution[],
    simulatorsData: SimulatorsData,
  ): Record<string, Algorithm> {
    const simulationAlgorithmsMap: Record<string, Algorithm> = {};
    const filteredSubs = algSubs.filter(
      (sub) => sub.minPolicy.level <= AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK,
    );
    filteredSubs.forEach((algorithmSubstitution: AlgorithmSubstitution): void => {
      const mainAlg = algorithmSubstitution.algorithms[0];
      const altAlg = algorithmSubstitution.algorithms[1];
      const substitutionPolicy = algorithmSubstitution.minPolicy;

      // Ensure main and alt algorithms are both in the map.
      [mainAlg, altAlg].forEach((algorithm: AlgorithmSummary): void => {
        if (algorithm.id in simulationAlgorithmsMap) {
          return;
        }
        simulationAlgorithmsMap[algorithm.id] = {
          id: algorithm.id,
          name: algorithm.name,
          simulatorPolicies: {},
          disabled: false,
        };
      });

      const simulatorsForMainAlgorithm = simulatorsData.simulationAlgorithms[mainAlg.id]?.simulators;
      simulatorsForMainAlgorithm.forEach((simulatorId: string): void => {
        const simulator = {
          id: simulatorId,
          name: simulatorsData.simulatorSpecs[simulatorId].name,
        };

        simulationAlgorithmsMap[mainAlg.id].simulatorPolicies[simulatorId] = {
          minPolicy: {
            id: 'SAME_METHOD',
            name: 'Same method',
            level: AlgorithmSubstitutionPolicyLevels.ANY,
            _type: substitutionPolicy._type,
          },
          simulator: simulator,
        };

        const currentAltAlgPolicy = simulationAlgorithmsMap[altAlg.id].simulatorPolicies[simulatorId];
        if (!currentAltAlgPolicy || substitutionPolicy.level < currentAltAlgPolicy.minPolicy.level) {
          simulationAlgorithmsMap[altAlg.id].simulatorPolicies[simulatorId] = {
            minPolicy: substitutionPolicy,
            simulator: simulator,
          };
        }
      });
    });

    return simulationAlgorithmsMap;
  }

  private getBackupAlgSubs(simulatorsData: SimulatorsData): AlgorithmSubstitution[] {
    const algorithmEntries = Object.entries(simulatorsData.simulationAlgorithms);
    return algorithmEntries.map((keyVal: [string, OntologyTerm]): AlgorithmSubstitution => {
      const alg: AlgorithmSummary = {
        _type: 'Algorithm',
        id: keyVal[1].id,
        name: keyVal[1].name,
      };
      return {
        _type: 'KisaoAlgorithmSubstitution',
        algorithms: [alg, alg],
        minPolicy: ALGORITHM_SUBSTITUTION_POLICIES[AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK],
      };
    });
  }

  // Callbacks for control value updates.

  public projectControlUpdated(): void {
    const urlValue = this.formGroup.controls.projectUrl.value;
    const fileValue = this.formGroup.controls.projectFile.value?.files?.[0];

    if (!urlValue && !fileValue) {
      this.resetProjectErrors();
      return;
    }

    const projectFileTooBig = this.formGroup.hasError('maxSize', 'projectFile');
    const urlAndFileSelected = this.formGroup.hasError('multipleProjects');
    if (projectFileTooBig || urlAndFileSelected) {
      return;
    }

    const archive = urlValue ? urlValue : fileValue;
    const sub = this.combineApiService
      .getSpecsOfSedDocsInCombineArchive(archive)
      .subscribe(this.archiveSedDocSpecsLoaded.bind(this));
    this.subscriptions.push(sub);
  }

  public simulatorControlUpdated(): void {
    if (!this.simulatorSpecsMap) {
      return;
    }
    this.simulatorVersions = this.simulatorSpecsMap[this.formGroup.controls.simulator.value]?.versions || [];
    this.formGroup.controls.simulatorVersion.enable();
    this.formGroup.controls.simulatorVersion.setValue(this.simulatorVersions?.[0] || '');
  }

  public controlImpactingEligibleSimulatorsUpdated(): void {
    const simulatorSpecsMap = this.simulatorSpecsMap;
    if (!simulatorSpecsMap) {
      return;
    }

    const algSubPolicy = this.formGroup.value.simulationAlgorithmSubstitutionPolicy;
    const loadedSimulatorIds = Object.keys(simulatorSpecsMap);

    // Simulator must be supported by each selected model and algorithm to be eligible.
    const eligibleSimulators = loadedSimulatorIds.filter((simulatorId) => {
      const selectedModelFormatIds = this.formGroup.value.modelFormats;
      for (const modelFormatId of selectedModelFormatIds) {
        const modelSimulators = this.modelFormatsMap?.[modelFormatId]?.simulators as Set<string>;
        if (!modelSimulators || !modelSimulators.has(simulatorId)) {
          return false;
        }
      }
      const selectedSimulationAlgorithmIds = this.formGroup.value.simulationAlgorithms;
      for (const simulationAlgorithmId of selectedSimulationAlgorithmIds) {
        const policiesBySimulatorId = this.simulationAlgorithmsMap?.[simulationAlgorithmId]?.simulatorPolicies;
        if (!policiesBySimulatorId) {
          return false;
        }
        let simulatorIdsForAlgorithm = Object.keys(policiesBySimulatorId);
        simulatorIdsForAlgorithm = simulatorIdsForAlgorithm.filter((simulatorId) => {
          const simulatorPolicy = policiesBySimulatorId[simulatorId];
          return simulatorPolicy && simulatorPolicy.minPolicy.level <= algSubPolicy;
        });
        if (!simulatorIdsForAlgorithm.includes(simulatorId)) {
          return false;
        }
      }
      return true;
    });

    // Disable input checkboxes for model formats that are supported by none of the eligible simulators.
    this.modelFormats.forEach((modelFormat: OntologyTerm): void => {
      const eligibleForModelFormat = eligibleSimulators.filter((simulatorId) =>
        modelFormat.simulators.has(simulatorId),
      );
      modelFormat.disabled = eligibleForModelFormat.length == 0;
    });

    // Disable input checkboxes for algorithms that are supported by none of the eligible simulators.
    this.simulationAlgorithms.forEach((simulationAlgorithm: Algorithm): void => {
      let simulatorIdsForAlgorithm = Object.keys(simulationAlgorithm.simulatorPolicies);
      simulatorIdsForAlgorithm = simulatorIdsForAlgorithm.filter((simulatorId) => {
        const simulatorPolicy = simulationAlgorithm.simulatorPolicies[simulatorId];
        return simulatorPolicy.minPolicy.level <= algSubPolicy;
      });
      const eligibleForAlgorithm = eligibleSimulators.filter((simulatorId) =>
        simulatorIdsForAlgorithm.includes(simulatorId),
      );
      simulationAlgorithm.disabled = eligibleForAlgorithm.length == 0;
    });

    // Disable input checkboxes for all simulators that are not eligible.
    this.simulators.forEach((simulator: SimulatorIdNameDisabled): void => {
      simulator.disabled = !eligibleSimulators.includes(simulator.id);
      if (simulator.disabled && simulator.id === this.formGroup.value.simulator) {
        this.formGroup.controls.simulator.setValue(null);
      }
    });

    if (eligibleSimulators.length === 1) {
      this.formGroup.controls.simulator.setValue(eligibleSimulators[0]);
    }
  }

  // Network callbacks

  private archiveSedDocSpecsLoaded(sedDocSpecs?: CombineArchiveSedDocSpecs): void {
    const simulationAlgorithmsMap = this.simulationAlgorithmsMap;
    if (!sedDocSpecs || !simulationAlgorithmsMap) {
      return;
    }

    const modelFormats = new Set<string>();
    const simulationAlgorithms = new Set<string>();
    let specsContainUnsupportedModel = false;
    let specsContainUnsupportedAlgorithm = false;

    // Confirm that every model and algorithm within the sed doc spec is supported.
    sedDocSpecs.contents.forEach((content: CombineArchiveSedDocSpecsContent): void => {
      const sedDoc: SedDocument = content.location.value;
      this.uploadedSedDoc = sedDoc;
      sedDoc.models.forEach((model: SedModel): void => {
        let edamId: string | null = null;
        for (const modelingFormat of BIOSIMULATIONS_FORMATS) {
          const sedUrn = modelingFormat?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
          if (!sedUrn || !modelingFormat.id || !model.language.startsWith(sedUrn)) {
            continue;
          }
          edamId = modelingFormat.id;
        }
        if (edamId) {
          modelFormats.add(edamId);
        } else {
          specsContainUnsupportedModel = true;
        }

        let apiChange: SedModelAttributeChange;
        model.changes.forEach((change: SedModelChange) => {
          switch (change) {
            case change as CommonAttributeChange:
              console.log(`Common attribute change!`);
              apiChange = {
                _type: SedModelAttributeChangeTypeEnum.SedModelAttributeChange,
                newValue: change.newValue,
                target: change.target as SedTarget,
                id: change.id as string,
                name: change.name,
              };
              this.addParameterRow(apiChange);
          }
        });
      });

      sedDoc.simulations.forEach((sim: SedSimulation): void => {
        const kisaoId = sim.algorithm.kisaoId;
        if (kisaoId in simulationAlgorithmsMap) {
          simulationAlgorithms.add(kisaoId);
        } else {
          specsContainUnsupportedAlgorithm = true;
        }
      });
    });

    this.setUnsupportedModelErrorIsShown(specsContainUnsupportedModel);
    this.setUnsupportedAlgorithmErrorIsShown(specsContainUnsupportedAlgorithm);

    this.formGroup.controls.modelFormats.setValue(Array.from(modelFormats));
    this.formGroup.controls.simulationAlgorithms.setValue(Array.from(simulationAlgorithms));

    this.controlImpactingEligibleSimulatorsUpdated();
  }

  private processSimulationResponse(
    data: SimulationRun,
    name: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // min min
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    email: string | null,
  ): void {
    const simulationId = data.id;
    const simulatorDigest = data.simulatorDigest;
    const submitted = new Date(data.submitted);
    const updated = new Date(data.submitted);
    const simulation: Simulation = {
      id: simulationId,
      name: name,
      email: email || undefined,
      simulator: simulator,
      simulatorVersion: simulatorVersion,
      simulatorDigest: simulatorDigest,
      cpus: cpus,
      memory: memory,
      maxTime: maxTime,
      envVars: envVars,
      purpose: purpose,
      submittedLocally: true,
      status: SimulationRunStatus.QUEUED,
      runtime: undefined,
      submitted: submitted,
      updated: updated,
    };
    this.simulationService.storeNewLocalSimulation(simulation);
    this.router.navigate(['/runs', simulationId]);
    this.showFormSubmittedSnackbar();
  }

  // Error handling

  private resetProjectErrors(): void {
    this.formGroup.controls.modelFormats.setErrors({ unsupportedFormats: null });
    this.formGroup.controls.modelFormats.updateValueAndValidity();
    this.formGroup.controls.simulationAlgorithms.setErrors({ unsupportedAlgorithms: null });
    this.formGroup.controls.simulationAlgorithms.updateValueAndValidity();
  }

  private setUnsupportedModelErrorIsShown(shown: boolean): void {
    if (shown) {
      this.formGroup.controls.modelFormats.setErrors({ unsupportedFormats: true });
      this.formGroup.controls.modelFormats.markAsTouched();
    } else {
      this.formGroup.controls.modelFormats.setErrors({ unsupportedFormats: null });
      this.formGroup.controls.modelFormats.updateValueAndValidity();
    }
  }

  private setUnsupportedAlgorithmErrorIsShown(shown: boolean): void {
    if (shown) {
      this.formGroup.controls.simulationAlgorithms.setErrors({ unsupportedAlgorithms: true });
      this.formGroup.controls.simulationAlgorithms.markAsTouched();
    } else {
      this.formGroup.controls.simulationAlgorithms.setErrors({ unsupportedAlgorithms: null });
      this.formGroup.controls.simulationAlgorithms.updateValueAndValidity();
    }
  }

  // Setters for preloading form controls from route params

  private setControlsFromParams(params: Params, simulatorSpecsMap: SimulatorSpecsMap): void {
    if (!params) {
      return;
    }
    this.setProject(params.projectUrl);
    this.setSimulator(params.simulator, params.simulatorVersion, simulatorSpecsMap);
    this.setCpuCount(params.cpus);
    this.setMemory(params.memory);
    this.setMaxTime(params.maxTime);
    this.setRunName(params.runName);
    this.setSimulationParams(params.simulationParams);
  }

  private setSimulationParams(simParams: any): void {
    // TODO: Update the model changes form.
  }

  private setProject(projectUrl: string): void {
    if (!projectUrl) {
      return;
    }
    this.formGroup.controls.projectUrl.setValue(projectUrl);
    this.projectControlUpdated();
  }

  private setSimulator(simulator: string, simulatorVersion: string, simulatorSpecsMap: SimulatorSpecsMap): void {
    if (!simulator) {
      return;
    }
    const normalizedSimulator = simulator.toLowerCase();
    for (const simulatorId of Object.keys(simulatorSpecsMap)) {
      if (simulatorId.toLowerCase() !== normalizedSimulator) {
        continue;
      }
      this.formGroup.controls.simulator.setValue(simulatorId);
      this.simulatorControlUpdated();
      this.setSimulatorVersion(simulatorId, simulatorVersion, simulatorSpecsMap);
      break;
    }
  }

  private setSimulatorVersion(
    simulatorId: string,
    simulatorVersion: string,
    simulatorSpecsMap: SimulatorSpecsMap,
  ): void {
    if (!simulatorVersion) {
      return;
    }
    if (simulatorSpecsMap[simulatorId].versions.includes(simulatorVersion)) {
      this.formGroup.controls.simulatorVersion.setValue(simulatorVersion);
    }
  }

  private setCpuCount(cpuCount: string): void {
    const cpuCountNum = Math.ceil(parseFloat(cpuCount));
    if (isNaN(cpuCountNum) || cpuCountNum < 1) {
      return;
    }
    this.formGroup.controls.cpus.setValue(cpuCount);
  }

  private setMemory(memory: string): void {
    const memoryNum = parseFloat(memory);
    if (isNaN(memoryNum) || memoryNum <= 0) {
      return;
    }
    this.formGroup.controls.memory.setValue(memory);
  }

  private setMaxTime(maxTime: string): void {
    const maxTimeNum = parseFloat(maxTime);
    if (isNaN(maxTimeNum) || maxTimeNum <= 0) {
      return;
    }
    this.formGroup.controls.maxTime.setValue(maxTime);
  }

  private setRunName(runName: string): void {
    if (!runName) {
      return;
    }
    this.formGroup.controls.name.setValue(runName);
  }

  // Snackbars

  private showFormSubmittedSnackbar(): void {
    this.snackBar.open(
      `Your simulation was submitted. ` +
        'You can view the status of your simulation at this page ' +
        'or from the "Your simulation runs page". ' +
        'When your simulation completes, you will be able to ' +
        'retrieve and visualize its results here.',
      'Ok',
      {
        duration: 10000,
      },
    );
  }

  // Form Validators

  private formValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};

    if (!formGroup.value.projectFile && !formGroup.value.projectUrl) {
      errors['noProject'] = true;
    }

    if (formGroup.value.projectFile && formGroup.value.projectUrl) {
      errors['multipleProjects'] = true;
    }

    if (this.emailEnabled) {
      const email = formGroup.controls.email as UntypedFormControl;
      const emailConsent = formGroup.controls.emailConsent as UntypedFormControl;
      if (email.value && !email.hasError('email') && !emailConsent.value) {
        errors['emailNotConsented'] = true;
      }
    }

    return Object.keys(errors).length ? errors : null;
  }
}
