import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.scss'],
})
export class UnderConstructionComponent {
  @Input()
  pageHasBreadCrumbs = false;
}
