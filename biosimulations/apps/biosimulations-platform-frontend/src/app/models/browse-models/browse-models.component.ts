import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { ModelData, ModelDataSource } from './models-datasource';
import { ModelHttpService } from '../services/model-http.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'biosimulations-browse-models',
  templateUrl: './browse-models.component.html',
  styleUrls: ['./browse-models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseModelsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ModelData>;
  dataSource!: ModelDataSource;

  data: ModelData[] = [];
  data$: any;
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
  constructor(private modelHttp: ModelHttpService) {}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnInit(): void {
    this.dataSource = new ModelDataSource(this.modelHttp);
  }
}
