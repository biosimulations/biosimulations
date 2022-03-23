import { Component } from '@angular/core';
import { URL_VALIDATOR } from '@biosimulations/shared/ui';
import {
  DispatchService,
  OntologyTerm,
  SimulatorsData,
  ModelingFrameworksAlgorithmsForModelFormat,
  SimulatorSpecs,
} from '@biosimulations/simulation-project-utils/service';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { BIOSIMULATIONS_FORMATS_BY_ID, BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { EdamTerm } from '@biosimulations/datamodel/common';
import { FormStepComponent, FormStepData } from './form-step';

@Component({
  selector: 'create-project-upload-model',
  templateUrl: './upload-model.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class UploadModelComponent implements FormStepComponent {
  public formGroup: FormGroup;
  public modelFileTypeSpecifiers: string;
  public modelFormats?: OntologyTerm[];
  public nextClicked = false;

  public constructor(private formBuilder: FormBuilder, private dispatchService: DispatchService) {
    this.modelFileTypeSpecifiers = this.createFileTypeSpecifiers();

    this.formGroup = this.formBuilder.group(
      {
        modelFile: [null, [this.dispatchService.maxFileSizeValidator()]],
        modelUrl: [null, [URL_VALIDATOR]],
        modelFormat: [null, Validators.required],
      },
      {
        validators: this.formValidator.bind(this),
      },
    );
  }

  public setup(simulatorsData: SimulatorsData | undefined): void {
    if (!simulatorsData) {
      return;
    }

    // Find all formats supported by available simulators
    const formatEdamIds = new Set<string>();
    const addIdToSet = (formatEdamId: string): void => {
      formatEdamIds.add(formatEdamId);
    };
    const addIdsFromAlgorithm = (frameworksAlgorithms: ModelingFrameworksAlgorithmsForModelFormat): void => {
      frameworksAlgorithms.formatEdamIds.forEach(addIdToSet);
    };
    const addIdsFromSimulator = (simulator: SimulatorSpecs): void => {
      simulator.modelingFrameworksAlgorithmsForModelFormats.forEach(addIdsFromAlgorithm);
    };
    const simulatorSpecs = Object.values(simulatorsData.simulatorSpecs);
    simulatorSpecs?.forEach(addIdsFromSimulator);

    // Store available and introspectable model formats.
    let modelFormats: OntologyTerm[] = Object.values(simulatorsData.modelFormats);
    modelFormats = modelFormats?.filter((format: OntologyTerm): boolean => {
      const formatAvailable = formatEdamIds.has(format.id);
      const formatMetadata = BIOSIMULATIONS_FORMATS_BY_ID[format.id]?.biosimulationsMetadata?.modelFormatMetadata;
      return formatAvailable && formatMetadata?.introspectionAvailable === true;
    });
    modelFormats?.sort((a: OntologyTerm, b: OntologyTerm): number => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    this.modelFormats = modelFormats;
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    if (!formStepData) {
      return;
    }
    this.formGroup.controls.modelFormat.setValue(formStepData.modelFormat);
    this.formGroup.controls.modelUrl.setValue(formStepData.modelUrl);
  }

  public getFormStepData(): FormStepData {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return undefined;
    }
    const modelFile = this.formGroup.value.modelFile?.files[0];
    const modelUrl = this.formGroup.value.modelUrl;
    const modelFormat = this.formGroup.value.modelFormat;
    return {
      modelUrl: modelUrl,
      modelFile: modelFile,
      modelFormat: modelFormat,
    };
  }

  private formValidator(formGroup: FormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};
    if (!formGroup.value.modelFile && !formGroup.value.modelUrl) {
      errors['noModel'] = true;
    }
    if (formGroup.value.modelFile && formGroup.value.modelUrl) {
      errors['multipleModels'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }

  private createFileTypeSpecifiers(): string {
    const specifierSet = BIOSIMULATIONS_FORMATS.reduce(function (result: Set<string>, format: EdamTerm) {
      if (!format?.biosimulationsMetadata?.modelFormatMetadata?.introspectionAvailable) {
        return result;
      }
      format.fileExtensions.forEach((extension: string): void => {
        result.add('.' + extension);
      });
      format.mediaTypes.forEach((mediaType: string): void => {
        result.add(mediaType);
      });
      return result;
    }, new Set<string>());
    return Array.from(specifierSet).join(',');
  }
}
