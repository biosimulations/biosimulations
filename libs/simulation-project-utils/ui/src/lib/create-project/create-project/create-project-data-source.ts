import { Observable } from 'rxjs';
import {
  IMultiStepFormDataSource,
  IMultiStepFormDataTask,
  FormStepData,
  IFormStepComponent,
  IMultiStepFormButton,
} from '@biosimulations/shared/ui';
import {
  SUPPORTED_SIMULATION_TYPES,
  CustomizableSedDocumentData,
  MultipleSimulatorsAlgorithmParameter,
  SimulatorsData,
  GatherCompatibleFormats,
} from '@biosimulations/simulation-project-utils/service';
import { ViewContainerRef } from '@angular/core';
import { SimulationType, AlgorithmSubstitution } from '@biosimulations/datamodel/common';
import { Params } from '@angular/router';
import {
  UploadModelComponent,
  UniformTimeCourseSimulationComponent,
  SimulatorTypeComponent,
  AlgorithmParametersComponent,
  NamespacesComponent,
  ModelChangesComponent,
  ModelVariablesComponent,
} from '../form-steps';

export enum CreateProjectFormStep {
  UploadModel = 'UploadModel',
  FrameworkSimTypeAndAlgorithm = 'FrameworkSimTypeAndAlgorithm',
  UniformTimeCourseSimulationParameters = 'UniformTimeCourseSimulationParameters',
  AlgorithmParameters = 'AlgorithmParameters',
  ModelNamespace = 'ModelNamespace',
  ModelChanges = 'ModelChanges',
  Observables = 'Observables',
}

export class CreateProjectDataSource implements IMultiStepFormDataSource<CreateProjectFormStep> {
  public formData: Record<CreateProjectFormStep, FormStepData> = <Record<CreateProjectFormStep, FormStepData>>{};
  public introspectedData?: CustomizableSedDocumentData;

  public constructor(
    private simulatorsData: SimulatorsData,
    private algSubstitutions: AlgorithmSubstitution[],
    private introspectionProvider: (dataSource: CreateProjectDataSource) => Observable<void> | null,
    private downloadHandler: () => void,
    private simulateHandler: () => void,
  ) {}

  // MultiStepFormDataSource

  public getDataForStep(stepId: CreateProjectFormStep): FormStepData {
    return this.formData[stepId];
  }

  public setDataForStep(stepId: CreateProjectFormStep, data: FormStepData | null): void {
    if (!data) {
      delete this.formData[stepId];
      return;
    }
    this.formData[stepId] = data;
  }

  public formStepIds(): CreateProjectFormStep[] {
    return [
      CreateProjectFormStep.UploadModel,
      CreateProjectFormStep.FrameworkSimTypeAndAlgorithm,
      CreateProjectFormStep.UniformTimeCourseSimulationParameters,
      CreateProjectFormStep.ModelNamespace,
      CreateProjectFormStep.ModelChanges,
      CreateProjectFormStep.Observables,
      CreateProjectFormStep.AlgorithmParameters,
    ];
  }

  public shouldShowFormStep(stepId: CreateProjectFormStep): boolean {
    switch (stepId) {
      case CreateProjectFormStep.UniformTimeCourseSimulationParameters:
        return this.shouldShowUniformTimeStep();
      case CreateProjectFormStep.AlgorithmParameters:
        return this.shouldShowAlgorithmParametersStep();
      default:
        return true;
    }
  }

  public createFormStepComponent(stepId: CreateProjectFormStep, hostView: ViewContainerRef): IFormStepComponent {
    switch (stepId) {
      case CreateProjectFormStep.UploadModel:
        return this.createUploadModelForm(hostView);
      case CreateProjectFormStep.FrameworkSimTypeAndAlgorithm:
        return this.createSimulatorTypeForm(hostView);
      case CreateProjectFormStep.UniformTimeCourseSimulationParameters:
        return this.createUniformTimeCourseForm(hostView);
      case CreateProjectFormStep.AlgorithmParameters:
        return this.createAlgorithmParametersForm(hostView);
      case CreateProjectFormStep.ModelNamespace:
        return this.createNamespaceForm(hostView);
      case CreateProjectFormStep.ModelChanges:
        return this.createModelChangesForm(hostView);
      case CreateProjectFormStep.Observables:
        return this.createObservablesForm(hostView);
    }
  }

  public configureFormStepComponent(stepId: CreateProjectFormStep, stepComponent: IFormStepComponent): void {
    switch (stepId) {
      case CreateProjectFormStep.UploadModel:
        this.configureUploadModelForm(stepComponent as UploadModelComponent);
        break;
      case CreateProjectFormStep.FrameworkSimTypeAndAlgorithm:
        this.configureSimulatorTypeForm(stepComponent as SimulatorTypeComponent);
        break;
      case CreateProjectFormStep.UniformTimeCourseSimulationParameters:
        this.configureUniformTimeCourseForm(stepComponent as UniformTimeCourseSimulationComponent);
        break;
      case CreateProjectFormStep.AlgorithmParameters:
        this.configureAlgorithmParametersForm(stepComponent as AlgorithmParametersComponent);
        break;
      case CreateProjectFormStep.ModelNamespace:
        this.configureNamespaceForm(stepComponent as NamespacesComponent);
        break;
      case CreateProjectFormStep.ModelChanges:
        this.configureModelChangesForm(stepComponent as ModelChangesComponent);
        break;
      case CreateProjectFormStep.Observables:
        this.configureObservablesForm(stepComponent as ModelVariablesComponent);
        break;
    }
  }

  public startDataTask(stepId: CreateProjectFormStep): IMultiStepFormDataTask | null {
    if (stepId !== CreateProjectFormStep.FrameworkSimTypeAndAlgorithm) {
      return null;
    }
    const introspectionObservable = this.introspectionProvider(this);
    if (!introspectionObservable) {
      return null;
    }
    return {
      spinnerLabel: 'Processing your model',
      completionObservable: introspectionObservable,
    };
  }

  public extraButtonsForFormStep(formStepId: CreateProjectFormStep): IMultiStepFormButton[] | null {
    if (formStepId === CreateProjectFormStep.AlgorithmParameters) {
      return [
        {
          label: 'Download',
          onClick: this.downloadHandler,
        },
        {
          label: 'Simulate',
          onClick: this.simulateHandler,
        },
      ];
    }
    return null;
  }

  // Preload form data

  public preloadDataFromParams(params: Params | null): void {
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
    SUPPORTED_SIMULATION_TYPES.forEach((simType: SimulationType): void => {
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

  // Form step conditions

  private shouldShowUniformTimeStep(): boolean {
    const algorithmData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const simulationType = algorithmData?.simulationType;
    return simulationType === SimulationType.SedUniformTimeCourseSimulation;
  }

  private shouldShowAlgorithmParametersStep(): boolean {
    const algorithmData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const parameters = algorithmData?.parameters as Record<string, MultipleSimulatorsAlgorithmParameter>;
    return parameters && Object.keys(parameters).length > 0;
  }

  // Form component creation

  private createUploadModelForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(UploadModelComponent);
    return hostedComponent.instance;
  }

  private configureUploadModelForm(formComponent: UploadModelComponent): void {
    const compatibleFormats = GatherCompatibleFormats(
      this.simulatorsData.simulatorSpecs,
      this.simulatorsData.modelFormats,
    );
    formComponent.modelFormats = compatibleFormats;
  }

  private createSimulatorTypeForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(SimulatorTypeComponent);
    return hostedComponent.instance;
  }

  private configureSimulatorTypeForm(formComponent: SimulatorTypeComponent): void {
    const uploadModelFormData = this.formData[CreateProjectFormStep.UploadModel];
    const modelFormat = uploadModelFormData?.modelFormat as string;
    formComponent.setup(this.simulatorsData, modelFormat);
  }

  private createUniformTimeCourseForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(UniformTimeCourseSimulationComponent);
    return hostedComponent.instance;
  }

  private configureUniformTimeCourseForm(formComponent: UniformTimeCourseSimulationComponent): void {
    const introspectedTimeCourseData = this.introspectedData?.uniformTimeCourseSimulation;
    if (introspectedTimeCourseData) {
      formComponent.loadIntrospectedTimeCourseData(introspectedTimeCourseData);
    }
  }

  private createNamespaceForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(NamespacesComponent);
    return hostedComponent.instance;
  }

  private configureNamespaceForm(formComponent: NamespacesComponent): void {
    const introspectedNamespaces = this.introspectedData?.namespaces;
    if (introspectedNamespaces) {
      formComponent.loadIntrospectedNamespaces(introspectedNamespaces);
    }
  }

  private createModelChangesForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(ModelChangesComponent);
    return hostedComponent.instance;
  }

  private configureModelChangesForm(formComponent: ModelChangesComponent): void {
    const introspectedChanges = this.introspectedData?.modelChanges;
    if (introspectedChanges) {
      formComponent.loadIntrospectedModelChanges(introspectedChanges);
    }
  }

  private createObservablesForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(ModelVariablesComponent);
    return hostedComponent.instance;
  }

  private configureObservablesForm(formComponent: ModelVariablesComponent): void {
    const introspectedVariables = this.introspectedData?.modelVariables;
    if (introspectedVariables) {
      formComponent.loadIntrospectedVariables(introspectedVariables);
    }
  }

  private createAlgorithmParametersForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(AlgorithmParametersComponent);
    return hostedComponent.instance;
  }

  private configureAlgorithmParametersForm(formComponent: AlgorithmParametersComponent): void {
    const simMethodData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const uploadModelData = this.formData[CreateProjectFormStep.UploadModel];
    formComponent.setup(
      uploadModelData?.modelFormat as string,
      simMethodData?.framework as string,
      simMethodData?.algorithm as string,
      simMethodData?.parameters as Record<string, MultipleSimulatorsAlgorithmParameter>,
      this.simulatorsData.simulatorSpecs,
      this.algSubstitutions,
    );
  }
}
