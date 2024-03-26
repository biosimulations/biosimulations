import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SedSimulation } from '@biosimulations/datamodel/common';
import {
  CombineArchiveSedDocSpecsContent,
  CombineArchiveSedDocSpecs,
  SedDocument,
  SedModel,
} from '@biosimulations/combine-api-angular-client';
import { SedModelChange, SedModelAttributeChangeTypeEnum } from '@biosimulations/combine-api-angular-client';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { Params, ActivatedRoute } from '@angular/router';
import {
  SharedSimulationService,
  CustomizableSedDocumentData,
  CustomSimulationDatasource,
  ReRunQueryParams,
  FormStepData,
  ModelData,
  SimMethodData,
  SEDML_ID_VALIDATOR,
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
} from '../shared-simulation-service';

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
    private simulationService: SharedSimulationService,
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
    const introspectionObservable = this.simulationService.introspectNewProject(
      this.httpClient,
      formatData,
      simMethodData,
      errorHandler,
    );

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
