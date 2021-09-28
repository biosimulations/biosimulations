import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, concatAll } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { MetadataService } from '../../../services/simulation/metadata.service';
import { CombineService } from '../../../services/combine/combine.service';
import { ConfigService } from '@biosimulations/shared/services';
import { SimulationRunMetadata } from '@biosimulations/datamodel/api'
import { CombineArchiveElementMetadata } from '../../../datamodel/metadata.interface';
import { ValidationReport, ValidationMessage } from '../../../datamodel/validation-report.interface';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { environment } from '@biosimulations/shared/environments';
import { Router } from '@angular/router';

interface FormattedValidationReport {
  errors: string | null;
  warnings: string | null;
}

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  uuid!: string;

  metadataValid$!: Observable<boolean>;
  metadataValidationReport$!: Observable<FormattedValidationReport | false | undefined>;

  formGroup: FormGroup;
  submitPushed = false;

  newIssueUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private metadataService: MetadataService,
    private combineService: CombineService,
    private formBuilder: FormBuilder,
    private router: Router,
    private config: ConfigService,
  ) {
    this.formGroup = formBuilder.group({
      //id: [null, [Validators.required], [this.uniqueIdValidator()]], // TODO: enable
      isValid: [false, [Validators.required]],
      grantedLicense: [false, [Validators.required]],
    });

    this.newIssueUrl = config.newIssueUrl;
  }

  uniqueIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIdExists(control.value).pipe(
        map((exists: boolean): ValidationErrors | null => {
          if (exists) {
            return { unique: true };
          } else {
            return null;
          }
        }),
      );
    };
  }

  checkIdExists(id: string): Observable<boolean> {
    /* TODO: check if id already taken */
    return of(false);
  }

  public ngOnInit(): void {
    // TODO: remove routing to construction message
    if (environment.production) {
      this.router.navigate(['/error', 'construction'], {
        skipLocationChange: true,
      });
      return;
    }

    this.uuid = this.route.snapshot.params['uuid'];

    const archiveUrl = this.getArchiveUrl();

    this.metadataValid$ = this.metadataService.getMetadata(this.uuid)
      .pipe(
        map((metadata: SimulationRunMetadata): true => {
          return true;
        }),
        catchError((error: Error) => {            
          return of(false);
        }),        
      );

    this.metadataValidationReport$ = this.metadataValid$.pipe(
      map((valid: boolean): Observable<FormattedValidationReport | false | undefined> => {
        if (valid) {
          return of(undefined);
        }

        return this.combineService
          .getCombineArchiveMetadata(archiveUrl)
          .pipe(
            map(
              (
                arg: CombineArchiveElementMetadata[] | ValidationReport | undefined,
              ): FormattedValidationReport | false => {
                if (arg === undefined) {
                  return false;
                }

                if (!Array.isArray(arg)) {
                  return {
                    errors: arg?.errors?.length 
                      ? this.convertValidationMessagesToList(arg.errors)
                      : null,
                    warnings: arg?.warnings?.length
                      ? this.convertValidationMessagesToList(arg.warnings)
                      : null,
                  };
                }

                return false;
              },
            ),
          );
      }),
      concatAll(),
    );
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

  isMetadataValidationReport(report: FormattedValidationReport | false | undefined | null): boolean {
    return !(report === false || report === undefined || report === null);
  }

  getArchiveUrl(): string {
    return `${urls.dispatchApi}run/${this.uuid}/download`;
  }

  publishSimulation(): void {
    this.submitPushed = true;
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.invalid) {
      return;
    }

    /* TODO: implement publishing project */
  }
}
