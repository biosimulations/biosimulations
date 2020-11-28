import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-home-feature',
  templateUrl: './resource-home-feature.component.html',
  styleUrls: ['./resource-home-feature.component.scss'],
})
export class ResourceHomeFeatureComponent {
  @Input()
  heading = '';
}
