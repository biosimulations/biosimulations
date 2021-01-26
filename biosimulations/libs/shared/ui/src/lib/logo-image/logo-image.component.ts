import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-logo-image',
  templateUrl: './logo-image.component.html',
  styleUrls: ['./logo-image.component.scss'],
})
export class LogoImageComponent {
  @Input()
  logo = 'assets/images/biosimulations-logo/logo.svg';
}
