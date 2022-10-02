import { ViewContainerRef } from '@angular/core';
import {
  CombineArchiveSedDocSpecs,
  SedDocument,
  SedModel,
  SedModelChange,
  SedUniformTimeCourseSimulation,
} from '@biosimulations/datamodel/common';
import {
  IMultiStepFormDataSource,
  IMultiStepFormDataTask,
  FormStepData,
  IFormStepComponent,
  IMultiStepFormButton,
} from '@biosimulations/shared/ui';
import { GatherModelChanges } from '@biosimulations/simulation-project-utils/service';
import {
  UniformTimeCourseSimulationComponent,
  SimpleAlgorithmParametersComponent,
  ModelChangesComponent,
} from '@biosimulations/simulation-project-utils/ui';
import { SedModelAttributeChangeTypeEnum, Namespace } from '@biosimulations/combine-api-angular-client';

export enum ModifyRunFormStep {
  UniformTimeCourseSimulationParameters = 'UniformTimeCourseSimulationParameters',
  AlgorithmParameters = 'AlgorithmParameters',
  ModelChanges = 'ModelChanges',
}

export class ModifyRunDataSource implements IMultiStepFormDataSource<ModifyRunFormStep> {
  public formData: Record<ModifyRunFormStep, FormStepData> = <Record<ModifyRunFormStep, FormStepData>>{};
  public sedDoc: SedDocument;
  public simulation: SedUniformTimeCourseSimulation;
  public model: SedModel;
  public modelChanges: SedModelChange[];
  public namespaces: Namespace[];

  public constructor(
    public archive: CombineArchiveSedDocSpecs,
    private downloadHandler: () => void,
    private simulateHandler: () => void,
  ) {
    this.sedDoc = archive.contents[0].location.value;
    this.simulation = this.sedDoc.simulations[0] as SedUniformTimeCourseSimulation;
    this.model = this.sedDoc.models[0];
    const namespaces: Namespace[] = [];
    this.modelChanges = GatherModelChanges(this.sedDoc, namespaces) as SedModelChange[];
    this.namespaces = namespaces;
  }

  // MultiStepFormDataSource

  public getDataForStep(stepId: ModifyRunFormStep): FormStepData {
    return this.formData[stepId];
  }

  public setDataForStep(stepId: ModifyRunFormStep, data: FormStepData | null): void {
    if (!data) {
      delete this.formData[stepId];
      return;
    }
    this.formData[stepId] = data;
  }

  public formStepIds(): ModifyRunFormStep[] {
    return [
      ModifyRunFormStep.UniformTimeCourseSimulationParameters,
      ModifyRunFormStep.ModelChanges,
      ModifyRunFormStep.AlgorithmParameters,
    ];
  }

  public shouldShowFormStep(stepId: ModifyRunFormStep): boolean {
    switch (stepId) {
      case ModifyRunFormStep.ModelChanges:
        return this.shouldShowModelChangesStep();
      case ModifyRunFormStep.AlgorithmParameters:
        return this.shouldShowAlgorithmParametersStep();
      default:
        return true;
    }
  }

  public createFormStepComponent(stepId: ModifyRunFormStep, hostView: ViewContainerRef): IFormStepComponent {
    switch (stepId) {
      case ModifyRunFormStep.UniformTimeCourseSimulationParameters:
        return hostView.createComponent(UniformTimeCourseSimulationComponent).instance;
      case ModifyRunFormStep.AlgorithmParameters:
        return hostView.createComponent(SimpleAlgorithmParametersComponent).instance;
      case ModifyRunFormStep.ModelChanges:
        return hostView.createComponent(ModelChangesComponent).instance;
    }
  }

  public configureFormStepComponent(stepId: ModifyRunFormStep, stepComponent: IFormStepComponent): void {
    switch (stepId) {
      case ModifyRunFormStep.UniformTimeCourseSimulationParameters:
        this.configureUniformTimeCourseParameters(stepComponent as UniformTimeCourseSimulationComponent);
        return;
      case ModifyRunFormStep.AlgorithmParameters:
        this.configureAlgorithmParameters(stepComponent as SimpleAlgorithmParametersComponent);
        return;
      case ModifyRunFormStep.ModelChanges:
        this.configureModelChanges(stepComponent as ModelChangesComponent);
        return;
    }
  }

  public startDataTask(_stepId: ModifyRunFormStep): IMultiStepFormDataTask | null {
    return null;
  }

  public extraButtonsForFormStep(formStepId: ModifyRunFormStep): IMultiStepFormButton[] | null {
    let lastStep = ModifyRunFormStep.UniformTimeCourseSimulationParameters;
    if (this.shouldShowAlgorithmParametersStep()) {
      lastStep = ModifyRunFormStep.AlgorithmParameters;
    } else if (this.shouldShowModelChangesStep()) {
      lastStep = ModifyRunFormStep.ModelChanges;
    }
    if (formStepId === lastStep) {
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

  // Configure form step

  private configureUniformTimeCourseParameters(stepComponent: UniformTimeCourseSimulationComponent): void {
    stepComponent.loadIntrospectedTimeCourseData(this.simulation);
  }

  private configureAlgorithmParameters(stepComponent: SimpleAlgorithmParametersComponent): void {
    stepComponent.setup(this.simulation.algorithm.changes);
  }

  private configureModelChanges(stepComponent: ModelChangesComponent): void {
    stepComponent.loadIntrospectedModelChanges(this.modelChanges, false);
  }

  // Form step conditions

  private shouldShowAlgorithmParametersStep(): boolean {
    const algorithm = this.simulation.algorithm;
    return algorithm.changes.length > 0;
  }

  private shouldShowModelChangesStep(): boolean {
    let showStep = false;
    this.model.changes.forEach((change: SedModelChange) => {
      showStep = showStep || change._type === SedModelAttributeChangeTypeEnum.SedModelAttributeChange;
    });
    return showStep;
  }
}
