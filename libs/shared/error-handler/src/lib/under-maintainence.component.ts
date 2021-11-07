import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-under-maintainence',
  templateUrl: './under-maintainence.component.html',
  styleUrls: ['./under-maintainence.component.scss'],
})
export class UnderMaintainenceComponent {
  @Input()
  pageHasBreadCrumbs = false;
}
