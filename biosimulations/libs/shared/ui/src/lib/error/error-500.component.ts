import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-error-500',
  templateUrl: './error-500.component.html',
  styleUrls: ['./error-500.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error500Component {
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
