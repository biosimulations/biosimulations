import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { CombineApiService } from '../../../services/combine/combine-api.service';
import {
  ValidationReport,
  ValidationMessage,
  ValidationStatus,
} from '../../../datamodel/validation-report.interface';
import {
  OmexMetadataInputFormat,
  OmexMetadataSchema,
} from '@biosimulations/datamodel/common';
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
  selector: 'biosimulations-validate-metadata',
  templateUrl: './validate-metadata.component.html',
  styleUrls: ['./validate-metadata.component.scss'],
})
export class ValidateMetadataComponent implements OnInit, OnDestroy {
  submitMethod: SubmitMethod = SubmitMethod.file;
  formGroup: FormGroup;
  submitMethodControl: FormControl;
  metadataFileControl: FormControl;
  metadataUrlControl: FormControl;

  omexMetadataFormats = Object.keys(OmexMetadataInputFormat).sort();
  omexMetadataSchemas = [
    {
      label: 'BioSimulations',
      value: 'BioSimulations',
    },
    {
      label: 'None (OMEX Metadata)',
      value: 'rdf_triples',
    },
  ];

  exampleMetadataUrl: string;
  exampleMetadatasUrl: string;

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
    this.formGroup = this.formBuilder.group(
      {
        submitMethod: [SubmitMethod.file],
        metadataFile: [
          '',
          [Validators.required, this.maxFileSizeValidator.bind(this)],
        ],
        metadataUrl: ['', [this.urlValidator]],
        omexMetadataFormat: [OmexMetadataInputFormat.rdfxml],
        omexMetadataSchema: [OmexMetadataSchema.BioSimulations],
      },
      //{
      //  validators: this.formValidator,
      //},
    );

    this.submitMethodControl = this.formGroup.controls
      .submitMethod as FormControl;
    this.metadataFileControl = this.formGroup.controls
      .metadataFile as FormControl;
    this.metadataUrlControl = this.formGroup.controls
      .metadataUrl as FormControl;

    this.metadataUrlControl.disable();

    this.exampleMetadatasUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
    this.exampleMetadataUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/raw' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoPath +
      this.config.appConfig.exampleCombineArchives.exampleMetadataPath;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      const metadataUrl = params?.metadataUrl;
      if (metadataUrl) {
        const submitMethodControl = this.formGroup.controls
          .submitMethod as FormControl;
        const metadataUrlControl = this.formGroup.controls
          .metadataUrl as FormControl;
        submitMethodControl.setValue(SubmitMethod.url);
        metadataUrlControl.setValue(metadataUrl);
        this.changeSubmitMethod();
      }
    });
  }

  maxFileSizeValidator(control: FormControl): ValidationErrors | null {
    const fileInput: FileInput = control.value;
    const file: File | undefined = fileInput.files
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
      if (!formGroup.value.metadataFile) {
        errors['noMetadataFile'] = true;
      }
    } else {
      if (!formGroup.value.metadataUrl) {
        errors['noMetadataUrl'] = true;
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
      this.formGroup.controls.metadataFile.enable();
      this.formGroup.controls.metadataUrl.disable();
    } else {
      this.formGroup.controls.metadataFile.disable();
      this.formGroup.controls.metadataUrl.enable();
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

    let metadata: File | string = '';
    if (submitMethodControl.value === SubmitMethod.file) {
      const metadataFileInput: FileInput =
        this.formGroup.controls.metadataFile.value;
      metadata = metadataFileInput.files[0];
    } else {
      metadata = this.formGroup.controls.metadataUrl.value;
    }

    // call API to validate metadata
    const validationSub = this.combineApiService
      .validateMetadata(
        metadata,
        this.formGroup.controls.omexMetadataFormat.value,
        this.formGroup.controls.omexMetadataSchema.value,
      )
      .subscribe((report: ValidationReport | undefined): void => {
        if (report) {
          this.status = report.status;
          this.snackBar.open('The validation of your model completed.', 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
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

          this.snackBar.open(
            'The validation of your metadata completed.',
            'Ok',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
        } else {
          let msg = 'Sorry! We were unable to validate your metadata.';
          if (submitMethodControl.value == SubmitMethod.url) {
            msg += ` Please check that ${metadata} is an accessible URL.`;
          }

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
        message: 'Please wait while your metadata is validated',
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
