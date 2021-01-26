import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-logo-text',
  templateUrl: './logo-text.component.html',
  styleUrls: ['./logo-text.component.scss'],
})
export class LogoTextComponent {
  @Input()
  appNameParts!: string[];
}
