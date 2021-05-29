import { Component, Input } from '@angular/core';
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'biosimulations-fa-icon',
  templateUrl: './fa-icon.component.html',
  styleUrls: ['./fa-icon.component.scss'],
})
export class FaIconComponent {
  @Input()
  icon!: [IconPrefix | 'cc' | 'mat', IconName];

  @Input()
  spin = false;
}
