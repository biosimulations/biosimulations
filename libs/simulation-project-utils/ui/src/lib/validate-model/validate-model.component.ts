import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { CombineApiService } from '@biosimulations/simulation-project-utils/service';
import {
  ValidationReport,
  ValidationMessage,
  ValidationStatus,
  ModelLanguage,
  EdamTerm,
} from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { Subscription } from 'rxjs';
import { ConfigService } from '@biosimulations/config/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import isUrl from 'is-url';
import { HtmlSnackBarComponent } from '@biosimulations/shared/ui';
import { FileInput } from 'ngx-material-file-input';

enum SubmitMethod {
  file = 'file',
  url = 'url',
}

@Component({
  selector: 'biosimulations-validate-model',
  templateUrl: './validate-model.component.html',
  styleUrls: ['./validate-model.component.scss'],
})
export class ValidateModelComponent implements OnInit, OnDestroy {
  submitMethod: SubmitMethod = SubmitMethod.file;
  formGroup: FormGroup;
  submitMethodControl: FormControl;
  modelFileControl: FormControl;
  modelUrlControl: FormControl;

  modelLanguages = Object.keys(ModelLanguage).sort();

  modelFileFormats: string;

  exampleModelUrl: string;
  exampleModelsUrl: string;

  submitPushed = false;

  private subscriptions: Subscription[] = [];

  status: ValidationStatus | undefined = undefined;
  errors: string | undefined = undefined;
  warnings: string | undefined = undefined;

  constructor(
    private config: ConfigService,
    private formBuilder: FormBuilder,
    private combineApiService: CombineApiService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    const modelFileFormats: string[] = [];
    BIOSIMULATIONS_FORMATS.filter((format: EdamTerm): boolean => {
      return (
        format?.biosimulationsMetadata?.modelFormatMetadata
          ?.validationAvailable === true
      );
    }).forEach((format: EdamTerm): void => {
      format.fileExtensions.forEach((extension: string): void => {
        modelFileFormats.push('.' + extension);
      });
      format.mediaTypes.forEach((mediaType: string): void => {
        modelFileFormats.push(mediaType);
      });
    });
    this.modelFileFormats = modelFileFormats.join(',');

    this.formGroup = this.formBuilder.group(
      {
        submitMethod: [SubmitMethod.file],
        modelFile: [
          '',
          [Validators.required, this.maxFileSizeValidator.bind(this)],
        ],
        modelUrl: ['', [this.urlValidator]],
        modelLanguage: [null],
      },
      //{
      //  validators: this.formValidator,
      //},
    );

    this.submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    this.modelFileControl = this.formGroup.controls.modelFile as FormControl;
    this.modelUrlControl = this.formGroup.controls.modelUrl as FormControl;

    this.modelUrlControl.disable();

    this.exampleModelsUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
    this.exampleModelUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/raw' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoPath +
      this.config.appConfig.exampleCombineArchives.exampleModelPath;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      const modelUrl = params?.modelUrl;
      if (modelUrl) {
        const submitMethodControl = this.formGroup.controls
          .submitMethod as FormControl;
        const modelUrlControl = this.formGroup.controls.modelUrl as FormControl;
        submitMethodControl.setValue(SubmitMethod.url);
        modelUrlControl.setValue(modelUrl);
        this.changeSubmitMethod();
      }
    });
  }

  maxFileSizeValidator(control: FormControl): ValidationErrors | null {
    const fileInput: FileInput | null = control.value;
    const file: File | undefined = fileInput?.files
      ? fileInput.files[0]
      : undefined;
    const fileSize = file?.size;
    if (
      fileInput &&
      fileSize &&
      fileSize > this.config.appConfig.maxUploadFileSize
    ) {
      return {
        maxSize: true,
      };
    } else {
      return null;
    }
  }

  urlValidator(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value && isUrl(control.value)) {
      return null;
    } else {
      return {
        url: true,
      };
    }
  }

  formValidator(formGroup: FormGroup): ValidationErrors | null {
    const errors: ValidationErrors = {};

    if (formGroup.value.submitMethod == SubmitMethod.file) {
      if (!formGroup.value.modelFile) {
        errors['noModelFile'] = true;
      }
    } else {
      if (!formGroup.value.modelUrl) {
        errors['noModelUrl'] = true;
      }
    }

    if (Object.keys(errors).length) {
      return errors;
    } else {
      return null;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  changeSubmitMethod(): void {
    const submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    if (submitMethodControl.value === SubmitMethod.file) {
      this.formGroup.controls.modelFile.enable();
      this.formGroup.controls.modelUrl.disable();
    } else {
      this.formGroup.controls.modelFile.disable();
      this.formGroup.controls.modelUrl.enable();
    }
  }

  onFormSubmit(): void {
    this.submitPushed = true;

    if (!this.formGroup.valid) {
      return;
    }

    // clear previous report
    this.status = undefined;
    this.errors = undefined;
    this.warnings = undefined;

    // get data for API
    const submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;

    let model: File | string = '';
    if (submitMethodControl.value === SubmitMethod.file) {
      const fileInput: FileInput = this.formGroup.controls.modelFile.value;
      model = fileInput?.files[0];
    } else {
      model = this.formGroup.controls.modelUrl.value;
    }

    // call API to validate model
    const validationSub = this.combineApiService
      .validateModel(model, this.formGroup.controls.modelLanguage.value)
      .subscribe((report: ValidationReport | undefined): void => {
        if (report) {
          this.status = report.status;

          if (report?.errors?.length) {
            this.errors = this.convertValidationMessagesToList(
              report?.errors as ValidationMessage[],
            );
          }
          if (report?.warnings?.length) {
            this.warnings = this.convertValidationMessagesToList(
              report?.warnings as ValidationMessage[],
            );
          }

          this.snackBar.open('The validation of your model completed.', 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } else {
          let msg = 'Sorry! We were unable to validate your model.';
          if (submitMethodControl.value == SubmitMethod.url) {
            msg += ` Please check that ${model} is an accessible URL.`;
          }
          msg += ' Please refresh to try again.';

          this.snackBar.open(msg, 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
    this.subscriptions.push(validationSub);

    // display status
    this.snackBar.openFromComponent(HtmlSnackBarComponent, {
      data: {
        message: 'Please wait while your model is validated',
        spinner: true,
        action: 'Ok',
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private convertValidationMessagesToList(
    messages: ValidationMessage[],
  ): string {
    return messages
      .map((message: ValidationMessage): string => {
        let details = '';
        if (message?.details?.length) {
          details =
            '<ul>' +
            this.convertValidationMessagesToList(
              message?.details as ValidationMessage[],
            ) +
            '</ul>';
        }

        return '<li>' + message.summary + details + '</li>';
      })
      .join('\n');
  }
}
