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

  message = 'Page not found';
  details = "We're sorry! The page you requested could not be found.";
  email: string;
  emailUrl: string;
  newIssueUrl: string;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.message = state?.message || this.message;
    this.details = state?.details || this.details;

    const config = activatedRoute.snapshot.data?.config;
    this.email = config?.email;
    this.emailUrl = 'mailto:' + this.email;
    this.newIssueUrl = config?.newIssueUrl;    
  }
}
