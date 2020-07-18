import { Component, OnInit, Input } from '@angular/core';

interface view {
  toString(): string;
  icon(): string | null;
  link(): string | null;
}
@Component({
  selector: 'biosimulations-resource-attributes',
  templateUrl: './resource-attributes.component.html',
  styleUrls: ['./resource-attributes.component.scss'],
})
export class ResourceAttributesComponent implements OnInit {
  @Input()
  list!: view[];

  constructor() {}

  ngOnInit(): void {}
}
