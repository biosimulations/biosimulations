import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { RegistrationService } from './registration.service';

@Component({
  selector: 'biosimulations-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
})
export class RegistrationComponent implements OnInit {
  userNameForm: FormControl;
  termsAndConditionsForm: FormGroup;

  state: string | null;
  token: string | null;

  termsAndConditionsFormValue: Observable<string>;

  // TODO use a common config library for these
  ccUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/CODE_OF_CONDUCT.md';
  tosUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/TERMS_OF_SERVICE.md';
  ppoUrl =
    'https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/PRIVACY_POLICY.md';

  aboutUrl = 'mailTo:info@biosimulations.org';

  loginUrl = 'https://auth.biosimulations.dev/continue?state=';

  submitted = new BehaviorSubject(false);
  accepted = new BehaviorSubject(false);

  user: any;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
  ) {
    this.userNameForm = new FormControl(
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
  ngOnInit(): void { }

  getErrorMessage() {

    if (this.userNameForm.hasError('required')) {
      return 'A username is required';
    }
    if (this.userNameForm.hasError('server')) {
      return this.userNameForm.getError('server')
    }
    if (this.userNameForm.hasError('invalid')) {
      return 'This username is not valid';
    }
  }
  register() {
    const username = this.userNameForm.value;
    this.submitted.next(true);
    this.user = this.registrationService
      .register(username, this.token)
      .pipe(tap(_ => this.accepted.next(true)))
      .subscribe(_ => this.redirect(this.state));
  }

  redirect(state: string | null) {
    if (!state) {
      state = '';
    }
    window.location.href = this.loginUrl + state;
  }
}
