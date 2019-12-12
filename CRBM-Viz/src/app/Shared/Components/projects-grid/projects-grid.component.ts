import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { ProjectService } from 'src/app/Shared/Services/project.service';
import { UtilsService } from 'src/app/Shared/Services/utils.service';
import { Format } from 'src/app/Shared/Models/format';
import { Project } from 'src/app/Shared/Models/project';
import { User } from 'src/app/Shared/Models/user';

@Component({
  selector: 'app-projects-grid',
  templateUrl: './projects-grid.component.html',
  styleUrls: ['./projects-grid.component.sass'],
})
export class ProjectsGridComponent implements OnInit {
  columnDefs;
  rowData;

  private _owner: string;

  @Input()
  set owner(value: string) {
    this._owner = value;
    this.rowData = this.projectService.list(null, value);
  }

  private _selectable: string = null;

  @Input()
  set selectable(value: string) {
    this._selectable = value;
    if (this.columnDefs) {
      if (value) {
        this.columnDefs[0]['cellRenderer'] = 'idRenderer';
      } else {
        this.columnDefs[0]['cellRenderer'] = 'idRouteRenderer';
      }
    }
  }
  get selectable(): string {
    return this._selectable;
  }

  @Output() elect = new EventEmitter();

  @Input() inTab = false;

  constructor(
    private projectService: ProjectService
    ) {
  }

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        cellRenderer: (this._selectable ? 'idRenderer' : 'idRouteRenderer'),
        minWidth: 52,
        width: 60,
        maxWidth: 70,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 150,
      },

     {
        headerName: 'Tags',
        field: 'tags',
        filter: 'agSetColumnFilter',
        valueGetter: tagsGetter,
        filterValueGetter: tagsGetter,
        valueFormatter: 'value.join(", ")',
        minWidth: 150,
      },

     {
        headerName: 'Authors',
        field: 'refs',
        valueGetter: authorGetter,
        filterValueGetter: authorGetter,
        valueFormatter: authorFormatter,
        minWidth: 150,
      },
      {
        headerName: 'Owner',
        field: 'owner',
        valueGetter: ownerGetter,
        minWidth: 150,
        hide: true,
      },

      {
        headerName: 'Access',
        field: 'access',
        filter: 'agSetColumnFilter',
        valueFormatter: capitalizeFormatter,
        minWidth: 75,
        hide: true,
      },
      {
        headerName: 'License',
        field: 'license.name',
        filter: 'agSetColumnFilter',
        minWidth: 75,
        hide: true,
      },

      {
        headerName: 'Created',
        field: 'created',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        headerName: 'Updated',
        field: 'updated',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },
    ];

    this.rowData = this.projectService.list(null, this._owner);
  }

  onSelectRow(event) {
    this.selectRow.emit(event);
  }
}

function tagsGetter(params): string[] {
  return params.data.tags;
}

function ownerGetter(params): string {
  const owner:User = params.data.owner;
  return owner.getFullName();
}

function capitalizeFormatter(params): string {
  const value:string = params.value;
  if (value) {
    return value.substring(0, 1).toUpperCase() + value.substring(1);
  } else {
    return '';
  }
}

function authorGetter(params): string[] {
  return params.data.getAuthors().map(author => author.getFullName());
}

function authorFormatter(params) {
  const value = params.value;
  return UtilsService.joinAuthorNames(value);
}

function dateFormatter(params): string {
  const date:Date = params.value;
  return (date.getFullYear()
     + '-' + String(date.getMonth() + 1).padStart(2, '0')
     + '-' + String(date.getDate()).padStart(2, '0'));
}
