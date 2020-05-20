import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pluck, tap, map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RegistrationService } from './registration.service';
import { AuthService } from '../shared/auth.service';

import { HttpClient } from '@angular/common/http';
import { uniqueUsernameAsyncValidatorFactory } from './unique-username.directive';
@Component({
  selector: 'biosimulations-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
})
export class RegistrationComponent implements OnInit {
  userNameForm: FormControl;
  termsAndConditionsForm: FormGroup;
  state: Observable<string>;
  token: Observable<string> | null;
  decodedToken: Observable<any>;
  termsAndConditionsFormValue: Observable<string>;

  // TODO use a common config library for these
  ccUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/CODE_OF_CONDUCT.md';
  tosUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/TERMS_OF_SERVICE.md';
  ppoUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/PRIVACY_POLICY.md';

  aboutUrl = 'mailTo: info@biosimulations.org';

  loginUrl = 'https://auth.biosimulations.dev/continue?state=';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private auth: AuthService,
    public http: HttpClient,
  ) {
    this.userNameForm = new FormControl(
      '',
      Validators.required,
      uniqueUsernameAsyncValidatorFactory(this.http),
    );

    this.termsAndConditionsForm = this.formBuilder.group({
      tos: ['', Validators.requiredTrue],
      coc: ['', Validators.requiredTrue],
      ppo: ['', Validators.requiredTrue],
    });
    this.termsAndConditionsFormValue = this.termsAndConditionsForm.valueChanges;

    this.state = this.route.queryParams.pipe(pluck('state'));
    this.token = this.auth.getTokenFromParams();
    this.decodedToken = this.auth.getDecodedToken();
  }
  ngOnInit(): void {}

  getErrorMessage() {
    if (this.userNameForm.hasError('required')) {
      return 'A username is required';
    }
    if (this.userNameForm.hasError('used')) {
      return 'This username is taken';
    }
    if (this.userNameForm.hasError('invalid')) {
      return 'This username is not valid';
    }
  }
  continueLogin() {
    this.registrationService.register('test');
    this.state.subscribe(state => this.redirect(state));
  }
  redirect(state: string) {
    if (!state) {
      alert(
        'This is not a valid login session. If you feel that you received this message in error, contact us',
      );
    } else {
      window.location.href = this.loginUrl + state;
    }
  }
}
