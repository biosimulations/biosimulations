import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModelData } from './models-datasource';

@Component({
  selector: 'biosimulations-browse-models',
  templateUrl: './browse-models.component.html',
  styleUrls: ['./browse-models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseModelsComponent implements OnInit {
  data: ModelData[] = [];

  displayedColumns = [
    'id',
    'name',
    'taxon',
    'tags',
    'framework',
    'format',
    'authors',
    'owner',
    'license',
    'created',
    'updated',
  ];
  columnsToDisplay = this.displayedColumns.slice();
  constructor() {}

  ngOnInit(): void {}
}
