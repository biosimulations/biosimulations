import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-error-404',
  templateUrl: './error-404.component.html',
  styleUrls: ['./error-404.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error404Component {
  @Input()
  pageHasBreadCrumbs = false;

  code: number | string | undefined = '404';
  message = 'Page not found';
  details = "We're sorry! The page you requested could not be found.";
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
