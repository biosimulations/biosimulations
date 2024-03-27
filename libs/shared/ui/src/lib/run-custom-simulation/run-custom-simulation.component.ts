import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonFile } from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import {
  CombineArchiveSedDocSpecs,
  CombineArchiveSedDocSpecsContent,
  SedDocument,
  SedModel,
  SedSimulation,
  SedModelAttributeChangeTypeEnum,
  SedModelChange,
  SedModelAttributeChange,
} from '@biosimulations/combine-api-angular-client';
import { ActivatedRoute } from '@angular/router';
import {
  CustomSimulationDatasource,
  FormStepData,
  ReRunQueryParams,
  SEDML_ID_VALIDATOR,
  SharedSimulationService,
  UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR,
} from '@biosimulations/shared/services';

export interface IntrospectionParams {
  modelFile?: CommonFile;
  modelLanguage?: string;
  simulationType?: string;
  framework?: string;
  kisaoId?: string;
}

@Component({
  selector: 'biosimulations-run-custom-simulation',
  templateUrl: './run-custom-simulation.component.html',
  styleUrls: ['./run-custom-simulation.component.scss'],
})
export class RunCustomSimulationComponent implements OnInit, OnChanges {
  // data loaded from rerun query params
  public reRunParams!: ReRunQueryParams;
  public simulationDataSource!: CustomSimulationDatasource;
  public formArray: UntypedFormArray;
  public sedDoc!: SedDocument;

  // network data
  public introspectionData$?: Observable<SedDocument | any>;
  public kisaoId!: string;
  public simulationType!: string;
  public modelFile!: CommonFile; // set in onInit
  public modelChanges!: SedModelChange[];
  public modelLanguage!: string;

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

    /* 1. Derive and set vals from query params */
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
            if (file.url.includes('xml') || file.url.includes('sbml')) {
              this.modelFile = file;
            }
            break;
          case file as File:
            break;
        }
      });
    });

    console.log(`RERUN PARAMS RECIEVED FROM QUERY: ${this.reRunParams.projectUrl}, ${this.reRunParams.simulator}`);

    /* 2. Introspect datasource */
    if (this.archive) {
      // A. Set the simMethod data and modelData from simService.getspecsofseddocs
      const reRunSedData$ = this.simulationService.getSpecsOfSedDocsInCombineArchive(this.archive);
      reRunSedData$.subscribe((sedDocSpecs: CombineArchiveSedDocSpecs | undefined) => {
        // B. Run introspection from sedDocsSpecs
        this.archiveSedDocSpecsLoaded(sedDocSpecs);
      });
    }
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

  /**
   * Preloads any model changes parsed out of the uploaded SedDocument into the form.
   * @param introspectedModelChanges SedModelChange instances parsed out of the uploaded SedDocument.
   */
  public loadIntrospectedModelChanges(introspectedModelChanges: SedModelAttributeChange[]): void {
    if (introspectedModelChanges.length === 0) {
      return;
    }
    this.formArray.clear();
    introspectedModelChanges.forEach((change: SedModelAttributeChange) => {
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
    console.log(`ADDED: ${modelChangeForm.get('newValue')?.value}`);
    this.formArray.push(modelChangeForm);
  }

  private addFieldForModelChange(modelChange: SedModelChange): void {
    // TODO: Support additional change types.
    if (modelChange && modelChange._type !== SedModelAttributeChangeTypeEnum.SedModelAttributeChange) {
      console.log('cant');
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
        this.modelLanguage = model.language;
      });
    });

    // get the simType
    this.sedDoc.simulations.forEach((sim: SedSimulation): void => {
      this.kisaoId = sim.algorithm.kisaoId;
      this.simulationType = sim._type;
    });

    // introspect:
    const modelingFramework = 'SBO_0000293'; // TODO: Make this dynamic
    this.introspectionData$ = this.simulationService.getIntrospectionData(
      this.modelFile,
      this.modelLanguage,
      this.simulationType,
      modelingFramework,
      this.kisaoId,
    );
    // NOTE: we must populate the form during, and only during this subscription!!!
    this.extractIntrospection();
  }

  public extractIntrospection(): void {
    if (this.introspectionData$) {
      this.introspectionData$.subscribe({
        next: (sedDocument: SedDocument) => {
          const modelChanges: any[] = [];
          sedDocument.models?.forEach((model: any) => {
            switch (model?.changes) {
              case model.changes as SedModelAttributeChange[]:
                modelChanges.push(...model.changes);
                modelChanges.forEach((change: SedModelAttributeChange) => {
                  console.log(`${change.newValue}`);
                });
                break;
            }
          });
          // TODO: now populate the form!!!
          modelChanges.forEach((c: SedModelAttributeChange, i: number) => {
            console.log(`the introspected change #${i}: ${c.newValue}`);
          });
          this.loadIntrospectedModelChanges(modelChanges);
          console.log(`INTROSPECTION SET FROM QUERY PARAMS AND COMBINE API!`);
        },
      });
    }
  }

  public createChangeForm(modelChange: SedModelAttributeChange): UntypedFormGroup {
    return this.formBuilder.group({
      id: [modelChange.id, Validators.required],
      name: [modelChange.name],
      newValue: [modelChange.newValue],
    });
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
