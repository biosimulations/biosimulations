import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass'],
})
export class FaqComponent {
  emailUrl!: string;
  
  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
