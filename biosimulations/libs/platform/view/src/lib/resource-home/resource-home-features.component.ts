import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-home-features',
  templateUrl: './resource-home-features.component.html',
  styleUrls: ['./resource-home-features.component.scss'],
})
export class ResourceHomeFeaturesComponent {
  @Input()
  heading = '';

  @Input()
  cols = 2;

  colsString = this.cols.toString();
}
