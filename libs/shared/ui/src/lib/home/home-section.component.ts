import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.scss'],
})
export class HomeSectionComponent {
  @Input()
  columns = 3;
}
