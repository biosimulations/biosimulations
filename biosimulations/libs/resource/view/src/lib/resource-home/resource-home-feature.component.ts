import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-home-feature',
  templateUrl: './resource-home-feature.component.html',
  styleUrls: ['./resource-home-feature.component.scss'],
})
export class ResourceHomeFeatureComponent implements OnInit {
  @Input()
  title: string = '';

  constructor() {}

  ngOnInit(): void { }
}
