import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CreateMaxFileSizeValidator, URL_VALIDATOR } from '@biosimulations/shared/ui';
import { OntologyTerm } from '../../../../index';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  ValidationErrors,
  AbstractControlOptions,
} from '@angular/forms';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { EdamTerm } from '@biosimulations/datamodel/common';
import { IFormStepComponent, FormStepData } from '../create-project/forms';
import { ConfigService } from '@biosimulations/config/angular';

@Component({
  selector: 'create-project-upload-model',
  templateUrl: './upload-model.component.html',
  styleUrls: ['./form-steps.scss'],
})
export class UploadModelComponent implements IFormStepComponent, OnInit {
  public formGroup: UntypedFormGroup;
  public uploadArchiveFormGroup: UntypedFormGroup;
  public modelFormats?: OntologyTerm[];
  public nextClicked = false;
  @Output() fileTypeDetected = new EventEmitter<string>();
  @Input() archiveModelFile?: File;
  public archiveDetected?: boolean;
  public uploadArchive!: boolean;
  public stepName = 'uploadFile';

  public constructor(private formBuilder: UntypedFormBuilder, private config: ConfigService) {
    // todo: seperate form group here
    this.formGroup = this.formBuilder.group(
      {
        modelFile: [null, [CreateMaxFileSizeValidator(this.config)]],
        modelUrl: [null, [URL_VALIDATOR]],
        modelFormat: [null, [Validators.required]],
        archiveUrl: [null],
      },
      {
        validators: this.formValidator.bind(this),
      } as AbstractControlOptions,
    );

    this.uploadArchiveFormGroup = this.formBuilder.group({
      archiveFile: [null],
    });
  }

  public ngOnInit() {
    if (this.archiveModelFile) {
      this.archiveDetected = true;
    }
  }

  public populateFormFromFormStepData(formStepData: FormStepData): void {
    if (!this.uploadArchive) {
      this.uploadArchiveFormGroup.controls.archiveFile.setValue(formStepData.archiveFile);
    } else {
      this.formGroup.controls.modelFormat.setValue(formStepData.modelFormat);
      this.formGroup.controls.modelUrl.setValue(formStepData.modelUrl);
    }
  }

  public getFormStepData(): FormStepData | null {
    this.formGroup.updateValueAndValidity();
    if (!this.formGroup.valid) {
      return null;
    }
    if (this.archiveDetected) {
      console.log(`archive!`);
    }
    const modelFile = this.formGroup.value.modelFile?.files[0];
    const modelUrl = this.formGroup.value.modelUrl;
    const modelFormat = this.formGroup.value.modelFormat;

    this.formGroup.value.modelFile?.files.forEach((f: File) => {
      console.log(` form step data going out: ${f.name}`);
      if (f.name.includes('.omex')) {
        console.log(`OMEX FOUND: ${f.name}`);
        this.archiveDetected = true;
        console.log(`${this.archiveDetected}`);
      }
    });

    if (this.archiveDetected) {
      console.log(`returning archive`);
      return {
        archiveFile: modelFile,
      };
    } else {
      return {
        modelUrl: modelUrl,
        modelFile: modelFile,
        modelFormat: modelFormat,
      };
    }
  }

  public supportedFileTypes(): string {
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
      result.add('.omex');
      return result;
    }, new Set<string>());
    return Array.from(specifierSet).join(',');
  }

  private formValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};
    if (!formGroup.value.modelFile && !formGroup.value.modelUrl) {
      errors['noModel'] = true;
    }
    if (formGroup.value.modelFile && formGroup.value.modelUrl) {
      errors['multipleModels'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log(`${event.target.files}`);
    if (file) {
      const fileType = this.detectFileType(file); // Implement this method based on file name or content
      console.log(`File detected in upload model!: ${fileType}`);
      this.fileTypeDetected.emit(fileType);
    }
  }

  public detectFileType(file: File): string {
    // Implement file type detection logic here
    // This could be as simple as checking the file extension, or more complex analysis
    const extension = file.name.split('.').pop();
    if (extension === 'omex') {
      this.archiveDetected = true;
      return 'OMEX';
    }
    // Add more conditions as needed
    return 'UNKNOWN';
  }

  archiveIsUploaded(archiveUploaded: boolean) {
    this.archiveDetected = archiveUploaded;
    console.log(`Archive is uploaded: ${this.archiveDetected}`);
  }
}
