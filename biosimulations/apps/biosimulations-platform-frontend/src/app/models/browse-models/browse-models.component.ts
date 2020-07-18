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
import { of, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'biosimulations-browse-models',
  templateUrl: './browse-models.component.html',
  styleUrls: ['./browse-models.component.scss'],
  providers: [ModelDataSource],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseModelsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ModelData>;
  showMenu = true;
  isLoading!: Observable<boolean>;

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
  constructor(
    public dataSource: ModelDataSource,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnInit(): void {
    this.isLoading = this.dataSource.isLoading$();
  }
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

  navigate(el: ModelData) {
    const id = el.id;
    this.router.navigate(['../' + id], { relativeTo: this.route });
  }

  refresh() {
    this.dataSource.refresh();
  }
}
