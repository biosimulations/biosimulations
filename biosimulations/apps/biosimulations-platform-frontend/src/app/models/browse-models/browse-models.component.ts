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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
@Component({
  selector: 'biosimulations-browse-models',
  templateUrl: './browse-models.component.html',
  styleUrls: ['./browse-models.component.scss'],
  providers: [ModelDataSource],
})
export class BrowseModelsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ModelData>;
  showMenu = true;
  isLoading = of(true);

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
  constructor(public dataSource: ModelDataSource) {}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.isLoading = this.dataSource.isLoading$();
  }

  ngOnInit(): void {}
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  handleChange(checked: boolean, column: string) {
    if (checked) {
      this.columnsToDisplay.splice(
        this.displayedColumns.indexOf(column),
        0,
        column,
      );
    }
    if (!checked) {
      this.columnsToDisplay.splice(this.columnsToDisplay.indexOf(column), 1);
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.columnsToDisplay,
      event.previousIndex,
      event.currentIndex,
    );
  }
}
