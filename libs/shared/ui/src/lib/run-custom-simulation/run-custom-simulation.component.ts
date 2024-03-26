import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SedSimulation, SimulationType } from '@biosimulations/datamodel/common';
import {
  CombineArchiveSedDocSpecsContent,
  CombineArchiveSedDocSpecs,
  SedDocument,
} from '@biosimulations/combine-api-angular-client';
import { SedModelChange, SedModelAttributeChangeTypeEnum } from '@biosimulations/combine-api-angular-client';
import { ActivatedRoute } from '@angular/router';
import {
  SharedSimulationService,
  CustomizableSedDocumentData,
  CustomSimulationDatasource,
  FormStepData,
  ReRunQueryParams,
  SEDML_ID_VALIDATOR,
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
  SimMethodData,
  ModelData,
} from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-run-custom-simulation',
  templateUrl: './run-custom-simulation.component.html',
  styleUrls: ['./run-custom-simulation.component.scss'],
})
export class RunCustomSimulationComponent implements OnInit, OnChanges {
  // data loaded from rerun query params
  public reRunParams!: ReRunQueryParams;
  public simMethodData!: SimMethodData;
  public modelData!: ModelData;
  public simulationDataSource!: CustomSimulationDatasource;
  public formArray: UntypedFormArray;
  public sedDoc!: SedDocument;
  public simType!: SimulationType;

  // network data
  public reRunSedData$!: Observable<CombineArchiveSedDocSpecs | undefined>;
  public introspectionData$?: Observable<CustomizableSedDocumentData | any>;

  // lifecycle
  public nextClicked = false;
  public subscriptions: Subscription[] = [];

  // input received from dispatch
  @Input() public archive?: File;

  public constructor(
    private formBuilder: UntypedFormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private simulationService: SharedSimulationService,
  ) {
    this.formArray = this.formBuilder.array([], {
      validators: [UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR('id')],
    });
  }

  public ngOnInit() {
    this.addDefaultFields();

    /* 1. Set the datasource(CustomSimulationDataSource) by deriving vals from reRun Query params.
      These are expected by Dispatch. overview -> changes -> dispatch(with changes)*/
    this.route.queryParams.subscribe((params) => {
      this.reRunParams = {
        projectUrl: params?.projectUrl,
        simulator: params?.simulator,
        simulatorVersion: params?.simulatorVersion,
        files: params?.files,
      };
    });

    /* 2. Introspect datasource */
    if (this.archive) {
      // 1. Set the simMethod data and modelData from simService.getspecsofseddocs
      const reRunSedData$ = this.simulationService.getSpecsOfSedDocsInCombineArchive(this.archive);
      reRunSedData$.subscribe((sedDocSpecs: CombineArchiveSedDocSpecs | undefined) => {
        this.archiveSedDocSpecsLoaded(sedDocSpecs);
      });
      const sub = this.reRunSedData$.subscribe(this.archiveSedDocSpecsLoaded.bind(this));
      this.subscriptions.push(sub);
    }

    // first, instantiate datasource with rerun params as they are coming from service
    this.simulationDataSource = {
      reRunParams: this.reRunParams,
    };
    console.log(`THE url val from rerunQuery: ${this.reRunParams.projectUrl}`);

    this.introspectionData$ = this.introspectionProvider();

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

  private introspectionProvider(): Observable<void | null> | null {
    const errorHandler = this.showIntrospectionFailedSnackbar.bind(this);
    const formatData = this.simulationDataSource?.modelData;
    const simMethodData = this.simulationDataSource?.simMethodData;
    const introspectionObservable = this.simulationService.introspectNewProject(
      this.httpClient,
      formatData,
      simMethodData,
      errorHandler,
    );
    if (!introspectionObservable) {
      return null;
    }
    return introspectionObservable.pipe(
      map((introspectionData: CustomizableSedDocumentData | null) => {
        if (introspectionData) {
          this.simulationDataSource.introspectedData = introspectionData;
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
    const simulationAlgorithms = new Set<string>();
    const simulations = new Set<SedSimulation>();
    const modelFormats = new Set<string>();

    //  get the sed doc
    sedDocSpecs?.contents.forEach((content: CombineArchiveSedDocSpecsContent, contentIndex: number): void => {
      const sedDoc: SedDocument = content.location.value;
      this.sedDoc = sedDoc;
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
        }
      });
    });

    // get the simType
    this.sedDoc.simulations.forEach((sim: SedSimulation): void => {
      const kisaoId = sim.algorithm.kisaoId;
      simulationAlgorithms.add(kisaoId);
      simulations.add(sim);
      this.simType = sim._type as SimulationType;
    });

    const customizeableData = this.simulationService.createCustomizableSedDocumentData(this.sedDoc, this.simType);
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
