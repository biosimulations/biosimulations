import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pluck, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userNameForm: FormGroup;
  termsAndConditionsForm: FormGroup;
  state: Observable<string>;
  token: Observable<string>;
  termsAndConditionsFormValue;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.state = this.route.queryParams.pipe(pluck('state'));
    this.token = this.route.queryParams.pipe(pluck('token'));

    this.userNameForm = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.termsAndConditionsForm = this.formBuilder.group({
      tos: ['', Validators.requiredTrue],
      coc: ['', Validators.requiredTrue],
      ppo: ['', Validators.requiredTrue],
    });
  }
  continueLogin() {
    this.state.subscribe(
      state =>
        (window.location.href =
          'https://auth.biosimulations.dev/continue?state=' + state),
    );
  }
}
