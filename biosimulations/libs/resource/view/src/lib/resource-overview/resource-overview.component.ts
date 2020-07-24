import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss'],
})
export class ResourceOverviewComponent implements OnInit {
  @Input()
  imageUrl = 'https://via.placeholder.com/300';

  @Input()
  name = 'Model 001';

  @Input()
  authors = 'Bilal Shaikh and Jonathan Karr';

  @Input()
  owner = 'User';

  @Input()
  summary = 'A <b>model</b> that does something';

  @Input()
  tags: string[] = ['Cancer', 'SBML'];

  @Input()
  description!: string;

  @Input()
  attributes!: any[];

  constructor() {}

  ngOnInit(): void {}
}
