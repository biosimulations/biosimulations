import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SimulationType, AlgorithmSubstitution } from '@biosimulations/datamodel/common';
import {
  ArchiveCreationUtility,
  ArchiveCreationSedDocumentData,
  AlgorithmParameterMap,
  DispatchService,
  CombineApiService,
  SimulatorsData,
} from '@biosimulations/simulation-project-utils/service';
import { CombineArchive, Namespace, SedVariable, SedModelChange } from '@biosimulations/combine-api-angular-client';
import { Observable, of, Subscription, zip } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoints } from '@biosimulations/config/common';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@biosimulations/shared/environments';
import { ConfigService } from '@biosimulations/config/angular';
import { FormHostDirective, HtmlSnackBarComponent } from '@biosimulations/shared/ui';
import {
  UploadModelComponent,
  UniformTimeCourseSimulationComponent,
  SimulatorTypeComponent,
  IntrospectingModelComponent,
  FormStepComponent,
  FormStepData,
  AlgorithmParametersComponent,
  ModelNamespacesComponent,
  ModelChangesComponent,
  ModelVariablesComponent,
  SimulationToolsComponent,
} from './form-steps';

enum CreateProjectFormStep {
  UploadModel = 'UploadModel',
  FrameworkSimTypeAndAlgorithm = 'FrameworkSimTypeAndAlgorithm',
  UniformTimeCourseSimulationParameters = 'UniformTimeCourseSimulationParameters',
  AlgorithmParameters = 'AlgorithmParameters',
  ModelNamespace = 'ModelNamespace',
  ModelChanges = 'ModelChanges',
  Observables = 'Observables',
  SimulationTools = 'SimulationTools',
}

@Component({
  selector: 'biosimulations-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(FormHostDirective) public formHostQuery!: QueryList<FormHostDirective>;

  public formHost!: FormHostDirective;
  public formPath: CreateProjectFormStep[] = [];
  public shouldShowSpinner = true;

  private currentFormStepComponent?: FormStepComponent;
  private formData: { [step in CreateProjectFormStep]?: FormStepData } = {};
  private simulatorsData?: SimulatorsData;
  private algSubstitutions: AlgorithmSubstitution[] = [];
  private subscriptions: Subscription[] = [];

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dispatchService: DispatchService,
    private combineApiService: CombineApiService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private config: ConfigService,
  ) {}

  // Life cycle

  public ngOnInit(): void {
    const simulatorsDataObs = this.dispatchService.getSimulatorsFromDb();
    const algSubObs = simulatorsDataObs.pipe(concatMap(this.getAlgSubs.bind(this)));
    const loadCompleteObs = zip([algSubObs, simulatorsDataObs, this.route.queryParams]);
    const loadCompleteSub = loadCompleteObs.subscribe(this.loadComplete.bind(this));
    this.subscriptions.push(loadCompleteSub);
  }

  public ngAfterViewInit(): void {
    if (this.formHostQuery.first) {
      this.setFormHost(this.formHostQuery.first);
    } else {
      const subscription = this.formHostQuery.changes.subscribe((comps: QueryList<FormHostDirective>) => {
        if (this.formHost) {
          return;
        }
        this.setFormHost(comps.first);
      });
      this.subscriptions.push(subscription);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  // Control callbacks

  public onNextClicked(): void {
    if (!this.currentFormStepComponent) {
      return;
    }
    this.currentFormStepComponent.nextClicked = true;
    const currentStep = this.currentFormStep();
    const currentStepData = this.currentFormStepComponent?.getFormStepData();
    if (!currentStepData || !currentStep) {
      return; // The form did not validate, do not proceed to next step.
    }
    this.formData[currentStep] = currentStepData;
    this.formPath.push(currentStep);
    if (currentStep === CreateProjectFormStep.FrameworkSimTypeAndAlgorithm) {
      this.showIntrospectingComponent();
    } else {
      this.loadCurrentFormStep();
    }
  }

  public onBackClicked(): void {
    const currentStep = this.currentFormStep();
    if (!currentStep) {
      return;
    }
    delete this.formData[currentStep];
    this.formPath.pop();
    this.loadCurrentFormStep();
  }

  public onSimulateClicked(): void {
    const formData = this.createSubmissionFormData();
    this.submitFormData(formData, (projectUrl: string): void => {
      this.simulateCreatedCombineArchive(projectUrl);
    });
  }

  public onDownloadClicked(): void {
    const formData = this.createSubmissionFormData();
    this.submitFormData(formData, (projectUrl: string): void => {
      this.downloadCreatedCombineArchive(projectUrl);
    });
  }
  public shouldShowBackButton(): boolean {
    const showingSpinner = this.currentFormStepComponent === undefined;
    return this.formPath.length > 0 && !showingSpinner;
  }

  public shouldShowNextButton(): boolean {
    const showingSpinner = this.currentFormStepComponent === undefined;
    return !showingSpinner && this.currentFormStep() !== CreateProjectFormStep.SimulationTools;
  }

  // Setup

  private setFormHost(formHost: FormHostDirective): void {
    this.formHost = formHost;
    // Since this function is called within change detection callbacks, editing the view further must
    // be pushed off to the next turn of the run loop. See https://angular.io/errors/NG0100
    setTimeout(() => {
      this.loadCurrentFormStep();
    });
  }

  private loadComplete(observerableValues: [AlgorithmSubstitution[] | undefined, SimulatorsData, Params]): void {
    this.algSubstitutions = observerableValues[0] === undefined ? [] : observerableValues[0];
    if (this.algSubstitutions.length === 0) {
      this.showAlgorithmSubstitutionErrorSnackbar();
    }
    this.simulatorsData = observerableValues[1];
    this.preloadDataFromParams(observerableValues[2]);
    this.shouldShowSpinner = false;
  }

  private getAlgSubs(simulatorsData: SimulatorsData): Observable<AlgorithmSubstitution[] | undefined> {
    const algorithmKeys = Object.keys(simulatorsData.simulationAlgorithms);
    return this.combineApiService.getSimilarAlgorithms(algorithmKeys);
  }

  // Form step state machine

  private loadCurrentFormStep(): void {
    const currentStep = this.currentFormStep();
    if (currentStep) {
      this.loadFormStep(currentStep);
    }
  }

  private showIntrospectingComponent(): void {
    const formContainerRef = this.formHost.viewContainerRef;
    formContainerRef.clear();
    this.currentFormStepComponent = undefined;
    this.createIntrospectingModelComponent(formContainerRef);
  }

  private loadFormStep(formStep: CreateProjectFormStep): void {
    const formContainerRef = this.formHost.viewContainerRef;
    formContainerRef.clear();

    switch (formStep) {
      case CreateProjectFormStep.UploadModel:
        this.currentFormStepComponent = this.createUploadModelForm(formContainerRef);
        break;
      case CreateProjectFormStep.FrameworkSimTypeAndAlgorithm:
        this.currentFormStepComponent = this.createSimulatorTypeForm(formContainerRef);
        break;
      case CreateProjectFormStep.UniformTimeCourseSimulationParameters:
        this.currentFormStepComponent = this.createUniformTimeCourseForm(formContainerRef);
        break;
      case CreateProjectFormStep.AlgorithmParameters:
        this.currentFormStepComponent = this.createAlgorithmParametersForm(formContainerRef);
        break;
      case CreateProjectFormStep.ModelNamespace:
        this.currentFormStepComponent = this.createModelNamespaceForm(formContainerRef);
        break;
      case CreateProjectFormStep.ModelChanges:
        this.currentFormStepComponent = this.createModelChangesForm(formContainerRef);
        break;
      case CreateProjectFormStep.Observables:
        this.currentFormStepComponent = this.createObservablesForm(formContainerRef);
        break;
      case CreateProjectFormStep.SimulationTools:
        this.currentFormStepComponent = this.createSimulationToolsForm(formContainerRef);
        break;
    }

    const currentData = this.formData[formStep];
    this.currentFormStepComponent?.populateFormFromFormStepData(currentData);
  }

  private currentFormStep(): CreateProjectFormStep | undefined {
    const orderedSteps = [
      CreateProjectFormStep.UploadModel,
      CreateProjectFormStep.FrameworkSimTypeAndAlgorithm,
      CreateProjectFormStep.UniformTimeCourseSimulationParameters,
      CreateProjectFormStep.AlgorithmParameters,
      CreateProjectFormStep.ModelNamespace,
      CreateProjectFormStep.ModelChanges,
      CreateProjectFormStep.Observables,
      CreateProjectFormStep.SimulationTools,
    ];

    const conditions: { [step in CreateProjectFormStep]?: () => boolean } = {};
    conditions[CreateProjectFormStep.UniformTimeCourseSimulationParameters] = this.shouldShowUniformTimeStep.bind(this);
    conditions[CreateProjectFormStep.AlgorithmParameters] = this.shouldShowAlgorithmParametersStep.bind(this);

    const lastStep = this.formPath.length > 0 ? this.formPath[this.formPath.length - 1] : undefined;
    const lastIndex = lastStep === undefined ? -1 : orderedSteps.indexOf(lastStep);

    for (let i = lastIndex + 1; i < orderedSteps.length; i++) {
      const potentialStep = orderedSteps[i];
      const stepCondition = conditions[potentialStep];
      if (!stepCondition || stepCondition()) {
        return potentialStep;
      }
    }

    return undefined;
  }

  // Form step conditions

  private shouldShowUniformTimeStep(): boolean {
    const algorithmData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const simulationType = algorithmData?.simulationType;
    return simulationType === SimulationType.SedUniformTimeCourseSimulation;
  }

  private shouldShowAlgorithmParametersStep(): boolean {
    const algorithmData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const parameters = algorithmData?.parameters as AlgorithmParameterMap;
    return parameters && Object.keys(parameters).length > 0;
  }

  // Form component creation

  private createUploadModelForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(UploadModelComponent);
    const uploadModelComponent = hostedComponent.instance as UploadModelComponent;
    uploadModelComponent.setup(this.simulatorsData);
    return uploadModelComponent;
  }

  private createSimulatorTypeForm(formContainerRef: ViewContainerRef): FormStepComponent | undefined {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(SimulatorTypeComponent);
    const simTypeComponent = hostedComponent.instance as SimulatorTypeComponent;
    const uploadModelFormData = this.formData[CreateProjectFormStep.UploadModel];
    const modelFormat = uploadModelFormData?.modelFormat as string;
    simTypeComponent.setup(this.simulatorsData, modelFormat);
    return simTypeComponent;
  }

  private createIntrospectingModelComponent(formContainerRef: ViewContainerRef): void {
    const hostedComponent = formContainerRef.createComponent<IntrospectingModelComponent>(IntrospectingModelComponent);
    const component = hostedComponent.instance as IntrospectingModelComponent;
    const uploadModelFormData = this.formData[CreateProjectFormStep.UploadModel];
    const simMethodFormData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    component.introspectModel(uploadModelFormData, simMethodFormData, this.introspectionHandler.bind(this));
  }

  private createUniformTimeCourseForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(UniformTimeCourseSimulationComponent);
    return hostedComponent.instance;
  }

  private createAlgorithmParametersForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const algorithmData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const parameters = algorithmData?.parameters as AlgorithmParameterMap;
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(AlgorithmParametersComponent);
    const component = hostedComponent.instance as AlgorithmParametersComponent;
    component.setup(parameters);
    return component;
  }

  private createModelNamespaceForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(ModelNamespacesComponent);
    return hostedComponent.instance;
  }

  private createModelChangesForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(ModelChangesComponent);
    const namespaceData = this.formData[CreateProjectFormStep.ModelNamespace];
    const namespaces = namespaceData?.namespaces as Namespace[];
    const modelChangesComponent = hostedComponent.instance as ModelChangesComponent;
    modelChangesComponent.setup(namespaces);
    return modelChangesComponent;
  }

  private createObservablesForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(ModelVariablesComponent);
    const namespaceData = this.formData[CreateProjectFormStep.ModelNamespace];
    const namespaces = namespaceData?.namespaces as Namespace[];
    const modelVariablesComponent = hostedComponent.instance as ModelVariablesComponent;
    modelVariablesComponent.setup(namespaces);
    return modelVariablesComponent;
  }

  private createSimulationToolsForm(formContainerRef: ViewContainerRef): FormStepComponent {
    const hostedComponent = formContainerRef.createComponent<FormStepComponent>(SimulationToolsComponent);
    const uploadModelData = this.formData[CreateProjectFormStep.UploadModel];
    const simMethodData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const parametersData = this.formData[CreateProjectFormStep.AlgorithmParameters];
    const simulationToolsComponent = hostedComponent.instance as SimulationToolsComponent;
    simulationToolsComponent.setup(
      uploadModelData?.modelFormat as string,
      simMethodData?.framework as string,
      simMethodData?.algorithm as string,
      parametersData?.algorithmParameters as AlgorithmParameterMap,
      this.simulatorsData as SimulatorsData,
      this.algSubstitutions,
      this.onSimulateClicked.bind(this),
      this.onDownloadClicked.bind(this),
    );
    return simulationToolsComponent;
  }

  // Preload form data

  private introspectionHandler(sedDocumentData: ArchiveCreationSedDocumentData | undefined): void {
    if (sedDocumentData) {
      this.preloadFormStepData(sedDocumentData);
    }
    this.loadCurrentFormStep();
  }

  private preloadFormStepData(introspectionData: ArchiveCreationSedDocumentData): void {
    if (!introspectionData) {
      return;
    }
    this.preloadUniformTimeCourseSimulationData(introspectionData);
    this.formData[CreateProjectFormStep.ModelNamespace] = { namespaces: introspectionData.namespaces };
    this.formData[CreateProjectFormStep.ModelChanges] = { modelChanges: introspectionData.modelChanges };
    this.formData[CreateProjectFormStep.Observables] = { modelVariables: introspectionData.modelVariables };
  }

  private preloadDataFromParams(params: Params): void {
    if (!params) {
      return;
    }
    this.preloadUploadModelData(params.modelUrl, params.modelFormat);
    this.preloadSimMethodData(params.modelingFramework, params.simulationType, params.simulationAlgorithm);
  }

  private preloadUploadModelData(modelUrl: string, modelFormat: string): void {
    modelFormat = modelFormat?.toLowerCase();
    const match = modelFormat?.match(/^(format[:_])?(\d{1,4})$/);
    if (match) {
      modelFormat = 'format_' + '0'.repeat(4 - match[2].length) + match[2];
    }
    const uploadModelData = this.formData[CreateProjectFormStep.UploadModel] || {};
    uploadModelData.modelUrl = modelUrl;
    uploadModelData.modelFormat = modelFormat;
    this.formData[CreateProjectFormStep.UploadModel] = uploadModelData;
  }

  private preloadSimMethodData(framework: string, simulationType: string, algorithm: string): void {
    framework = framework?.toUpperCase();
    let match = framework?.match(/^(SBO[:_])?(\d{1,7})$/);
    if (match) {
      framework = 'SBO_' + '0'.repeat(7 - match[2].length) + match[2];
    }

    if (!simulationType?.startsWith('Sed')) {
      simulationType = 'Sed' + simulationType;
    }
    if (!simulationType?.endsWith('Simulation')) {
      simulationType = simulationType + 'Simulation';
    }
    ArchiveCreationUtility.SUPPORTED_SIMULATION_TYPES.forEach((simType: SimulationType): void => {
      if (simulationType.toLowerCase() == simType.toLowerCase()) {
        simulationType = simType;
      }
    });

    algorithm = algorithm?.toUpperCase();
    match = algorithm?.match(/^(KISAO[:_])?(\d{1,7})$/);
    if (match) {
      algorithm = 'KISAO_' + '0'.repeat(7 - match[2].length) + match[2];
    }

    const simMethodData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm] || {};
    simMethodData.framework = framework;
    simMethodData.simulationType = simulationType;
    simMethodData.algorithm = algorithm;
    this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm] = simMethodData;
  }

  private preloadUniformTimeCourseSimulationData(data: ArchiveCreationSedDocumentData): void {
    const simulation = data.uniformTimeCourseSimulation;
    if (!simulation) {
      return;
    }
    const timeCourseData = {
      initialTime: simulation.initialTime,
      outputStartTime: simulation.outputStartTime,
      outputEndTime: simulation.outputEndTime,
      numberOfSteps: simulation.numberOfSteps,
    };
    this.formData[CreateProjectFormStep.UniformTimeCourseSimulationParameters] = timeCourseData;
  }

  // Submission

  private getArchiveSpecs(): CombineArchive | undefined {
    const uploadModelData = this.formData[CreateProjectFormStep.UploadModel];
    const simulationMethodData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const algorithmParamData = this.formData[CreateProjectFormStep.AlgorithmParameters];
    const timeCourseData = this.formData[CreateProjectFormStep.UniformTimeCourseSimulationParameters];
    const namespacesData = this.formData[CreateProjectFormStep.ModelNamespace];
    const modelChangesData = this.formData[CreateProjectFormStep.ModelChanges];
    const modelVariablesData = this.formData[CreateProjectFormStep.Observables];
    if (!uploadModelData || !simulationMethodData || !namespacesData || !modelChangesData || !modelVariablesData) {
      return undefined;
    }
    const archiveCreationData = {
      modelFormat: uploadModelData.modelFormat as string,
      modelUrl: uploadModelData.modelUrl as string,
      modelFile: uploadModelData.modelFile as File,
      algorithmId: simulationMethodData.algorithm as string,
      simulationType: simulationMethodData.simulationType as SimulationType,
      initialTime: timeCourseData?.initialTime as number,
      outputStartTime: timeCourseData?.outputStartTime as number,
      outputEndTime: timeCourseData?.outputEndTime as number,
      numberOfSteps: timeCourseData?.numberOfSteps as number,
      algorithmParameters: algorithmParamData?.algorithmParameters as AlgorithmParameterMap,
      namespaces: namespacesData.namespaces as Namespace[],
      modelChanges: modelChangesData.modelChanges as SedModelChange[],
      modelVariables: modelVariablesData.modelVariables as SedVariable[],
    };
    return ArchiveCreationUtility.createArchive(archiveCreationData);
  }

  private simulateCreatedCombineArchive(projectUrl: string): void {
    const uploadData = this.formData[CreateProjectFormStep.UploadModel];
    const simMethodData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    if (!projectUrl || !uploadData || !simMethodData) {
      return;
    }
    const queryParams = {
      projectUrl: projectUrl,
      modelFormat: uploadData.modelFormat as string,
      modelingFramework: simMethodData.framework as string,
      simulationAlgorithm: simMethodData.algorithm as string,
    };
    if (this.config.appId === 'dispatch') {
      this.router.navigate(['/runs/new'], { queryParams });
    } else {
      const url = `https://run.biosimulations.${environment.production ? 'org' : 'dev'}/runs/new`;
      const queryParamsString = new URLSearchParams(queryParams).toString();
      window.open(`${url}?${queryParamsString}`, 'runbiosimulations');
    }
    this.showArchiveCreatedSnackbar();
  }

  private downloadCreatedCombineArchive(projectUrl: string): void {
    const a = document.createElement('a');
    a.href = projectUrl;
    a.download = 'archive.omex';
    a.click();
    this.showArchiveDownloadedSnackbar();
  }

  private createSubmissionFormData(): FormData | undefined {
    const uploadModelData = this.formData[CreateProjectFormStep.UploadModel];
    if (!uploadModelData) {
      return undefined;
    }
    const formData = new FormData();
    formData.append('specs', JSON.stringify(this.getArchiveSpecs()));
    const modelFile = uploadModelData.modelFile as File;
    if (modelFile) {
      formData.append('files', modelFile);
    }
    return formData;
  }

  private submitFormData(formData: FormData | undefined, completion: (projectUrl: string) => void): void {
    if (!formData) {
      return;
    }
    const endpoints = new Endpoints();
    const url = endpoints.getCombineArchiveCreationEndpoint(true);
    const projectOrUrl: Observable<string | HttpEvent<string>> = this.http.post<string>(url, formData, {}).pipe(
      catchError((error: HttpErrorResponse): Observable<string> => {
        console.error(error);
        this.showProjectCreationErrorSnackbar();
        return of<string>('');
      }),
    );
    const projectOrUrlSub = projectOrUrl.subscribe((projectOrUrl: string | HttpEvent<string>): void => {
      completion(projectOrUrl as string);
    });
    this.subscriptions.push(projectOrUrlSub);
    this.showPleaseWaitSnackbar();
  }

  // Snackbars

  private showArchiveDownloadedSnackbar(): void {
    this.showDefaultConfiguredSnackbar('Your archive was downloaded to your computer.');
  }

  private showArchiveCreatedSnackbar(): void {
    this.showDefaultConfiguredSnackbar('Your archive was created. Please use this form to execute it.');
  }

  private showAlgorithmSubstitutionErrorSnackbar(): void {
    const msg =
      'Sorry! We were unable to load information about the simularity among algorithms. Please refresh to try again.';
    this.showDefaultConfiguredSnackbar(msg);
  }

  private showProjectCreationErrorSnackbar(): void {
    const msg = 'Sorry! We were unable to generate your COMBINE/OMEX archive. Please refresh to try again.';
    this.showDefaultConfiguredSnackbar(msg);
  }

  private showPleaseWaitSnackbar(): void {
    this.snackBar.openFromComponent(HtmlSnackBarComponent, {
      data: {
        message: 'Please wait while your project is created',
        spinner: true,
        action: 'Ok',
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private showDefaultConfiguredSnackbar(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
