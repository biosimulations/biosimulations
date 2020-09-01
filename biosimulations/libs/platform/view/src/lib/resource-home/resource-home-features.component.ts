import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-home-features',
  templateUrl: './resource-home-features.component.html',
  styleUrls: ['./resource-home-features.component.scss'],
})
export class ResourceHomeFeaturesComponent implements OnInit {
  @Input()
  heading = '';

  @Input()
  cols = 2;

  constructor() {}

  ngOnInit(): void { }
}
