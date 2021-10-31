import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, catchError, concatAll, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { Endpoints } from '@biosimulations/config/common';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { CombineService } from '../../../services/combine/combine.service';
import { ProjectService } from '@biosimulations/angular-api-client';
import { ConfigService } from '@biosimulations/shared/angular';
import {
  Simulation,
  UnknownSimulation,
  isUnknownSimulation,
} from '../../../datamodel';
import { Project, ProjectInput } from '@biosimulations/datamodel/common';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit, OnDestroy {
  private uuid!: string;

  private simulation!: Simulation;
  valid$!: Observable<true | string>;

  formGroup: FormGroup;
  submitPushed = false;

  private subscriptions: Subscription[] = [];

  private endpoints = new Endpoints();

  constructor(
    private route: ActivatedRoute,
    private simulationService: SimulationService,
    private combineService: CombineService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private config: ConfigService,
  ) {
    this.formGroup = formBuilder.group({
      id: [
        null,
        [Validators.required, Validators.pattern(/^[a-z0-9_-]{3,}$/i)],
        [this.idAvailableValidator()],
      ],
      isValid: [false, [Validators.required]],
      grantedLicense: [false, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe(),
    );
  }

  idAvailableValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.isIdAvailable(control.value).pipe(
        map((available: boolean): ValidationErrors | null => {
          if (available) {
            return null;
          } else {
            return { available: true };
          }
        }),
      );
    };
  }

  isIdAvailable(id: string): Observable<boolean> {
    return this.projectService.getProject(id).pipe(
      map((_): false => false),
      catchError((error: HttpErrorResponse): Observable<boolean> => {
        console.log(error);
        return of(true);
      }),
    );
  }

  public ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

    const simulation$ = this.simulationService.getSimulation(this.uuid).pipe(
      map((simulation: Simulation | UnknownSimulation): Simulation => {
        if (isUnknownSimulation(simulation)) {
          throw new BiosimulationsError(
            'Simulation run not found',
            "We're sorry! The run you requested could not be found.",
            HttpStatusCode.NotFound,
          );
        }
        return simulation as Simulation;
      }),
      shareReplay(1),
    );

    this.valid$ = simulation$.pipe(
      map(() => {
        const projectInput: ProjectInput = {
          id: 'test',
          simulationRun: this.uuid,
        };
        return this.projectService.isProjectValid(projectInput, false, false, true);
      }),
      concatAll(),
      shareReplay(1),
    );
  }

  publishSimulation(): void {
    this.submitPushed = true;
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.invalid) {
      return;
    }

    const pubSub = this.projectService
      .publishProject({
        id: this.formGroup.controls.id.value,
        simulationRun: this.uuid,
      })
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.log(error);
          }

          this.snackBar.open(
            'Sorry! We were unable to publish your project. Please try again later.',
            undefined,
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );

          return of<undefined>(undefined);
        }),
      )
      .subscribe((project: Project | undefined): void => {
        if (project) {
          const url = `${urls.platform}/projects/${project.id}`;
          const tabWindowId = window.open('about:blank', '_blank');
          if (tabWindowId) {
            tabWindowId.location.href = url;
          }
        }
      });
    this.subscriptions.push(pubSub);
  }
}
