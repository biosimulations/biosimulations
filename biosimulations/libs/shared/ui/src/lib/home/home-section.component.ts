import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSectionComponent {
  @Input()
  columns:number = 3;

  constructor() {}
}
