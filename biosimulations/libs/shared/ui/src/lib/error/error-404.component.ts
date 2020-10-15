import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-error-404',
  templateUrl: './error-404.component.html',
  styleUrls: ['./error-404.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error404Component {
  @Input()
  pageHasBreadCrumbs = false;

  email: string;
  emailUrl: string;
  newIssueUrl: string;

  constructor(activatedRoute: ActivatedRoute) {
    const config = activatedRoute.snapshot.data?.config;

    this.email = config?.email;
    this.emailUrl = 'mailto:' + this.email;
    this.newIssueUrl = config?.newIssueUrl;    
  }
}
