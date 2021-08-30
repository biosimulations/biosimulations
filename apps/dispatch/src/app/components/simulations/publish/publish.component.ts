import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { CombineService } from '../../../services/combine/combine.service';
import { CombineArchiveElementMetadata } from '../../../datamodel/metadata.interface';
import { ValidationReport } from '../../../datamodel/validation-report.interface';
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

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  uuid!: string;

  metadataValid$!: Observable<boolean | undefined | null>;

  formGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private combineService: CombineService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.formGroup = formBuilder.group({
      id: [null, [Validators.required], [this.uniqueIdValidator()]],
    });
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
    this.metadataValid$ = this.combineService
      .getCombineArchiveMetadata(archiveUrl)
      .pipe(
        map(
          (
            arg: CombineArchiveElementMetadata[] | ValidationReport | undefined,
          ): boolean | undefined => {
            if (arg === undefined) {
              return undefined;
            }
            if (!Array.isArray(arg)) {
              return false;
            }

            for (const elMetadata of arg as CombineArchiveElementMetadata[]) {
              if (elMetadata.uri === '.') {
                return true;
              }
            }

            return false;
          },
        ),
      );
  }

  getArchiveUrl(): string {
    return `${urls.dispatchApi}run/${this.uuid}/download`;
  }

  onFormSubmit(): void {
    this.formGroup.updateValueAndValidity();

    if (!this.formGroup.valid) {
      return;
    }

    /* TODO: implement publishing project */
  }
}
