import { ViewContainerRef } from '@angular/core';
import { Params } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  AlgorithmSubstitution,
  AlgorithmSubstitutionPolicy,
  AlgorithmSubstitutionPolicyLevels,
  ALGORITHM_SUBSTITUTION_POLICIES,
  CombineArchiveSedDocSpecs,
  CombineArchiveSedDocSpecsContent,
  SedDocument,
  SedModel,
  SedSimulation,
} from '@biosimulations/datamodel/common';
import {
  IMultiStepFormDataSource,
  IMultiStepFormDataTask,
  FormStepData,
  IFormStepComponent,
  IMultiStepFormButton,
} from '@biosimulations/shared/ui';
import {
  SimulationProjectUtilData,
  SimulatorsData,
  OntologyTerm,
  SimulatorSpecs,
} from '@biosimulations/simulation-project-utils/service';
import { ConfigService } from '@biosimulations/config/angular';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { CombineApiService } from '../../../services/combine-api/combine-api.service';
import { SedUniformTimeCourseSimulationTypeEnum } from '@biosimulations/combine-api-angular-client';
import {
  DispatchFormOption,
  UploadProjectComponent,
  ProjectCapabilitiesComponent,
  SimulationToolComponent,
  CommercialSolversComponent,
  ComputationalResourcesComponent,
  MetadataComponent,
  NotificationsComponent,
  PreselectedOptionsComponent,
} from '../form-steps';

export enum DispatchFormStep {
  PreselectedOptions = 'PreselectedOptions',
  UploadProject = 'UploadProject',
  ProjectCapabilities = 'ProjectCapabilities',
  SimulationTool = 'SimulationTool',
  CommercialSolvers = 'CommercialSolvers',
  ComputationalResources = 'ComputationalResources',
  Metadata = 'Metadata',
  Notifications = 'Notifications',
}

// Stores a set of model formats and algorithms that a simulation tool supports.
interface SimulationToolSupportData {
  modelFormats: Set<string>;
  algorithms: Record<AlgorithmSubstitutionPolicyLevels, Set<string>>;
}

export class DispatchDataSource implements IMultiStepFormDataSource<DispatchFormStep> {
  public formData: Record<DispatchFormStep, FormStepData> = <Record<DispatchFormStep, FormStepData>>{};
  public eligibleToModifyArchive = false;

  private simulatorSpecs: Record<string, SimulatorSpecs>;
  private exampleCombineArchivesUrl: string;
  private modelFormatOptions: DispatchFormOption[];
  private algorithmOptions: DispatchFormOption[];
  private substitutionPolicyOptions: DispatchFormOption[];
  private simulatorOptions: DispatchFormOption[];
  private simulationToolsSupportData: Record<string, SimulationToolSupportData>;
  private preselectedProjectUrl?: string;
  private loadedArchiveContainsUnsupportedModel = false;
  private loadedArchiveContainsUnsupportedAlgorithm = false;
  private preselectedValidArchive = false;
  private preselectedValidSimulator = false;

  public constructor(
    data: SimulationProjectUtilData,
    config: ConfigService,
    private combineApiService: CombineApiService,
    private onSubmitHandler: () => void,
    private sedDocSpecs?: CombineArchiveSedDocSpecs,
    private projectUrl?: string,
  ) {
    const algorithmSubstitutions: AlgorithmSubstitution[] = data.algorithmSubstitutions;
    const simulatorsData: SimulatorsData = data.simulators;
    const params: Params = data.params;

    this.simulatorSpecs = simulatorsData.simulatorSpecs;
    this.modelFormatOptions = this.getModelFormatOptions(simulatorsData);
    this.algorithmOptions = this.getAlgorithmOptions(simulatorsData, algorithmSubstitutions);
    this.simulatorOptions = this.getSimulationToolOptions(simulatorsData);
    this.substitutionPolicyOptions = this.getSubstitionPolicyOptions(algorithmSubstitutions.length > 0);
    this.simulationToolsSupportData = this.getSimulationToolsSupportData(
      simulatorsData,
      algorithmSubstitutions,
      this.simulatorOptions,
    );

    const exampleCombineArchivesUrlTokens = [
      'https://github.com',
      config.appConfig.exampleCombineArchives.repoOwnerName,
      'tree',
      config.appConfig.exampleCombineArchives.repoRef,
      config.appConfig.exampleCombineArchives.repoPath,
    ];
    this.exampleCombineArchivesUrl = exampleCombineArchivesUrlTokens.join('/');

    if (sedDocSpecs) {
      this.preselectedProjectUrl = projectUrl;
      this.archiveSedDocSpecsLoaded(sedDocSpecs);
      const modelsSupported = !this.loadedArchiveContainsUnsupportedModel;
      const algorithmsSupported = !this.loadedArchiveContainsUnsupportedAlgorithm;
      this.preselectedValidArchive = modelsSupported && algorithmsSupported;
      this.eligibleToModifyArchive = this.preselectedValidArchive && this.isArchiveModificationEligible(sedDocSpecs);
    }

    this.preloadDataForParams(params, simulatorsData);
  }

  // IMultiStepFormDataSource implementation

  public submitButtonForForm(): IMultiStepFormButton {
    return {
      label: 'Run',
      onClick: this.onSubmitHandler,
    };
  }

  public getDataForStep(stepId: DispatchFormStep): FormStepData {
    return this.formData[stepId];
  }

  public setDataForStep(stepId: DispatchFormStep, data: FormStepData | null): void {
    if (stepId == DispatchFormStep.UploadProject) {
      this.loadedArchiveContainsUnsupportedAlgorithm = false;
      this.loadedArchiveContainsUnsupportedModel = false;
    }
    if (!data) {
      delete this.formData[stepId];
      return;
    }
    this.formData[stepId] = data;
  }

  public formStepIds(): DispatchFormStep[] {
    const steps = [];

    const skipUploadProject = this.preselectedValidArchive;
    const skipSimulationTool = skipUploadProject && this.preselectedValidSimulator;

    if (skipUploadProject) {
      steps.push(DispatchFormStep.PreselectedOptions);
    } else {
      steps.push(DispatchFormStep.UploadProject);
    }

    if (!skipSimulationTool) {
      steps.push(DispatchFormStep.ProjectCapabilities);
      steps.push(DispatchFormStep.SimulationTool);
    }

    return steps.concat([
      DispatchFormStep.CommercialSolvers,
      DispatchFormStep.ComputationalResources,
      DispatchFormStep.Metadata,
      DispatchFormStep.Notifications,
    ]);
  }

  public shouldShowFormStep(_stepId: DispatchFormStep): boolean {
    return true;
  }

  public createFormStepComponent(stepId: DispatchFormStep, hostView: ViewContainerRef): IFormStepComponent {
    switch (stepId) {
      case DispatchFormStep.PreselectedOptions:
        return hostView.createComponent(PreselectedOptionsComponent).instance;
      case DispatchFormStep.UploadProject:
        return hostView.createComponent(UploadProjectComponent).instance;
      case DispatchFormStep.ProjectCapabilities:
        return hostView.createComponent(ProjectCapabilitiesComponent).instance;
      case DispatchFormStep.SimulationTool:
        return hostView.createComponent(SimulationToolComponent).instance;
      case DispatchFormStep.CommercialSolvers:
        return hostView.createComponent(CommercialSolversComponent).instance;
      case DispatchFormStep.ComputationalResources:
        return hostView.createComponent(ComputationalResourcesComponent).instance;
      case DispatchFormStep.Metadata:
        return hostView.createComponent(MetadataComponent).instance;
      case DispatchFormStep.Notifications:
        return hostView.createComponent(NotificationsComponent).instance;
    }
  }

  public configureFormStepComponent(stepId: DispatchFormStep, stepComponent: IFormStepComponent): void {
    switch (stepId) {
      case DispatchFormStep.PreselectedOptions:
        this.configurePreselectedOptionsForm(stepComponent as PreselectedOptionsComponent);
        break;
      case DispatchFormStep.UploadProject:
        this.configureUploadProjectForm(stepComponent as UploadProjectComponent);
        break;
      case DispatchFormStep.ProjectCapabilities:
        this.configureProjectCapabilitiesForm(stepComponent as ProjectCapabilitiesComponent);
        break;
      case DispatchFormStep.SimulationTool:
        this.configureSimulationToolForm(stepComponent as SimulationToolComponent);
        break;
      case DispatchFormStep.ComputationalResources:
        this.configureComputationalResources(stepComponent as ComputationalResourcesComponent);
        break;
      case DispatchFormStep.Metadata:
        this.configureMetadata(stepComponent as MetadataComponent);
        break;
    }
  }

  public startDataTask(stepId: DispatchFormStep): IMultiStepFormDataTask | null {
    switch (stepId) {
      case DispatchFormStep.UploadProject:
        return this.createUploadProjectTask();
      default:
        return null;
    }
  }

  // Configure form step components.

  private configurePreselectedOptionsForm(formComponent: PreselectedOptionsComponent): void {
    const simulationToolData = this.formData[DispatchFormStep.SimulationTool];
    formComponent.setup(this.eligibleToModifyArchive, this.preselectedProjectUrl, simulationToolData);
  }

  private configureUploadProjectForm(formComponent: UploadProjectComponent): void {
    formComponent.setup(this.exampleCombineArchivesUrl);
    const data = this.formData[DispatchFormStep.UploadProject];
    if (data) {
      formComponent.populateFormFromFormStepData(data);
    }
  }

  private configureProjectCapabilitiesForm(formComponent: ProjectCapabilitiesComponent): void {
    this.updateSimulationToolOptions();
    this.updateModelFormatOptions();
    this.updateAlgorithmOptions();
    formComponent.setup(
      this.modelFormatOptions,
      this.algorithmOptions,
      this.substitutionPolicyOptions,
      this.loadedArchiveContainsUnsupportedModel,
      this.loadedArchiveContainsUnsupportedAlgorithm,
    );
    const data = this.formData[DispatchFormStep.ProjectCapabilities];
    if (data) {
      formComponent.populateFormFromFormStepData(data);
    }
  }

  private configureSimulationToolForm(formComponent: SimulationToolComponent): void {
    this.updateSimulationToolOptions();
    const selectedSimulationTool = this.getSelectedSimulatorTool(formComponent);
    formComponent.setup(
      this.exampleCombineArchivesUrl,
      this.simulatorOptions,
      this.getSimulationToolVersionOptions(selectedSimulationTool),
    );
    const data = this.formData[DispatchFormStep.SimulationTool];
    if (data) {
      formComponent.populateFormFromFormStepData(data);
    }
  }

  private configureComputationalResources(formComponent: ComputationalResourcesComponent): void {
    const data = this.formData[DispatchFormStep.ComputationalResources];
    if (data) {
      formComponent.populateFormFromFormStepData(data);
    }
  }

  private configureMetadata(formComponent: MetadataComponent): void {
    const data = this.formData[DispatchFormStep.Metadata];
    if (data) {
      formComponent.populateFormFromFormStepData(data);
    }
  }

  private getSelectedSimulatorTool(formComponent: SimulationToolComponent): string | null {
    const selectedSimulationTool = formComponent.formGroup.controls.simulator.value;
    if (selectedSimulationTool) {
      return selectedSimulationTool;
    }
    const data = this.formData[DispatchFormStep.SimulationTool];
    if (data?.simulator) {
      return data.simulator as string;
    }
    const enabledSimulatorOptions = this.simulatorOptions.filter((option: DispatchFormOption) => {
      return !option.disabled;
    });
    if (enabledSimulatorOptions.length === 1) {
      return enabledSimulatorOptions[0].id;
    }
    return null;
  }

  // Create form step tasks.

  private createUploadProjectTask(): IMultiStepFormDataTask | null {
    const uploadData = this.formData[DispatchFormStep.UploadProject];
    const urlValue = uploadData.projectUrl as string;
    const fileValue = uploadData.projectFile as File;
    const archive = urlValue ? urlValue : fileValue;
    if (!archive) {
      return null;
    }
    const specsObservable = this.combineApiService.getSpecsOfSedDocsInCombineArchive(archive);
    const completionObservable = specsObservable.pipe(
      map((sedDocSpecs?: CombineArchiveSedDocSpecs) => {
        this.archiveSedDocSpecsLoaded(sedDocSpecs);
      }),
    );
    return {
      spinnerLabel: '',
      completionObservable: completionObservable,
    };
  }

  // Update options

  private updateSimulationToolOptions(): void {
    const capabilitiesData = this.formData[DispatchFormStep.ProjectCapabilities];
    const selectedModelFormatIds = capabilitiesData?.modelFormats as string[];
    const selectedAlgorithms = capabilitiesData?.simulationAlgorithms as string[];
    const selectedSubstitutionPolicy = capabilitiesData?.substitutionPolicy as string;

    for (const toolOption of this.simulatorOptions) {
      toolOption.disabled = false;

      const supportData = this.simulationToolsSupportData[toolOption.id];

      // Disable simulation tools that don't support all selected model formats.
      if (selectedModelFormatIds) {
        for (const modelFormatId of selectedModelFormatIds) {
          if (!supportData.modelFormats.has(modelFormatId)) {
            toolOption.disabled = true;
            break;
          }
        }
      }

      // Disable simulation tools that don't support all selected algorithms, or any substitutable algorithms.
      const maxPolicy = ALGORITHM_SUBSTITUTION_POLICIES.find((policy: AlgorithmSubstitutionPolicy) => {
        return policy.id === selectedSubstitutionPolicy;
      });
      if (!maxPolicy || !selectedAlgorithms) {
        continue;
      }
      const maxPolicyLevel = maxPolicy.level;
      for (const simulationAlgorithmId of selectedAlgorithms) {
        if (!this.doesToolSupportAlgorithm(supportData, simulationAlgorithmId, maxPolicyLevel)) {
          toolOption.disabled = true;
          break;
        }
      }
    }
  }

  private updateModelFormatOptions(): void {
    for (const formatOption of this.modelFormatOptions) {
      formatOption.disabled = true;
      for (const toolOption of this.simulatorOptions) {
        if (toolOption.disabled) {
          continue;
        }
        const supportData = this.simulationToolsSupportData[toolOption.id];
        if (supportData.modelFormats.has(formatOption.id)) {
          formatOption.disabled = false;
          break;
        }
      }
    }
  }

  private updateAlgorithmOptions(): void {
    const capabilitiesData = this.formData[DispatchFormStep.ProjectCapabilities];
    const selectedSubstitutionPolicy = capabilitiesData?.substitutionPolicy as string;
    const maxPolicy = ALGORITHM_SUBSTITUTION_POLICIES.find((policy: AlgorithmSubstitutionPolicy) => {
      return policy.id === selectedSubstitutionPolicy;
    });
    for (const algorithmOption of this.algorithmOptions) {
      algorithmOption.disabled = maxPolicy !== undefined;
      for (const toolOption of this.simulatorOptions) {
        if (toolOption.disabled || !maxPolicy) {
          continue;
        }
        const supportData = this.simulationToolsSupportData[toolOption.id];
        if (this.doesToolSupportAlgorithm(supportData, algorithmOption.id, maxPolicy.level)) {
          algorithmOption.disabled = false;
        }
      }
    }
  }

  private doesToolSupportAlgorithm(
    supportData: SimulationToolSupportData,
    algorithmId: string,
    maxLevel: AlgorithmSubstitutionPolicyLevels,
  ): boolean {
    const minPolicyLevel = AlgorithmSubstitutionPolicyLevels.SAME_METHOD;
    for (let policyLevel = minPolicyLevel; policyLevel <= maxLevel; policyLevel++) {
      const supportedAlgorithms = supportData.algorithms[policyLevel];
      if (supportedAlgorithms?.has(algorithmId)) {
        return true;
      }
    }
    return false;
  }

  // Generate form step options.

  private getSimulationToolOptions(simulatorsData: SimulatorsData): DispatchFormOption[] {
    const simulatorSpecs = Object.values(simulatorsData.simulatorSpecs);
    simulatorSpecs.sort((a: SimulatorSpecs, b: SimulatorSpecs): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    return simulatorSpecs.map((specs: SimulatorSpecs): DispatchFormOption => {
      return {
        id: specs.id,
        name: specs.name,
        disabled: false,
      };
    });
  }

  private getSimulationToolVersionOptions(simulator: string | null): DispatchFormOption[] {
    if (!simulator) {
      return [];
    }
    const versions = this.simulatorSpecs[simulator].versions;
    return versions.map((version: string) => {
      return {
        id: version,
        name: version,
        disabled: false,
      };
    });
  }

  private getModelFormatOptions(simulatorsData: SimulatorsData): DispatchFormOption[] {
    const modelFormats = Object.values(simulatorsData.modelFormats);
    modelFormats.sort((a: OntologyTerm, b: OntologyTerm): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    return modelFormats.map((value: OntologyTerm): DispatchFormOption => {
      return {
        name: value.name,
        id: value.id,
        disabled: false,
      };
    });
  }

  private getAlgorithmOptions(
    simulatorsData: SimulatorsData,
    substitutions: AlgorithmSubstitution[],
  ): DispatchFormOption[] {
    const algorithmMap: Record<string, string> = {};
    const simulationAlgorithms = Object.values(simulatorsData.simulationAlgorithms);
    for (const algorithm of simulationAlgorithms) {
      algorithmMap[algorithm.id] = algorithm.name;
    }
    for (const algorithmSubstitution of substitutions) {
      const mainAlgorithm = algorithmSubstitution.algorithms[0];
      const altAlgorithm = algorithmSubstitution.algorithms[1];
      algorithmMap[mainAlgorithm.id] = mainAlgorithm.name;
      algorithmMap[altAlgorithm.id] = altAlgorithm.name;
    }
    const algorithms: DispatchFormOption[] = [];
    for (const [algorithmId, algorithmName] of Object.entries(algorithmMap)) {
      algorithms.push({
        name: algorithmName,
        id: algorithmId,
        disabled: false,
      });
    }
    algorithms.sort((a: DispatchFormOption, b: DispatchFormOption): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    return algorithms;
  }

  private getSubstitionPolicyOptions(curatedSubstitutionsAvailable: boolean): DispatchFormOption[] {
    const algorithmSubstitutionPolicies = ALGORITHM_SUBSTITUTION_POLICIES.filter((policy) => {
      const minPolicy = AlgorithmSubstitutionPolicyLevels.SAME_METHOD;
      let maxPolicy = AlgorithmSubstitutionPolicyLevels.SAME_FRAMEWORK;
      if (!curatedSubstitutionsAvailable) {
        maxPolicy = AlgorithmSubstitutionPolicyLevels.SAME_METHOD;
      }
      return policy.level >= minPolicy && policy.level <= maxPolicy;
    });
    return algorithmSubstitutionPolicies.map((value: AlgorithmSubstitutionPolicy): DispatchFormOption => {
      return {
        name: value.name,
        id: value.id,
        disabled: false,
      };
    });
  }

  private getSimulationToolsSupportData(
    simulatorsData: SimulatorsData,
    algorithmSubstitutions: AlgorithmSubstitution[],
    simulationToolOptions: DispatchFormOption[],
  ): Record<string, SimulationToolSupportData> {
    const toolsSupportData = <Record<string, SimulationToolSupportData>>{};

    for (const simulationToolOption of simulationToolOptions) {
      toolsSupportData[simulationToolOption.id] = {
        modelFormats: new Set(),
        algorithms: <Record<AlgorithmSubstitutionPolicyLevels, Set<string>>>{},
      };
    }

    const modelFormats = simulatorsData.modelFormats;
    for (const [modelId, modelFormat] of Object.entries(modelFormats)) {
      const simulators = modelFormat.simulators;
      for (const simulatorId of simulators) {
        toolsSupportData[simulatorId].modelFormats.add(modelId);
      }
    }

    const addAlgorithm = (
      supportData: SimulationToolSupportData,
      algorithmId: string,
      level: AlgorithmSubstitutionPolicyLevels,
    ): void => {
      let sameMethodSet = supportData.algorithms[level];
      if (!sameMethodSet) {
        sameMethodSet = new Set();
      }
      sameMethodSet.add(algorithmId);
      supportData.algorithms[level] = sameMethodSet;
    };

    // For each algorithm, its simulators support it at the SAME_METHOD level.
    for (const [algorithmId, algorithm] of Object.entries(simulatorsData.simulationAlgorithms)) {
      const simulators = algorithm.simulators;
      for (const simulatorId of simulators) {
        const supportData = toolsSupportData[simulatorId];
        addAlgorithm(supportData, algorithmId, AlgorithmSubstitutionPolicyLevels.SAME_METHOD);
      }
    }

    // For each algorithm substitution, simulators that support the main algorithm will support the alt
    // algorithm at the level at which the algorithms can substitute.
    for (const substitution of algorithmSubstitutions) {
      const mainAlgSummary = substitution.algorithms[0];
      const altAlgSummary = substitution.algorithms[1];
      const mainAlgorithm = simulatorsData.simulationAlgorithms[mainAlgSummary.id];
      for (const simulatorId of mainAlgorithm.simulators) {
        const supportData = toolsSupportData[simulatorId];
        addAlgorithm(supportData, altAlgSummary.id, substitution.minPolicy.level);
      }
    }

    return toolsSupportData;
  }

  // Setters for preloading form data from route params

  private preloadDataForParams(params: Params, simulatorsData: SimulatorsData): void {
    if (!params) {
      return;
    }
    this.setProject(params.projectUrl);
    this.setSimulator(params.simulator, params.simulatorVersion, simulatorsData);
    this.setComputationalResources(params.cpus, params.memory, params.maxTime);
    this.setRunName(params.runName);
  }

  private setProject(projectUrl: string): void {
    if (!projectUrl) {
      return;
    }
    this.formData[DispatchFormStep.UploadProject] = {
      projectUrl: projectUrl,
    };
  }

  private setSimulator(simulator: string, simulatorVersion: string, simulatorsData: SimulatorsData): void {
    if (!simulator) {
      return;
    }
    const normalizedSimulator = simulator.toLowerCase();
    for (const [simulatorId, simulatorSpec] of Object.entries(simulatorsData.simulatorSpecs)) {
      if (simulatorId.toLowerCase() !== normalizedSimulator) {
        continue;
      }
      const data = <FormStepData>{ simulator: simulatorId };
      if (simulatorSpec.versions.includes(simulatorVersion)) {
        data.simulatorVersion = simulatorVersion;
        this.preselectedValidSimulator = true;
      }
      this.formData[DispatchFormStep.SimulationTool] = data;
      break;
    }
  }

  private setComputationalResources(cpuCount: string, memory: string, maxTime: string): void {
    const resourcesData = <FormStepData>{};
    const cpuCountNum = Math.ceil(parseFloat(cpuCount));
    if (!isNaN(cpuCountNum) && cpuCountNum >= 1) {
      resourcesData.cpus = cpuCountNum;
    }
    const memoryNum = parseFloat(memory);
    if (!isNaN(memoryNum) && memoryNum > 0) {
      resourcesData.memory = memoryNum;
    }
    const maxTimeNum = parseFloat(maxTime);
    if (!isNaN(maxTimeNum) && maxTimeNum > 0) {
      resourcesData.maxTime = maxTimeNum;
    }
    this.formData[DispatchFormStep.ComputationalResources] = resourcesData;
  }

  private setRunName(runName: string): void {
    this.formData[DispatchFormStep.Metadata] = {
      name: runName,
    };
  }

  // Network callbacks

  /**
   * Parses sed docs and preselects any included models and algorithms.
   */
  private archiveSedDocSpecsLoaded(sedDocSpecs?: CombineArchiveSedDocSpecs): void {
    if (!sedDocSpecs) {
      return;
    }

    const modelFormats = new Set<string>();
    const simulationAlgorithms = new Set<string>();
    let specsContainUnsupportedModel = false;
    let specsContainUnsupportedAlgorithm = false;

    const algorithmIsSupported = (algId: string): boolean => {
      const option = this.algorithmOptions.find((option: DispatchFormOption) => {
        return option.id === algId;
      });
      return option !== undefined;
    };

    sedDocSpecs.contents.forEach((content: CombineArchiveSedDocSpecsContent): void => {
      const sedDoc: SedDocument = content.location.value;
      sedDoc.models.forEach((model: SedModel): void => {
        let edamId: string | null = null;
        for (const modelingFormat of BIOSIMULATIONS_FORMATS) {
          const sedUrn = modelingFormat.biosimulationsMetadata?.modelFormatMetadata?.sedUrn;
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
      });
      sedDoc.simulations.forEach((sim: SedSimulation): void => {
        const algorithmId = sim.algorithm.kisaoId;
        if (algorithmIsSupported(algorithmId)) {
          simulationAlgorithms.add(algorithmId);
        } else {
          specsContainUnsupportedAlgorithm = true;
        }
      });
    });

    if (!specsContainUnsupportedAlgorithm && !specsContainUnsupportedModel) {
      const existingData = this.formData[DispatchFormStep.ProjectCapabilities];
      const existingPolicy = existingData?.substitutionPolicy;
      const defaultPolicy = this.substitutionPolicyOptions[this.substitutionPolicyOptions.length - 1].id;
      const newData = {
        modelFormats: Array.from(modelFormats),
        simulationAlgorithms: Array.from(simulationAlgorithms),
        substitutionPolicy: existingPolicy ? existingPolicy : defaultPolicy,
      };
      this.formData[DispatchFormStep.ProjectCapabilities] = newData;
    }

    this.loadedArchiveContainsUnsupportedAlgorithm = specsContainUnsupportedAlgorithm;
    this.loadedArchiveContainsUnsupportedModel = specsContainUnsupportedModel;
  }

  private isArchiveModificationEligible(sedDocSpecs?: CombineArchiveSedDocSpecs): boolean {
    if (!sedDocSpecs || sedDocSpecs.contents.length !== 1) {
      return false;
    }
    const sedDocSpec = sedDocSpecs.contents[0];
    const sedDoc: SedDocument = sedDocSpec.location.value;
    const singleModel = sedDoc.models.length === 1;
    const singleSimulation = sedDoc.simulations.length === 1;
    if (!singleModel || !singleSimulation) {
      return false;
    }
    const simulation = sedDoc.simulations[0];
    return simulation._type === SedUniformTimeCourseSimulationTypeEnum.SedUniformTimeCourseSimulation;
  }
}
