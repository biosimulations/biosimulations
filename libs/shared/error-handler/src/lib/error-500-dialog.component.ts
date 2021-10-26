import { Component, Inject } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ErrorState {
  code: number | string | undefined;
  message: string | undefined;
  details: string | undefined;
};

@Component({
  selector: 'biosimulations-error-500-dialog',
  templateUrl: './error-500-dialog.component.html',
  styleUrls: ['./error-500-dialog.component.scss'],
})
export class Error500DialogComponent {
  details = '';
  email: string;
  emailUrl: string;
  newIssueUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) private state: ErrorState, private config: ConfigService) {
    if (state?.details !== undefined) {
      this.details = state?.details;
    }

    this.email = config.email;
    this.emailUrl = 'mailto:' + this.email;
    this.newIssueUrl = config.newIssueUrl;
  }
}