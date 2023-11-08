import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';

import { RegistrationService } from './registration.service';

@Component({
  selector: 'biosimulations-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
})
export class RegistrationComponent implements OnInit, OnChanges {
  userNameForm: UntypedFormControl;
  termsAndConditionsForm: UntypedFormGroup;
  error?: string;
  state: string | null;
  token: string | null;

  termsAndConditionsFormValue: Observable<string>;

  // TODO use a common config library for these
  // TODO: replace with biosimulations-terms-of-service, biosimulations-privacy-policy OR links to https://docs.biosimulations.org/about/terms/ and https://docs.biosimulations.org/about/privacy/
  // TODO: CODE_OF_CONDUCT.md is for developers, rather than for users. This should be removed or replaced with a code of conduct for users
  ccUrl = 'https://docs.biosimulations.org/developers/#code-of-conduct';
  tosUrl = 'https://docs.biosimulations.org/about/terms/';
  ppoUrl = 'https://docs.biosimulations.org/about/privacy/';

  // TODO: get from app config
  aboutUrl = 'mailto:' + 'info@biosimulations.org';

  loginUrl = 'https://auth.biosimulations.org/continue?state=';

  submitted = new BehaviorSubject(false);
  accepted = new BehaviorSubject(false);

  user: any;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private registrationService: RegistrationService,
  ) {
    this.userNameForm = new UntypedFormControl(
      '',
      Validators.required,
      this.registrationService.uniqueUsernameAsyncValidator,
    );

    this.termsAndConditionsForm = this.formBuilder.group({
      tos: ['', Validators.requiredTrue],
      coc: ['', Validators.requiredTrue],
      ppo: ['', Validators.requiredTrue],
    });
    this.termsAndConditionsFormValue = this.termsAndConditionsForm.valueChanges;

    this.state = this.route.snapshot.queryParamMap.get('state');
    this.token = this.route.snapshot.queryParamMap.get('token');
  }
  ngOnInit(): void {
    const _dummy = 'no-op'; // lint complains about empty methods.
    if (this.userNameForm.invalid) {
      this.setErrorMessage();
    }
  }
  ngOnChanges(): void {
    this.setErrorMessage();
  }
  getErrorMessage() {
    if (this.userNameForm.hasError('required')) {
      return 'A username is required';
    }
    if (this.userNameForm.hasError('server')) {
      return this.userNameForm.getError('server');
    }
    if (this.userNameForm.hasError('invalid')) {
      return 'This username is not valid';
    }
  }
  register(): void {
    /*if (!this.userNameForm.valid) {
      return;
    }*/
    const username = this.userNameForm.value;
    this.submitted.next(true);
    this.user = this.registrationService
      .register(username, this.token)
      .pipe(tap((_) => this.accepted.next(true)))
      .subscribe((_) => this.redirect(this.state));
  }

  redirect(state: string | null): void {
    if (!state) {
      state = '';
    }
    window.location.href = this.loginUrl + state;
  }

  private setErrorMessage(): void {
    this.error = this.getErrorMessage();
  }
}
