import { Observable } from 'rxjs';
import {
  IMultiStepFormDataSource,
  IMultiStepFormDataTask,
  FormStepData,
  IFormStepComponent,
  IMultiStepFormButton,
} from './forms';
import {
  SUPPORTED_SIMULATION_TYPES,
  MultipleSimulatorsAlgorithmParameter,
  GatherCompatibleFormats,
} from '../../../service/create-project/compatibility';
import { CustomizableSedDocumentData } from '../../../service/create-project/project-introspection';
import { SimulatorsData } from '../../../service/dispatch/dispatch.service';
import { ViewContainerRef } from '@angular/core';
import { SimulationType, AlgorithmSubstitution, CommonFile } from '@biosimulations/datamodel/common';
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
  public omexFileUploaded = false;
  public isReRun = false;
  public projectUrl!: string;
  public reRunModelId?: string;
  public hasExtraButtons = false;
  public reRunModelFile?: string | File | CommonFile;
  public reRunSimulator?: string;
  public reRunSimulatorVersion?: string;
  public reRunName?: string;
  public reRunMetadataFile?: CommonFile | File | string;
  public reRunSedFile?: CommonFile | File | string;

  public constructor(
    private simulatorsData: SimulatorsData,
    private algSubstitutions: AlgorithmSubstitution[],
    private introspectionProvider: (dataSource: CreateProjectDataSource) => Observable<void> | null,
    private downloadHandler: () => void,
    private simulateHandler: () => void,
  ) {
    this.simulateHandler = this.simulateHandler.bind(this);
    this.downloadHandler = this.downloadHandler.bind(this);
  }

  // MultiStepFormDataSource

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
    if (this.omexFileUploaded && stepId === CreateProjectFormStep.ModelChanges) {
      return true; // Directly go to model changes if an OMEX file was uploaded
    }
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
      //case CreateProjectFormStep.UploadArchive:
      //return this.createModelChangesForm(hostView);
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
      this.hasExtraButtons = true;
      return [
        {
          label: 'Download',
          onClick: this.downloadHandler,
          class: 'biosimulations-button run download',
        },
        {
          label: 'Simulate',
          onClick: this.simulateHandler,
          class: 'biosimulations-button run simulate',
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

    console.log(`Create project got params modelURL: ${params.modelUrl}`);
    console.log(`Got modelingFramework param: ${params.modelingFramework}`);
    console.log(`Got simtype and alg param: ${params.simulationType}, ${params.simulationAlgorithm}`);
    console.log(`Got num steps from param: ${params.numSteps}`);
    console.log(`Got model file from param: ${params.modelFile}`);
    console.log(`Got url from param: ${params.projectUrl}`);
    console.log(`Got file from param: ${params.metadataFile.id}`);
    console.log(`Got sed file from param ${params.sedFile.id}`);

    this.isReRun = true;
    this.reRunModelFile = params.modelFile;
    this.reRunModelId = params.modelId;
    this.projectUrl = params.projectUrl;
    this.reRunSimulator = params.simulator;
    this.reRunSimulatorVersion = params.simulatorVersion;
    this.reRunName = params.runName;
    this.reRunMetadataFile = params.metadataFileUrl;
    this.reRunSedFile = params.sedFileUrl;
    this.preloadUploadModelData(params.modelUrl, params.modelFormat);
    this.preloadSimMethodData(params.modelingFramework, params.simulationType, params.simulationAlgorithm);
    this.preloadTCParams(params.initialTime, params.startTime, params.endTime, params.numSteps);
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
    //uploadModelData.modelFile = this.reRunModelFile;
    console.log(`model file went into form! ${uploadModelData}`);
    this.formData[CreateProjectFormStep.UploadModel] = uploadModelData;
  }

  private preloadSimMethodData(framework: string, simulationType: string, algorithm: string): void {
    framework = framework?.toUpperCase();
    let match = framework?.match(/^(SBO[:_])?(\d{1,7})$/);
    if (match) {
      framework = 'SBO_' + '0'.repeat(7 - match[2].length) + match[2];
    }

    if (simulationType && !simulationType.startsWith('Sed')) {
      simulationType = 'Sed' + simulationType;
    }
    if (simulationType && !simulationType.endsWith('Simulation')) {
      simulationType = simulationType + 'Simulation';
    }
    SUPPORTED_SIMULATION_TYPES.forEach((simType: SimulationType): void => {
      if (simulationType && simulationType.toLowerCase() == simType.toLowerCase()) {
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

  private preloadTCParams(initialTime: string, startTime: string, endTime: string, numSteps: string): void {
    const timeCourseData = this.formData[CreateProjectFormStep.UniformTimeCourseSimulationParameters] || {};
    timeCourseData.initialTime = initialTime;
    timeCourseData.outputStartTime = startTime;
    timeCourseData.outputEndTime = endTime;
    timeCourseData.numberOfSteps = numSteps;
    this.formData[CreateProjectFormStep.UniformTimeCourseSimulationParameters] = timeCourseData;
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
    const compatibleFormats = GatherCompatibleFormats(
      this.simulatorsData.simulatorSpecs,
      this.simulatorsData.modelFormats,
    );
    const hostedComponent = formContainerRef.createComponent(UploadModelComponent);
    hostedComponent.instance.modelFormats = compatibleFormats;
    return hostedComponent.instance;
  }

  private createSimulatorTypeForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const uploadModelFormData = this.formData[CreateProjectFormStep.UploadModel];
    const modelFormat = uploadModelFormData?.modelFormat as string;
    const hostedComponent = formContainerRef.createComponent(SimulatorTypeComponent);
    hostedComponent.instance.setup(this.simulatorsData, modelFormat);
    return hostedComponent.instance;
  }

  private createUniformTimeCourseForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(UniformTimeCourseSimulationComponent);
    const introspectedTimeCourseData = this.introspectedData?.uniformTimeCourseSimulation;
    if (introspectedTimeCourseData) {
      hostedComponent.instance.loadIntrospectedTimeCourseData(introspectedTimeCourseData);
    }
    hostedComponent.instance.isReRun = this.isReRun;
    return hostedComponent.instance;
  }

  private createNamespaceForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(NamespacesComponent);
    const introspectedNamespaces = this.introspectedData?.namespaces;
    if (introspectedNamespaces) {
      hostedComponent.instance.loadIntrospectedNamespaces(introspectedNamespaces);
    }
    return hostedComponent.instance;
  }

  private createModelChangesForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(ModelChangesComponent);
    const introspectedChanges = this.introspectedData?.modelChanges;
    if (introspectedChanges) {
      hostedComponent.instance.loadIntrospectedModelChanges(introspectedChanges);
    }
    return hostedComponent.instance;
  }

  private createObservablesForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const hostedComponent = formContainerRef.createComponent(ModelVariablesComponent);
    const introspectedVariables = this.introspectedData?.modelVariables;
    if (introspectedVariables) {
      hostedComponent.instance.loadIntrospectedVariables(introspectedVariables);
    }
    return hostedComponent.instance;
  }

  private createAlgorithmParametersForm(formContainerRef: ViewContainerRef): IFormStepComponent {
    const simMethodData = this.formData[CreateProjectFormStep.FrameworkSimTypeAndAlgorithm];
    const uploadModelData = this.formData[CreateProjectFormStep.UploadModel];
    const hostedComponent = formContainerRef.createComponent(AlgorithmParametersComponent);
    const component = hostedComponent.instance;
    component.setup(
      uploadModelData?.modelFormat as string,
      simMethodData?.framework as string,
      simMethodData?.algorithm as string,
      simMethodData?.parameters as Record<string, MultipleSimulatorsAlgorithmParameter>,
      this.simulatorsData.simulatorSpecs,
      this.algSubstitutions,
    );
    return component;
  }
}

////
