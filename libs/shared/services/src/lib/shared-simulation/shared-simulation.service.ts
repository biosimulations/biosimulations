import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { catchError, map, concatAll, debounceTime, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SimulationType, CommonFile } from '@biosimulations/datamodel/common';
import {
  CombineArchiveSedDocSpecs,
  CombineArchiveSedDocSpecsContent,
  SedDocument,
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
import { BIOSIMULATIONS_FORMATS_BY_ID } from '@biosimulations/ontology/extra-sources';
import { environment } from '@biosimulations/shared/environments';
import { Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  ISimulation,
  Simulation,
  isUnknownSimulation,
  SimulationStatusService,
} from '../shared-simulation-status/shared-simulation-status.service';
import { Storage } from '@ionic/storage-angular';
import { ConfigService } from '@biosimulations/config/angular';
import { SimulationRun } from '@biosimulations/datamodel/common';
import { Endpoints } from '@biosimulations/config/common';
import { SimulationRunService } from '@biosimulations/angular-api-client';

// -- SHARED INTERFACES

export type FormStepData = Record<string, unknown>;

export interface ReRunQueryParams {
  /* we will use this to be the common datastore between:
        overview -> changes -> dispatch(run)
  */
  projectUrl?: string;
  simulator?: string;
  simulatorVersion?: string;
  runName?: string;
  files?: string; // this needs deserialization when fetched
  modelUrl?: string;
  modelFormat?: string;
  simulationType?: string;
  simulationAlgorithm?: string;
  modelingFramework?: string;
}

export interface CustomizableSedDocumentData {
  modelChanges: SedModelChange[];
  modelVariables: SedVariable[];
  uniformTimeCourseSimulation?: SedUniformTimeCourseSimulation;
  namespaces: Namespace[];
}

export interface SimMethodData extends FormStepData {
  simulationType?: SimulationType | string;
  algorithm?: string;
  framework?: string;
}

export interface ModelData extends FormStepData {
  modelFormat?: string;
  modelFile?: Blob | File | string;
  modelUrl?: string;
  modelChanges?: SedModelChange[];
  modelLanguage?: string; // urn identifier
}

export interface CustomSimulationDatasource {
  simMethodData: SimMethodData;
  modelData: ModelData;
  introspectedData?: CustomizableSedDocumentData;
  reRunParams?: ReRunQueryParams;
  modelUrl?: string;
}

// -- SHARED FUNCTIONS

export const UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR = function (attrName: string): ValidatorFn {
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

export const SEDML_ID_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const idPattern = /^[a-z_][a-z0-9_]+$/i;
  const value = control.value;
  if (value && control.value.match(idPattern)) {
    return null;
  }
  return { validSedmlId: true };
};

// -- SHARED SIMULATION SERVICE IMPLEMENTATION

@Injectable({
  providedIn: 'root',
})
export class SharedSimulationService {
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

    const projectUrl = this.endpoints.getSimulationRunDownloadEndpoint(true, id);
    forkJoin({ simulationRun: simulationRun$, filesContent: filesContent$ }).subscribe(
      ({ simulationRun, filesContent }) => {
        const queryParams: ReRunQueryParams = {
          projectUrl: projectUrl,
          simulator: simulationRun.simulator,
          simulatorVersion: simulationRun.simulatorVersion,
          runName: simulationRun.name + ' (rerun)',
          files: JSON.stringify(filesContent),
        };

        filesContent.forEach((file: any) => {
          console.log(`AN ITEM: ${file.id}`);
          switch (file) {
            case file as CommonFile:
              if (file.url.includes('xml') || file.url.includes('sbml')) {
                queryParams.modelUrl = file.url;
              }
          }
          queryParams.modelFormat = 'format_2585'; // TODO: change this

          const algorithmId = new Set<string>();
          const simType = new Set<string>();
          const framework = new Set<string>();
          this.getSpecsOfSedDocsInCombineArchive(projectUrl as string).subscribe(
            (sedDocSpecs: CombineArchiveSedDocSpecs | undefined) => {
              sedDocSpecs?.contents.forEach((content: CombineArchiveSedDocSpecsContent, contentIndex: number): void => {
                const sedDoc: SedDocument = content.location.value;
                /*sedDoc.models.forEach((model: SedModel, modelIndex: number): void => {
                let edamId: string | null = null;
                for (const modelingFormat of BIOSIMULATIONS_FORMATS) {
                  const sedUrn = modelingFormat?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
                  if (!sedUrn || !modelingFormat.id || !model.language.startsWith(sedUrn)) {
                    continue;
                  }
                  edamId = modelingFormat.id;
                }
                if (edamId) {
                  queryParams.modelFormat = edamId;
                }
              });*/
                sedDoc.simulations.forEach((sim: any): void => {
                  algorithmId.add(sim.algorithm?.kisaoId);
                  simType.add(sim._type);
                  framework.add('SBO_0000293');
                  console.log(`alg: ${sim._type}`);
                  queryParams.simulationAlgorithm = sim.algorithm.kisaoId;
                  queryParams.simulationType = sim._type;
                  queryParams.modelingFramework = 'SBO_0000293'; // TODO: make this dynamic
                });
              });
            },
          );
          queryParams.simulationAlgorithm = Array.from(algorithmId)[0];
          console.log(`query params: ${queryParams.simulationAlgorithm}`);
        });

        // Handling the promise returned by navigate
        this.router
          //.navigate(['/runs/new'], { queryParams: queryParams })
          .navigate(['/utils/create-project'], { queryParams: queryParams })
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

  public introspectNewProject(
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
    console.log(`THE MODEL URL BEING USED: ${modelUrl}`);
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

  public getIntrospectionData(
    modelFile: CommonFile,
    modelLanguage: string,
    simulationType: string,
    modelingFramework: string,
    kisaoId: string,
    errorHandler?: any,
  ): Observable<SedDocument | null> {
    /*const modelUrl = modelFile.url as string;
    const modelForm: ModelData = {
      modelFormat: modelLanguage,
      modelFile: modelUrl,
      modelUrl: modelUrl
    }
    const simForm: SimMethodData = {
      simulationType: simulationType,
      framework: modelingFramework,
      algorithm: kisaoId
    }
    return this.introspectNewProject(
      this.httpClient,
      modelForm,
      simForm,
      errorHandler
    );*/
    const formData = new FormData();
    const modelUrl = modelFile.url as string;
    formData.append('modelFile', modelUrl);
    formData.append('modelLanguage', modelLanguage);
    formData.append('simulationType', simulationType);
    formData.append('modelingFramework', modelingFramework);
    formData.append('simulationAlgorithm', kisaoId);
    formData.append('modelUrl', modelUrl);

    const introspectionEndpoint = this.endpoints.getModelIntrospectionEndpoint(false);
    return this.httpClient
      .post<SedDocument>(introspectionEndpoint, formData, { headers: { Accept: 'application/json' } })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Failed to get introspection data', error);
          return of(null); // Adjust based on how you want to handle errors
        }),
      );
  }

  public createCustomizableSedDocumentData(
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
}

// -- PRIVATE INTROSPECTION FUNCTIONS

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
