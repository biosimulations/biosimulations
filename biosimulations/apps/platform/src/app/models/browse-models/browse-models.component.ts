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
  displayedColumns: any[] = [
    { id: 'id', show: true, minWidth: 130, maxWidth: null, nowrap: true },
    { id: 'name', show: true, minWidth: null, maxWidth: null, nowrap: false },
    { id: 'taxon', show: true, minWidth: 75, maxWidth: null, nowrap: false },
    { id: 'tags', show: true, minWidth: null, maxWidth: null, nowrap: false },
    {
      id: 'framework',
      show: true,
      minWidth: 77,
      maxWidth: null,
      nowrap: false,
    },
    {
      id: 'format',
      show: false,
      minWidth: null,
      maxWidth: null,
      nowrap: false,
    },
    {
      id: 'authors',
      show: true,
      minWidth: null,
      maxWidth: null,
      nowrap: false,
    },
    { id: 'owner', show: false, minWidth: null, maxWidth: null, nowrap: false },
    { id: 'license', width: 1, minWidth: 96, maxWidth: null, nowrap: false },
    { id: 'created', show: false, minWidth: 60, maxWidth: null, nowrap: false },
    { id: 'updated', show: true, minWidth: 60, maxWidth: null, nowrap: false },
  ];
  columnsToDisplay: string[] = this.displayedColumns
    .filter((col) => col.show)
    .map((col) => col.id);
  initCheckbox: { [key: string]: boolean } = {};
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
    this.displayedColumns.map(
      (value: any) => (this.initCheckbox[value.id] = value.show),
    );

    this.isLoading = this.dataSource.isLoading$();
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  handleChange(checked: boolean, columnId: string) {
    if (checked) {
      for (let iColumn = 0; iColumn < this.displayedColumns.length; iColumn++) {
        if (this.displayedColumns[iColumn].id === columnId) {
          this.columnsToDisplay.splice(iColumn, 0, columnId);
          break;
        }
      }
    }
    if (!checked) {
      this.columnsToDisplay.splice(this.columnsToDisplay.indexOf(columnId), 1);
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
