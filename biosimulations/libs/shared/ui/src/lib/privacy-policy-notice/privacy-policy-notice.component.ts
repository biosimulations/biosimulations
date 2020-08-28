import { Component, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'biosimulations-privacy-policy-notice',
  templateUrl: './privacy-policy-notice.component.html',
  styleUrls: ['./privacy-policy-notice.component.scss'],
})
export class PrivacyPolicyNoticeComponent {
  // TODO: get from app config  
  appName = 'BioSimulations';
  privacyPolicyVersion = 1;
  open = true;

  constructor(private cookieService: CookieService) {
    if (this.cookieService.check('privacy-policy-notice-' + this.privacyPolicyVersion.toString() + '-dismissed')) {
      this.open = false;
    }
  }

  close(): void {
    this.open = false;
    this.cookieService.set('privacy-policy-notice-' + this.privacyPolicyVersion.toString() + '-dismissed', '1');    
  }
}
