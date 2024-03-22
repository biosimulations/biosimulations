import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ValidationErrors,
  FormArray,
} from '@angular/forms';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { CombineApiService } from '../../../services/combine-api/combine-api.service';
import {
  SimulatorSpecsMap,
  SimulatorSpecs,
  SimulatorsData,
  OntologyTermsMap,
  OntologyTerm,
  SimulationProjectUtilLoaderService,
  SimulationProjectUtilData,
} from '@biosimulations/simulation-project-utils';
import { Simulation } from '../../../datamodel';
import {
  CombineArchiveSedDocSpecs,
  CombineArchiveSedDocSpecsContent,
  SedDocument,
  SedModel,
  SedSimulation,
  SedModelChange,
  Purpose,
  AlgorithmSubstitutionPolicyLevels,
  ALGORITHM_SUBSTITUTION_POLICIES,
  AlgorithmSubstitution,
  AlgorithmSubstitutionPolicy,
  AlgorithmSummary,
} from '@biosimulations/datamodel/common';
import { SimulationRunStatus, EnvironmentVariable, SimulationRun } from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { Observable, Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/config/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileInput } from '@biosimulations/material-file-input';
import {
  CreateMaxFileSizeValidator,
  INTEGER_VALIDATOR,
  SEDML_ID_VALIDATOR,
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
} from '@biosimulations/shared/ui';
import { SedModelAttributeChangeTypeEnum } from '@biosimulations/combine-api-angular-client';

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

interface EditParametersForm {
  [param: string]: string;
}

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit, OnDestroy {
  public formGroup: UntypedFormGroup;

  // Form control option lists
  public modelFormats: OntologyTerm[] = [];
  public simulators: SimulatorIdNameDisabled[] = [];
  public simulatorVersions: string[] = [];
  public simulationAlgorithms: Algorithm[] = [];
  public algorithmSubstitutionPolicies: AlgorithmSubstitutionPolicy[];
  // public parametersForm: UntypedFormGroup;

  // Data loaded from configs
  public exampleCombineArchivesUrl: string;
  public emailUrl!: string;
  public fileUploaded!: boolean;
  public parametersFormData!: EditParametersForm;

  // Lifecycle state
  public submitPushed = false;
  private subscriptions: Subscription[] = [];

  // Data loaded from network
  private modelFormatsMap?: OntologyTermsMap;
  private simulationAlgorithmsMap?: Record<string, Algorithm>;
  private simulatorSpecsMap?: SimulatorSpecsMap;
  public formArray!: FormArray;

  public constructor(
    private config: ConfigService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private dispatchService: DispatchService,
    private simulationService: SimulationService,
    private combineApiService: CombineApiService,
    private snackBar: MatSnackBar,
    private loader: SimulationProjectUtilLoaderService,
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
        parametersForm: this.formBuilder.group({}),
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
  }

  // Life cycle

  public ngOnInit(): void {
    this.fileUploaded = false;
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
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private loadComplete(data: SimulationProjectUtilData): void {
    // Preload util service
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
  }

  // Form Submission
  public onArchiveUpload() {
    console.log(`Archive uploaded.`);
  }
  public onParameterChangeSubmit() {
    // Log the form data to the console
    console.log('Form submitted:', this.parametersFormData);
    // You can also send the form data to a service or API here
  }

  public onFormSubmit(): void {
    this.submitPushed = true;

    if (!this.formGroup.valid) {
      return;
    }

    const simulator: string = this.formGroup.value.simulator;
    const simulatorVersion: string = this.formGroup.value.simulatorVersion;
    const cpus: number = this.formGroup.value.cpus;
    const memory: number = this.formGroup.value.memory; // in GB
    const maxTime: number = this.formGroup.value.maxTime; // in min
    const envVars: EnvironmentVariable[] = [];
    const purpose: Purpose = this.formGroup.value.academicPurpose ? Purpose.academic : Purpose.other;
    const name: string = this.formGroup.value.name;
    const email: string | null = this.formGroup.value.email || null;

    let simulationResponse: Observable<SimulationRun>;

    const projectUrl: string = this.formGroup.value.projectUrl;
    if (projectUrl) {
      simulationResponse = this.dispatchService.sumbitJobForURL(
        projectUrl,
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
    } else {
      const fileInput: FileInput = this.formGroup.value.projectFile;
      const projectFile: File = fileInput.files[0];
      simulationResponse = this.dispatchService.submitJobForFile(
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
    }

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

        // All simulators returned for the main algorithm can be used with the main algorithm when the
        // policy is at least SAME_METHOD (always).
        simulationAlgorithmsMap[mainAlg.id].simulatorPolicies[simulatorId] = {
          minPolicy: {
            id: 'SAME_METHOD',
            name: 'Same method',
            level: AlgorithmSubstitutionPolicyLevels.SAME_METHOD,
            _type: substitutionPolicy._type,
          },
          simulator: simulator,
        };

        // All simulators returned for the main algorithm can be used with the alt algorithm when the
        // policy is at least as lenient as the policy for which the alt algorithm can switch with the main
        // algorithm.
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
        minPolicy: ALGORITHM_SUBSTITUTION_POLICIES[AlgorithmSubstitutionPolicyLevels.SAME_METHOD],
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
    console.log(`SPECS: ${this.archiveSedDocSpecsLoaded.bind(this)}`);
    this.fileUploaded = true;
    console.log(`FILE LOADED: ${this.fileUploaded}`);
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
  public loadIntrospectedModelChanges(introspectedModelChanges: SedModelChange[]): void {
    if (introspectedModelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    introspectedModelChanges.forEach((change: SedModelChange) => {
      this.addFieldForModelChange(change);
    });
  }

  private updateParametersForm(): void {
    // clear existing controls
    /*Object.keys(this.parametersForm.controls).forEach((key) => {
      this.parametersForm.removeControl(key);
    });*/
    this.formArray = this.formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
    });
    const defaultRowCount = 3;
    for (let i = 0; i < defaultRowCount; i++) {
      this.addModelChangeField();
    }

    // add n controls where n is the number of editable params
    Object.keys(this.parametersFormData).forEach((key) => {
      this.parametersForm.addControl(key, this.formBuilder.control(this.parametersFormData[key]));
    });
  }

  public archiveSedDocSpecsLoaded(sedDocSpecs?: CombineArchiveSedDocSpecs): void {
    const simulationAlgorithmsMap = this.simulationAlgorithmsMap;
    if (!sedDocSpecs || !simulationAlgorithmsMap) {
      return;
    }

    const modelFormats = new Set<string>();
    const simulationAlgorithms = new Set<string>();
    let specsContainUnsupportedModel = false;
    let specsContainUnsupportedAlgorithm = false;

    // Confirm that every model and algorithm within the sed doc spec is supported.
    sedDocSpecs.contents.forEach((content: CombineArchiveSedDocSpecsContent, contentIndex: number): void => {
      const sedDoc: SedDocument = content.location.value;
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
        // apply available model changes as values for pre-populating model changes card form.
        // TODO: expand/expose more overall changes.
        model.changes.forEach((change: SedModelChange, changeIndex: number): void => {
          console.log(`THE CURRENT CHANGE: ${change._type}`);
          // this.parametersFormData = {}; // reset the form to assert fresh render. TODO: find alternatives to this
          let key = null;
          if (change.name) {
            key = change.name;
          } else {
            key = `model${contentIndex}_change${modelIndex}_${changeIndex}`;
          }
          if ('newValue' in change) {
            // const key = `model${contentIndex}_change${modelIndex}_${changeIndex}`;
            this.parametersFormData[key] = change.newValue;
            console.log(`the name: ${change.target.value}`);
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

    // update parameters form. TODO: use above penultimate methods as template to replace this.
    this.updateParametersForm();
    console.log(`SED DOCS LOADED`);
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

  public shouldShowNoProjectError(): boolean {
    return this.formGroup.hasError('noProject') && this.submitPushed;
  }

  public shouldShowUnsupportedModelError(): boolean {
    const hasUnsupportedModel = this.formGroup.hasError('unsupportedFormats', 'modelFormats');
    return (this.submitPushed || this.formGroup.controls.modelFormats.touched) && hasUnsupportedModel;
  }

  public shouldShowUnsupportedAlgorithmError(): boolean {
    const hasUnsupportedAlgorithm = this.formGroup.hasError('unsupportedAlgorithms', 'simulationAlgorithms');
    return (this.submitPushed || this.formGroup.controls.simulationAlgorithms.touched) && hasUnsupportedAlgorithm;
  }

  public shouldShowSimulatorRequiredError(): boolean {
    return this.submitPushed && this.formGroup.hasError('required', 'simulator');
  }

  public shouldShowSimulatorVersionRequiredError(): boolean {
    return this.submitPushed && this.formGroup.hasError('required', 'simulatorVersion');
  }

  public shouldShowNameRequiredError(): boolean {
    return this.submitPushed && this.formGroup.hasError('required', 'name');
  }

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

  public get parametersForm(): UntypedFormGroup {
    return this.formGroup.get('parametersForm') as UntypedFormGroup;
  }

  public getParameterFormKeys(): string[] {
    return Object.keys(this.parametersForm.controls);
  }

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
  }

  private setProject(projectUrl: string): void {
    if (!projectUrl) {
      return;
    }
    this.formGroup.controls.projectUrl.setValue(projectUrl);
    this.projectControlUpdated();
    console.log(`The project is set!`);
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

    const email = formGroup.controls.email as UntypedFormControl;
    const emailConsent = formGroup.controls.emailConsent as UntypedFormControl;
    if (email.value && !email.hasError('email') && !emailConsent.value) {
      errors['emailNotConsented'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }
}
