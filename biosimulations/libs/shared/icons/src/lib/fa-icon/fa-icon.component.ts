import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-fa-icon',
  templateUrl: './fa-icon.component.html',
  styleUrls: ['./fa-icon.component.scss'],
})
export class FaIconComponent {
  @Input()
  icon!: string;

  @Input()
  spin = false;
}
