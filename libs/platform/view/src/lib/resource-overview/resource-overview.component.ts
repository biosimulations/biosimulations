import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss'],
})
export class ResourceOverviewComponent {
  @Input()
  imageUrl = '';

  @Input()
  name = '';

  @Input()
  authors = '';

  @Input()
  owner = '';

  @Input()
  summary = '';

  @Input()
  tags: string[] = [''];

  @Input()
  description!: string;

  @Input()
  attributes: any[] | undefined;

  tagsDisplay!: string;

  ngOnInit() {
    this.tagsDisplay = this.tags.join(', ');
  }
}
