import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-home',
  templateUrl: './resource-home.component.html',
  styleUrls: ['./resource-home.component.scss'],
})
export class ResourceHomeComponent implements OnInit {
  @Input()
  name: string = '';

  @Input()
  pluralName: string = '';

  @Input()
  shortName: string = '';

  @Input()
  pluralShortName: string = '';

  @Input()
  imageUrl: string = '';

  constructor() {}

  ngOnInit(): void { }
}
