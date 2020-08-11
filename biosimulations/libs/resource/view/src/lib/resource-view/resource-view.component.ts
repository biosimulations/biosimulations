import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss'],
})
export class ResourceViewComponent implements OnInit {
  @Input()
  imageUrl = 'assets/images/default-resource-images/model.svg';

  @Input()
  name: string | undefined

  @Input()
  authors = 'Bilal Shaikh and Jonathan Karr';

  @Input()
  owner = 'User';

  @Input()
  summary = 'A <b>model</b> that does something';

  @Input()
  tags: string[] | undefined;

  @Input()
  description!: string;

  @Input()
  attributes!: any[]

  @Input()
  parameters: any

  @Input()
  references: any

  @Input()
  variables: any



  constructor() {

  }

  ngOnInit(): void { }
}
