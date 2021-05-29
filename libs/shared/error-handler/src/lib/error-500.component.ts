import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-error-500',
  templateUrl: './error-500.component.html',
  styleUrls: ['./error-500.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error500Component {
  @Input()
  pageHasBreadCrumbs = false;

  code: number | string = '500';
  message = 'Server error';
  details = 'Something went wrong.';
  email: string;
  emailUrl: string;
  newIssueUrl: string;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    const state = router.getCurrentNavigation()?.extras.state;
    if (state?.code !== undefined) {
      this.code = state.code;
    }
    if (state?.message !== undefined) {
      this.message = state?.message;
    }
    if (state?.details !== undefined) {
      this.details = state?.details;
    }

    const config = activatedRoute.snapshot.data?.config;
    this.email = config?.email;
    this.emailUrl = 'mailto:' + this.email;
    this.newIssueUrl = config?.newIssueUrl;
  }
}
