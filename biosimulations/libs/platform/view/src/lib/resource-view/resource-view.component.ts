import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss'],
})
export class ResourceViewComponent {
  @Input()
  imageUrl = 'assets/images/resource-banners/models.svg';

  @Input()
  name: string | undefined;

  @Input()
  authors = '';

  @Input()
  owner = '';

  @Input()
  summary = '';

  @Input()
  tags: string[] | undefined;

  @Input()
  description!: string;

  @Input()
  attributes: any[] | undefined;

  @Input()
  parameters: any;

  @Input()
  references: any;

  @Input()
  variables: any;
}
