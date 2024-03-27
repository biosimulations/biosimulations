import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SimulationType, CommonFile } from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import {
  CombineArchiveSedDocSpecs,
  CombineArchiveSedDocSpecsContent,
  SedDocument,
  SedModel,
  SedSimulation,
  SedModelAttributeChangeTypeEnum,
  SedModelChange,
} from '@biosimulations/combine-api-angular-client';
import { ActivatedRoute } from '@angular/router';
import {
  CustomizableSedDocumentData,
  CustomSimulationDatasource,
  FormStepData,
  ModelData,
  ReRunQueryParams,
  SEDML_ID_VALIDATOR,
  SharedSimulationService,
  SimMethodData,
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
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

  public kisaoId!: string;
  public simulationType!: string;

  // network data
  public reRunSedData$!: Observable<CombineArchiveSedDocSpecs | undefined>;
  public introspectionData$?: Observable<SedDocument | any>;
  public modelFileUrl!: string; // file to introspect!
  public modelFile!: CommonFile;

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
    this.route.queryParams.subscribe((params) => {
      this.reRunParams = {
        projectUrl: params?.projectUrl,
        simulator: params?.simulator,
        simulatorVersion: params?.simulatorVersion,
        files: params?.files,
      };

      const projectFiles = JSON.parse(params?.files);
      projectFiles.forEach((file: any) => {
        switch (file) {
          case file as CommonFile:
            console.log(`This is a CommonFile: ${file.url}`);
            if (file.url.includes('xml') || file.url.includes('sbml')) {
              this.modelFile = file;
              console.log(`URL: ${Object.keys(this.modelFile)}`);
            }
            break;
          case file as File:
            console.log(`Reg File: ${file.name}`);
        }
      });
    });

    //onsole.log(`The file: ${this.modelFile.name}`)

    console.log(`RERUN PARAMS RECIEVED FROM QUERY: ${this.reRunParams.projectUrl}, ${this.reRunParams.simulator}`);

    /* 2. Introspect datasource */
    if (this.archive) {
      // 1. Set the simMethod data and modelData from simService.getspecsofseddocs
      const reRunSedData$ = this.simulationService.getSpecsOfSedDocsInCombineArchive(this.archive);
      reRunSedData$.subscribe((sedDocSpecs: CombineArchiveSedDocSpecs | undefined) => {
        // 2. Run introspection from sedDocsSpecs
        this.archiveSedDocSpecsLoaded(sedDocSpecs);
      });
    }

    //this.introspectionData$ = this.introspectionProvider();

    // ensure that Customed data is properly set and returned to dispatch/router.navigate

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

  /*private populateModelChangesForm(): void {
    // remember that here the introspection comes from the model changes
    this.introspectionData$?.subscribe((introspection: CustomizableSedDocumentData | null) => {
      const introspectedChanges: SedModelChange[] | undefined = introspection?.modelChanges;
      if (introspectedChanges) {
        this.loadIntrospectedModelChanges(introspectedChanges);
        console.log(introspectedChanges);
      }
    });
  }*/

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
    /* Populate form using this.modelData */
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
        this.modelData = {
          modelFile: model?.name as unknown as Blob,
          modelFormat: Array.from(modelFormats)[0],
          modelChanges: model.changes,
          modelLanguage: model.language,
        };
      });
    });

    // get the simType
    this.sedDoc.simulations.forEach((sim: SedSimulation): void => {
      const kisaoId = sim.algorithm.kisaoId;
      this.kisaoId = kisaoId;
      simulationAlgorithms.add(kisaoId);
      simulations.add(sim);
      this.simulationType = sim._type;
      this.simMethodData = {
        simulationType: this.simType,
        algorithm: kisaoId,
      };
    });

    // introspect:
    const modelingFramework = 'SBO_0000293'; // TODO: Make this dynamic
    this.introspectionData$ = this.simulationService.getIntrospectionData(
      this.modelFile,
      this.modelData.modelLanguage,
      this.simulationType,
      modelingFramework,
      this.kisaoId,
    );

    if (this.introspectionData$) {
      console.log(`INTROSPECTION SET!`);
      this.introspectionData$.subscribe({
        next: (sedDocument: SedDocument) => {
          sedDocument.models.forEach((model: any) => {
            model.changes.forEach((change: SedModelChange | any, index: number) => {
              switch (change) {
                case change as SedModelAttributeChangeTypeEnum:
                  console.log(`INTROSPECTED CHANGE ${index}: ${change.newValue}`);
              }
            });
            console.log(`THE LEN: ${model.changes.length}`);
          });
        },
      });
    }
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
