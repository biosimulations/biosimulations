import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, BehaviorSubject, combineLatest, throwError, Subscription } from 'rxjs';
import { catchError, map, concatAll, debounceTime, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SedSimulation, SimulationType } from '@biosimulations/datamodel/common';
import {
  CombineArchiveSedDocSpecsContent,
  CombineArchiveSedDocSpecs,
  SedDocument,
  SedModel,
} from '@biosimulations/combine-api-angular-client';
import {
  SedModelChange,
  SedModelAttributeChangeTypeEnum,
  SedVariable,
  SedUniformTimeCourseSimulation,
  Namespace,
  SedOutput,
  SedReportTypeEnum,
  SedReport,
  SedDataGenerator,
  SedDataSet,
  SedUniformTimeCourseSimulationTypeEnum,
} from '@biosimulations/combine-api-angular-client';
import { BIOSIMULATIONS_FORMATS, BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { environment } from '@biosimulations/shared/environments';
import { Params, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { ISimulation, Simulation, isUnknownSimulation } from '../shared-datamodel';
import { SimulationStatusService } from '../shared-datamodel';
import { Storage } from '@ionic/storage-angular';
import { ConfigService } from '@biosimulations/config/angular';
import { SimulationRun } from '@biosimulations/datamodel/common';
import { Endpoints } from '@biosimulations/config/common';
import { SimulationRunService } from '@biosimulations/angular-api-client';
import { CommonFile } from '@biosimulations/datamodel/common';

export type FormStepData = Record<string, unknown>;

export interface ReRunQueryParams {
  projectUrl?: string;
  simulator?: string;
  simulatorVersion?: string;
  runName?: string;
  //files: CommonFile[];
  files: string;
}

export interface CustomizableSedDocumentData {
  modelChanges: SedModelChange[];
  modelVariables: SedVariable[];
  uniformTimeCourseSimulation?: SedUniformTimeCourseSimulation;
  namespaces: Namespace[];
}

export interface SimMethodData extends FormStepData {
  simulationType?: SimulationType;
  algorithm?: string;
  framework?: string;
}

export interface ModelData extends FormStepData {
  modelFormat: string;
  modelFile: Blob;
  modelUrl: string;
  modelChanges?: SedModelChange[];
}

export interface CustomSimulationDatasource {
  simMethodData: SimMethodData;
  modelData: ModelData;
  introspectedData?: CustomizableSedDocumentData | null;
}

const UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR = function (attrName: string): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors | null {
    const values = control.value;

    const attributes = values.map((value: any): string => {
      return value?.[attrName];
    });

    const uniqueValues = new Set<string>(attributes);
    if (uniqueValues.size === values.length) {
      return null;
    }

    const error: ValidationErrors = {};
    error[attrName + 'Unique'] = true;
    return error;
  };
};

const SEDML_ID_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const idPattern = /^[a-z_][a-z0-9_]+$/i;
  const value = control.value;
  if (value && control.value.match(idPattern)) {
    return null;
  }
  return { validSedmlId: true };
};

@Component({
  selector: 'biosimulations-run-custom-simulation',
  templateUrl: './run-custom-simulation.component.html',
  styleUrls: ['./run-custom-simulation.component.scss'],
})
export class RunCustomSimulationComponent implements OnInit, OnChanges {
  public formGroup: UntypedFormGroup;
  public introspectionData$?: Observable<CustomizableSedDocumentData | null> | any;
  //public introspectedData?: CustomizableSedDocumentData;
  public dataSource!: CustomSimulationDatasource;
  public formArray: UntypedFormArray | any;
  public nextClicked = false;
  public isReRun = false;
  public reRunSedParams!: Observable<CombineArchiveSedDocSpecs | undefined>;
  public subscriptions: Subscription[] = [];

  @Input() public archive?: File;

  public constructor(
    private formBuilder: UntypedFormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private simulationService: SimulationServiceShared,
  ) {
    this.formGroup = this.formBuilder.group({
      projectUrl: ['', []],
      modelSource: ['', []],
      modelFormats: ['', []],
      simulationAlgorithms: ['', []],
      simType: ['', []],
      formArray: this.formBuilder.array([], {
        validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
      }),
    });
    this.formArray = this.formGroup.get('formArray') as UntypedFormArray;
  }

  private setControlsFromParams(params: Params): void {
    if (!params) {
      return;
    }
    this.setProject(params.projectUrl);
    console.log(`simulator set!`);
  }

  private setProject(projectUrl: string): void {
    if (!projectUrl) {
      return;
    }
    this.formGroup.controls.projectUrl.setValue(projectUrl);
    console.log(`The project is set!`);
  }

  public ngOnInit() {
    this.addDefaultFields();

    // 1. set the datasource(CustomSimulationDataSource) by deriving vals from reRun Query params
    this.route.queryParams.subscribe((params) => {
      this.setControlsFromParams(params);
      if (params.projectUrl) {
        this.setProject(params?.projectUrl);
      }
    });

    if (this.archive) {
      this.reRunSedParams = this.simulationService.getSpecsOfSedDocsInCombineArchive(this.archive);
      const sub = this.reRunSedParams.subscribe(this.archiveSedDocSpecsLoaded.bind(this));
      this.subscriptions.push(sub);
    }

    console.log(`THE url val: ${this.formGroup.get('projectUrl')?.value}`);

    this.introspectionData$ = this.introspectionProvider(this.dataSource);

    // 1. Set the datasource (CustomSimulationDataSource) by deriving vals from reRunProject query params
    // 2. set this.introspectedData$ = this.introspectionProvider(customDataSource) , coming from file.
    // 3. simply then call this.populateModelChangesForm
  }

  public ngOnChanges(changes: SimpleChanges) {
    /* TODO: Extract changes from sharedFormArray here */
  }

  private addDefaultFields(): void {
    /* Set placeholder fields on init */
    const defaultRowCount = 3;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelChangeField();
    }
  }

  private introspectionProvider(dataSource: CustomSimulationDatasource): Observable<void | null> | null {
    const errorHandler = this.showIntrospectionFailedSnackbar.bind(this);
    const formatData = dataSource?.modelData;
    const simMethodData = dataSource?.simMethodData;
    const introspectionObservable = IntrospectNewProject(this.httpClient, formatData, simMethodData, errorHandler);
    console.log(`INTROSPECTION PROVIDER EVOKED IN CREATE PROJECT: ${introspectionObservable}`);
    if (!introspectionObservable) {
      return null;
    }
    return introspectionObservable.pipe(
      map((introspectionData: CustomizableSedDocumentData | null) => {
        if (introspectionData) {
          dataSource.introspectedData = introspectionData;
        }
      }),
    );
  }

  private populateModelChangesForm(): void {
    // remember that here the introspection comes from the model changes
    this.introspectionData$?.subscribe((introspection: CustomizableSedDocumentData | null) => {
      const introspectedChanges: SedModelChange[] | undefined = introspection?.modelChanges;
      if (introspectedChanges) {
        this.loadIntrospectedModelChanges(introspectedChanges);
        console.log(introspectedChanges);
      }
    });
  }

  /**
   * Preloads any model changes parsed out of the uploaded SedDocument into the form.
   * @param introspectedModelChanges SedModelChange instances parsed out of the uploaded SedDocument.
   */
  public loadIntrospectedModelChanges(introspectedModelChanges: SedModelChange[]): void {
    if (introspectedModelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    introspectedModelChanges.forEach((change: SedModelChange) => {
      this.addFieldForModelChange(change);
    });
  }

  /**
   * Loads any previously entered data back into the form. This will be called immediately before the
   * form step appears. Edited fields will overwrite model changes loaded via introspection.
   * @param formStepData Data containing the previously entered model changes.
   */
  public populateFormFromFormStepData(formStepData: FormStepData): void {
    const modelChanges = formStepData.modelChanges as Record<string, string>[];
    if (!modelChanges || modelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    modelChanges.forEach((modelChange: Record<string, string>): void => {
      this.addModelChangeField(modelChange);
    });
  }

  public getFormStepData(): FormStepData | null {
    this.formArray.updateValueAndValidity();
    if (!this.formArray.valid) {
      return null;
    }
    const modelChanges: Record<string, string>[] = [];
    this.formArray.controls.forEach((control: AbstractControl): void => {
      const formGroup = control as UntypedFormGroup;
      modelChanges.push({
        id: formGroup.value.id,
        name: formGroup.value.name,
        newValue: formGroup.value.newValue,
        target: formGroup.value.target,
        default: formGroup.controls.default.value,
      });
    });
    return {
      modelChanges: modelChanges,
    };
  }

  public removeModelChangeField(index: number): void {
    this.formArray.removeAt(index);
  }

  public formGroups(): UntypedFormGroup[] {
    return this.formArray.controls as UntypedFormGroup[];
  }

  public shouldShowIdError(formGroup: UntypedFormGroup): boolean {
    return this.nextClicked && formGroup.hasError('validSedmlId', 'id');
  }

  public shouldShowTargetError(formGroup: UntypedFormGroup): boolean {
    return this.nextClicked && formGroup.hasError('required', 'target');
  }

  public addModelChangeField(modelChange?: Record<string, string | null>): void {
    const modelChangeForm = this.formBuilder.group({
      id: [modelChange?.id, [SEDML_ID_VALIDATOR]],
      name: [modelChange?.name, []],
      target: [modelChange?.target, [Validators.required]],
      default: [modelChange?.default, []],
      newValue: [modelChange?.newValue, []],
    });
    modelChangeForm.controls.default.disable();
    this.formArray.push(modelChangeForm);
  }

  private addFieldForModelChange(modelChange: SedModelChange): void {
    // TODO: Support additional change types.
    if (modelChange && modelChange._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
      return;
    }
    this.addModelChangeField({
      id: modelChange.id || null,
      name: modelChange.name || null,
      target: modelChange.target.value || null,
      default: modelChange.newValue || null,
      newValue: null,
    });
  }

  public archiveSedDocSpecsLoaded(sedDocSpecs?: CombineArchiveSedDocSpecs): void {
    const modelFormats = new Set<string>();
    const modelSource: string[] = [];
    const simType: string[] = [];
    const simulationAlgorithms = new Set<string>();
    let specsContainUnsupportedModel = false;

    //  VALIDATE: Confirm that every model and algorithm within the sed doc spec is supported.
    sedDocSpecs?.contents.forEach((content: CombineArchiveSedDocSpecsContent, contentIndex: number): void => {
      const sedDoc: SedDocument = content.location.value;
      //this.loadData(sedDoc);
      sedDoc.models.forEach((model: SedModel, modelIndex: number): void => {
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
        // set model source for project introspection
        modelSource.push(model.source);
      });
      // SET SIMULATION ALGS
      sedDoc.simulations.forEach((sim: SedSimulation): void => {
        const kisaoId = sim.algorithm.kisaoId;
        simulationAlgorithms.add(kisaoId);
        simType.push(sim._type);
        // FILL DATA
      });
    });

    this.formGroup.controls.modelSource.setValue(modelSource);
    this.formGroup.controls.modelFormats.setValue(Array.from(modelFormats));
    this.formGroup.controls.simulationAlgorithms.setValue(Array.from(simulationAlgorithms));
    this.formGroup.controls.simType.setValue(simType);

    console.log(`THE model FORMATS set in group: ${this.formGroup.get('modelFormats')?.value}`);
    console.log(`The model source set in group: ${this.formGroup.get('modelSource')?.value}`);
    console.log(`THE sims set in group: ${this.formGroup.get('simType')?.value}`);

    console.log(`SED DOCS LOADED`);
  }

  private showIntrospectionFailedSnackbar(modelUrl: string): string | undefined {
    let msg =
      'Sorry! We were unable to get the input parameters and output variables of your model. ' +
      'This feature is only currently available for models encoded in BNGL, CellML, SBML, SBML-fbc, ' +
      'SBML-qual, and Smoldyn. Please refresh to try again.';
    if (modelUrl) {
      msg += ` Please check that ${modelUrl} is an accessible URL.`;
      return msg;
    }
  }
}

// -- INTROSPECTION SERVICE
export function IntrospectNewProject(
  http: HttpClient,
  modelData: FormStepData,
  simMethodData: FormStepData,
  errorHandler: (modelUrl: string) => void,
): Observable<CustomizableSedDocumentData | null> | null {
  const formData = CreateNewProjectFormData(modelData, simMethodData);
  if (!formData) {
    return null;
  }

  console.log(`THE SIM METHOD DATA FROM UTILS PROJECT INTROSPECTION: ${Object.keys(simMethodData)}`);
  console.log(`The framework and type: ${simMethodData.framework}, ${simMethodData.simulationType}`);
  console.log(`THE MODELDATA FROM UTILS PROJECT INTROSPECTION: ${Object.keys(modelData)}`);
  Object.keys(modelData).forEach((p) => {
    console.log(`THE MODEL DATA KEY VALUE: ${modelData[p]}`);
  });
  // console.log(`THE FILE: ${modelData.modelFile?.name}`);
  const modelUrl = modelData?.modelUrl as string;
  const endpoints = new Endpoints();
  const introspectionEndpoint = endpoints.getModelIntrospectionEndpoint(false);
  const introspectionObservable = PostNewProjectSedDocument(
    http,
    introspectionEndpoint,
    formData,
    modelUrl,
    errorHandler,
  );
  return introspectionObservable.pipe(map(CreateNewProjectArchiveDataOperator(simMethodData)));
}

function CreateNewProjectFormData(modelData: FormStepData, simMethodData: FormStepData): FormData | null {
  const modelFormat = modelData?.modelFormat as string;
  const modelFile = modelData?.modelFile as Blob;
  const modelUrl = modelData?.modelUrl as string;
  const frameworkId = simMethodData?.framework as string;
  const simulationType = simMethodData?.simulationType as SimulationType;
  const algorithmId = simMethodData?.algorithm as string;
  if (!modelFormat || (!modelUrl && !modelFile) || !frameworkId || !simulationType || !algorithmId) {
    return null;
  }
  const formData = new FormData();
  if (modelFile) {
    formData.append('modelFile', modelFile);
  } else {
    formData.append('modelUrl', modelUrl);
  }
  const formatData = BIOSIMULATIONS_FORMATS_BY_ID[modelFormat];
  const modelLanguage = formatData?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
  if (modelLanguage) {
    formData.append('modelLanguage', modelLanguage);
  }
  formData.append('modelingFramework', frameworkId);
  formData.append('simulationType', simulationType);
  formData.append('simulationAlgorithm', algorithmId);
  return formData;
}

function PostNewProjectSedDocument(
  http: HttpClient,
  postEndpoint: string,
  formData: FormData,
  modelUrl: string,
  errorHandler: (modelUrl: string) => void,
): Observable<SedDocument | null> {
  return http.post<SedDocument>(postEndpoint, formData).pipe(
    catchError((error: HttpErrorResponse): Observable<null> => {
      if (!environment.production) {
        console.error(error);
      }
      errorHandler(modelUrl);
      return of<null>(null);
    }),
  );
}

function CreateNewProjectArchiveDataOperator(
  simMethodData: FormStepData,
): (doc: SedDocument | null) => CustomizableSedDocumentData | null {
  const simulationType = simMethodData?.simulationType as SimulationType;
  return (sedDoc: SedDocument | null) => {
    return sedDoc ? CreateCustomizableSedDocumentData(sedDoc, simulationType) : null;
  };
}

function CreateCustomizableSedDocumentData(
  sedDoc: SedDocument,
  simulationType: SimulationType,
): CustomizableSedDocumentData {
  const namespaces: Namespace[] = [];
  const modelChanges = GatherModelChanges(sedDoc, namespaces);
  const modelVariables = GatherModelVariables(sedDoc, namespaces);
  const uniformTimeCourseSimulation = GatherTimeCourseData(sedDoc, simulationType);
  namespaces.sort((a, b): number => {
    return (a.prefix || '').localeCompare(b.prefix || '', undefined, {
      numeric: true,
    });
  });
  return {
    modelChanges: modelChanges,
    modelVariables: modelVariables,
    uniformTimeCourseSimulation: uniformTimeCourseSimulation,
    namespaces: namespaces,
  };
}

function GatherModelVariables(sedDoc: SedDocument, namespaces: Namespace[]): SedVariable[] {
  const sedReports = sedDoc.outputs?.filter((output: SedOutput): boolean => {
    return output._type === SedReportTypeEnum.SedReport;
  }) as SedReport[];
  const firstReport = sedReports?.[0];
  if (!firstReport || !firstReport.dataSets) {
    return [];
  }
  const modelVariables: SedVariable[] = [];
  const dataGeneratorsMap: { [id: string]: SedDataGenerator } = {};
  sedDoc.dataGenerators?.forEach((dataGenerator: SedDataGenerator): void => {
    dataGeneratorsMap[dataGenerator.id] = dataGenerator;
  });
  firstReport.dataSets.forEach((dataSet: SedDataSet): void => {
    const modelVar: SedVariable = dataGeneratorsMap[dataSet.dataGenerator].variables[0];
    if (!modelVar) {
      return;
    }
    modelVariables.push(modelVar);
    AddUniqueNamespaces(modelVar.target?.namespaces, namespaces);
  });
  return modelVariables;
}

function GatherModelChanges(sedDoc: SedDocument, namespaces: Namespace[]): SedModelChange[] {
  const changes = sedDoc?.models?.[0]?.changes;
  if (!changes) {
    return [];
  }
  const changeValues: SedModelChange[] = [];
  changes.forEach((change: SedModelChange): void => {
    // TODO: extend to other types of changes
    if (change._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
      return;
    }
    changeValues.push(change);
    AddUniqueNamespaces(change.target?.namespaces, namespaces);
  });
  changeValues.sort((a, b): number => {
    const aId = a.id || '';
    const bId = b.id || '';
    return aId.localeCompare(bId, undefined, { numeric: true });
  });
  return changeValues;
}

function GatherTimeCourseData(
  sedDoc: SedDocument,
  simType: SimulationType,
): SedUniformTimeCourseSimulation | undefined {
  const simulation = sedDoc?.simulations?.[0];
  const selectedType = simType !== SimulationType.SedUniformTimeCourseSimulation;
  const docType = simulation?._type === SedUniformTimeCourseSimulationTypeEnum.SedUniformTimeCourseSimulation;
  if (!selectedType || !docType) {
    return undefined;
  }
  return simulation as SedUniformTimeCourseSimulation;
}

function AddUniqueNamespaces(newNamespaces: Namespace[] | undefined, existingNamespaces: Namespace[]): void {
  if (!newNamespaces) {
    return;
  }
  newNamespaces.forEach((newNamespace: Namespace): void => {
    const alreadyAdded =
      existingNamespaces.find((namespace: Namespace): boolean => {
        return newNamespace.prefix === namespace.prefix;
      }) !== undefined;
    if (!alreadyAdded) {
      existingNamespaces.push(newNamespace);
    }
  });
}

// -- SHARED SIMULATION SERVICE IMPLEMENTATION

@Injectable({
  providedIn: 'root',
})
export class SimulationServiceShared {
  private key = 'simulations';
  private simulations: ISimulation[] = [];
  public reRunQueryParams: Subject<ReRunQueryParams> = new Subject();
  public reRunObservable!: Observable<ReRunQueryParams>;
  public reRunTriggered = false;

  // Memory/HTTP cache
  private simulationsMap$: { [key: string]: BehaviorSubject<ISimulation> } = {};
  private simulationsMapSubject = new BehaviorSubject(this.simulationsMap$);
  private simulationsArrSubject = new BehaviorSubject<ISimulation[]>([]);
  // Local Storage Map
  private simulationsMap: { [key: string]: ISimulation } = {};
  private storageInitialized = false;
  private simulationsAddedBeforeStorageInitialized: ISimulation[] = [];

  private _storage: Storage | null = null;

  private endpoints = new Endpoints();
  private sedmlSpecsEndpoint = this.endpoints.getSedmlSpecificationsEndpoint(false);

  public constructor(
    private config: ConfigService,
    private storage: Storage,
    private httpClient: HttpClient,
    private simRunHttpService: SimulationRunService,
    private router: Router,
  ) {
    this.initStorage();
  }

  public async initStorage() {
    this._storage = await this.storage.create();

    if ((await this._storage.keys()).includes(this.key)) {
      let simulations: ISimulation[] = await this._storage.get(this.key);
      simulations = this.parseDates(simulations);
      this.initSimulations(simulations);
    } else {
      this.initSimulations([]);
    }

    this.createSimulationsArray();
  }

  // Add the new rerunProject method

  public rerunProject(id: string): void {
    /*
      - Get Simulation Run data along with simulation run archive files array
      - Use fetched data to instantiate router Params as ReRunQueryParams
      - Navigate to dispatch, emitting ReRunQueryParams
     */
    const simulationRun$ = this.httpClient.get<SimulationRun>(this.endpoints.getSimulationRunEndpoint(true, id));

    const filesContent$ = this.httpClient
      .get(this.endpoints.getSimulationRunFilesEndpoint(true, id), { responseType: 'text' })
      .pipe(map((content) => JSON.parse(content) as CommonFile[]));

    forkJoin({ simulationRun: simulationRun$, filesContent: filesContent$ }).subscribe(
      ({ simulationRun, filesContent }) => {
        const queryParams: ReRunQueryParams = {
          projectUrl: this.endpoints.getSimulationRunDownloadEndpoint(true, id),
          simulator: simulationRun.simulator,
          simulatorVersion: simulationRun.simulatorVersion,
          runName: simulationRun.name + ' (rerun)',
          files: JSON.stringify(filesContent),
        };

        filesContent.forEach((item) => {
          console.log(`AN ITEM: ${item.id}`);
        });
        // Handling the promise returned by navigate
        this.router
          .navigate(['/runs/new'], { queryParams: queryParams })
          .then((success) => {
            if (success) {
              console.log('Navigation successful!');
            } else {
              console.log('Navigation failed!');
            }
          })
          .catch((error) => console.error('Navigation error:', error));
      },
    );
  }

  private setReRunEvent(queryParams: ReRunQueryParams) {
    this.reRunQueryParams.next(queryParams);
    this.reRunObservable = this.reRunQueryParams.asObservable();
    this.reRunTriggered = true;
    this.reRunObservable.subscribe((item) => {
      console.log(`What is subscribed: ${item.simulator}`);
    });
    console.log(`RUN OBSERVABLE SET! ${this.reRunObservable}. REURN SET: ${this.reRunTriggered}`);
  }

  private parseDates(simulations: ISimulation[]) {
    simulations.forEach((simulation: ISimulation): void => {
      if (typeof simulation.submitted === 'string') {
        simulation.submitted = new Date(simulation.submitted);
      }
      if (typeof simulation.updated === 'string') {
        simulation.updated = new Date(simulation.updated);
      }
    });
    return simulations;
  }

  /**
   * Subscribes to the map of the simulators creates and observable list of simulators.
   * This simplifies returning the simulators.
   * @see getSimulations
   */
  private createSimulationsArray(): void {
    this.simulationsMapSubject.pipe(shareReplay(1)).subscribe((simulationMap) => {
      if (Object.values(simulationMap).length) {
        combineLatest(Object.values(simulationMap).map((sims) => sims.asObservable())).subscribe((arr) => {
          this.simulationsArrSubject.next(arr);
        });
      } else {
        this.simulationsArrSubject.next([]);
      }
    });
  }

  private initSimulations(storedSimulations: ISimulation[]): void {
    const simulations = storedSimulations.concat(this.simulationsAddedBeforeStorageInitialized);
    simulations.forEach((simulation: ISimulation): void => {
      // Save to local storage map
      if (!(simulation.id in this.simulationsMap)) {
        this.simulations.push(simulation);
        this.simulationsMap[simulation.id] = simulation;
      }

      // save to http map
      if (this.simulationsMap$[simulation.id]) {
        this.cacheSimulation(simulation);
      } else {
        this.simulationsMap$[simulation.id] = new BehaviorSubject(simulation);
      }
      this.simulationsMapSubject.next(this.simulationsMap$);
    });

    this.updateSimulations();

    this.storageInitialized = true;
    if (this.simulationsAddedBeforeStorageInitialized.length) {
      (this._storage as Storage).set(this.key, this.simulations);
    }
  }

  public storeNewLocalSimulation(simulation: Simulation): void {
    this.storeSimulations([simulation]);
    this.addSimulation(simulation);
  }

  public storeExistingExternalSimulations(simulations: ISimulation[]): void {
    simulations = this.parseDates(simulations);
    simulations.forEach((simulation) => {
      simulation.submittedLocally = false;
      this.addSimulation(simulation);
      this.storeSimulations([simulation]);
    });
    this.storeSimulations(simulations);
  }

  /**
   * @Author Jonathan Karr
   * @param newSimulations An array of Simulations
   *
   * Store to LOCAL storage
   */
  private storeSimulations(newSimulations: ISimulation[]): void {
    if (this._storage && this.storageInitialized) {
      newSimulations.forEach((newSimulation: ISimulation): void => {
        if (newSimulation.id in this.simulationsMap) {
          const submittedLocally = this.simulationsMap[newSimulation.id]?.submittedLocally;
          Object.assign(this.simulationsMap[newSimulation.id], newSimulation);
          this.simulationsMap[newSimulation.id].submittedLocally = submittedLocally || false;
        } else {
          this.simulations.push(newSimulation);
          this.simulationsMap[newSimulation.id] = newSimulation;
        }
      });
      this._storage.set(this.key, this.simulations);
    } else {
      newSimulations.forEach((newSimulation: ISimulation): void => {
        this.simulationsAddedBeforeStorageInitialized.push(newSimulation);
      });
    }
  }

  private updateSimulations(newSimulations: ISimulation[] = []): void {
    for (const sim of newSimulations) {
      this.updateSimulation(sim.id);
    }
    for (const sim of this.simulations) {
      this.updateSimulation(sim.id);
    }
  }

  /**
   * Delete a simulation
   */
  public removeSimulation(id: string): void {
    const simulation: ISimulation = this.simulationsMap[id];
    const iSimulation = this.simulations.indexOf(simulation);
    this.simulations.splice(iSimulation, 1);
    delete this.simulationsMap[id];
    delete this.simulationsMap$[id];
    this.simulationsMapSubject.next(this.simulationsMap$);

    this.storeSimulations([]);
  }

  /**
   * Delete all simulations
   */
  public removeSimulations(): void {
    while (this.simulations.length) {
      const simulation: ISimulation = this.simulations.pop() as ISimulation;
      delete this.simulationsMap[simulation.id];
      delete this.simulationsMap$[simulation.id];
    }
    this.simulationsMapSubject.next(this.simulationsMap$);
    this.storeSimulations([]);
  }

  public getSimulations(): Observable<ISimulation[]> {
    return this.simulationsArrSubject.asObservable().pipe(shareReplay(1));
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   */
  private getSimulationHttp(uuid: string): Observable<ISimulation> {
    return this.simRunHttpService.getSimulationRun(uuid, false).pipe(
      catchError((error: HttpErrorResponse): Observable<undefined> => {
        if (error.status === HttpStatusCode.NotFound) {
          return of(undefined);
        } else {
          return throwError(error);
        }
      }),
      map((dispatchSimulation: SimulationRun | undefined): ISimulation => {
        if (dispatchSimulation) {
          return {
            name: dispatchSimulation.name,
            email: dispatchSimulation.email || undefined,
            id: dispatchSimulation.id,
            runtime: dispatchSimulation?.runtime || undefined,
            status: dispatchSimulation.status as unknown as SimulationRunStatus,
            submitted: new Date(dispatchSimulation.submitted),
            submittedLocally: false,
            simulator: dispatchSimulation.simulator,
            simulatorVersion: dispatchSimulation.simulatorVersion,
            simulatorDigest: dispatchSimulation.simulatorDigest,
            cpus: dispatchSimulation.cpus,
            memory: dispatchSimulation.memory,
            maxTime: dispatchSimulation.maxTime,
            envVars: dispatchSimulation.envVars,
            purpose: dispatchSimulation.purpose,
            updated: new Date(dispatchSimulation.updated),
            resultsSize: dispatchSimulation.resultsSize,
            projectSize: dispatchSimulation.projectSize,
          };
        } else {
          return {
            id: uuid,
          };
        }
      }),
    );
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * Contains the logic for the polling update.
   * Pull the simulator from cache, but add a debounce. Then, following subscription then must
   * wait some numer of seconds before firing. If the cached suimulation is still running, call
   * the http service to get the latest simulation. Then, save it to the cache Since this is
   * happening inside a subscription of the simulator from cache, saving it triggers the subscription again.
   * This will repeat until the simulator is no longer in a running state, and therefore wont be saved to the
   * cache, and wont cause a repeat. When saving it to the cache also save to local storage
   */
  private updateSimulation(uuid: string): void {
    const current = this.getSimulationFromCache(uuid).pipe(
      debounceTime(this.config.appConfig.simulationStatusRefreshIntervalSec * 1000),
    );
    current.subscribe((currentSim) => {
      if (SimulationStatusService.isSimulationStatusRunning(currentSim.status)) {
        this.getSimulationHttp(uuid).subscribe((newSim) => {
          newSim.submittedLocally = currentSim.submittedLocally || newSim.submittedLocally;
          this.storeSimulations([newSim]);
          this.cacheSimulation(newSim);
        });
      }
    });
  }
  private cacheSimulation(newSim: ISimulation): void {
    if (this.simulationsMap$[newSim.id]) {
      this.simulationsMap$[newSim.id].next(newSim);
      this.simulationsMapSubject.next(this.simulationsMap$);
    }
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * Just a simple wrapper to hide the private behaviorsubjects
   */
  private getSimulationFromCache(uuid: string): Observable<ISimulation> {
    return this.simulationsMap$[uuid].asObservable().pipe(shareReplay(1));
  }

  /**
   * Add a simulation to the http cache
   * @param simulation
   */
  private addSimulation(simulation: ISimulation): boolean {
    if (!(simulation.id in this.simulationsMap$)) {
      const simSubject = new BehaviorSubject(simulation);
      this.simulationsMap$[simulation.id] = simSubject;
      this.simulationsMapSubject.next(this.simulationsMap$);
      this.updateSimulation(simulation.id);
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * If we have the simulations in cache(a map of behavior subjects), return it, and trigger an update
   * If not, then get it via http, store it to cache, trigger an update (to start polling), and return
   * the simulator from cache. In both cases we want to return from cache. This is because the cache contains
   * behavior subjects already configured to poll the api. The recieving method can simply pipe or subscribe
   * to have the latest data.
   */
  public getSimulation(uuid: string): Observable<ISimulation> {
    if (uuid in this.simulationsMap$) {
      return this.getSimulationFromCache(uuid);
    } else {
      const sim = this.getSimulationHttp(uuid).pipe(
        map((value: ISimulation) => {
          if (isUnknownSimulation(value)) {
            return of(value);
          } else {
            // LOCAL Storage
            this.storeSimulations([value]);
            this.addSimulation(value);
            return this.getSimulationFromCache(uuid);
          }
        }),
        concatAll(),
        shareReplay(1),
      );

      return sim;
    }
  }

  public getSpecsOfSedDocsInCombineArchive(
    fileOrUrl: File | string,
  ): Observable<CombineArchiveSedDocSpecs | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    return this.httpClient.post<CombineArchiveSedDocSpecs>(this.sedmlSpecsEndpoint, formData).pipe(
      catchError((error: HttpErrorResponse): Observable<undefined> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<undefined>(undefined);
      }),
      shareReplay(1),
    );
  }
}
