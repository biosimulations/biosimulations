import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { UtilsService } from 'src/app/Shared/Services/utils.service';
import { Format } from 'src/app/Shared/Models/format';
import { Simulator } from 'src/app/Shared/Models/simulator';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { User } from 'src/app/Shared/Models/user';

@Component({
  selector: 'app-simulations-grid',
  templateUrl: './simulations-grid.component.html',
  styleUrls: ['./simulations-grid.component.sass'],
})
export class SimulationsGridComponent implements OnInit {
  @Input() showOwner = true;
  @Input() showStatus = false;

  columnDefs;
  rowData;

  private _owner: string;

  @Input()
  set owner(value: string) {
    this._owner = value;
    this.rowData = this.simulationService.list(null, value);
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

  @Output() onSelect = new EventEmitter();

  @Input() inTab = false;

  constructor(
    private simulationService: SimulationService
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
        headerName: 'Model',
        field: 'model.name',
        minWidth: 150,
      },

      {
        headerName: 'Tags',
        field: 'tags',
        filter: 'agSetColumnFilter',
        valueGetter: tagsGetter,
        filterValueGetter: tagsGetter,
        valueFormatter: setFormatter,
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Model tags',
        field: 'model.tags',
        filter: 'agSetColumnFilter',
        valueGetter: modelTagsGetter,
        filterValueGetter: modelTagsGetter,
        valueFormatter: setFormatter,
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Taxon',
        field: 'model.taxon.name',
        valueGetter: taxonGetter,
        filterValueGetter: taxonGetter,
        filter: 'agSetColumnFilter',
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Model changes',
        field: 'modelParameterChanges',
        valueGetter: numModelParameterChangesGetter,
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Start time',
        field: 'startTime',
        valueFormatter: this.timeFormatter,
        filter: 'agNumberColumnFilter',
        minWidth: 75,
        hide: true,
      },
      {
        headerName: 'End time',
        field: 'endTime',
        valueFormatter: this.timeFormatter,
        filter: 'agNumberColumnFilter',
        minWidth: 75,
        hide: true,
      },
      {
        headerName: 'Length',
        field: 'length',
        valueFormatter: this.timeFormatter,
        filter: 'agNumberColumnFilter',
        minWidth: 75,
        hide: true,
      },
      {
        headerName: 'Timepoints',
        field: 'numTimePoints',
        filter: 'agNumberColumnFilter',
        minWidth: 75,
        hide: true,
      },

      {
        headerName: 'Framework',
        field: 'model.framework.name',
        filter: 'agSetColumnFilter',
        minWidth: 125,
        hide: true,
      },
      {
        headerName: 'Algorithm',
        field: 'algorithm.name',
        filter: 'agSetColumnFilter',
        minWidth: 125,
        hide: true,
      },
      // {
      //   headerName: 'Algorithm parameter changes',
      //   field: 'algorithmParameterChanges',
      //   minWidth: 125,
      //   hide: true,
      // },
      {
        headerName: 'Format',
        field: 'format',
        valueGetter: formatGetter,
        filter: 'agSetColumnFilter',
        minWidth: 125,
        hide: true,
      },
      {
        headerName: 'Simulator',
        field: 'simulator',
        valueGetter: simulatorGetter,
        filter: 'agSetColumnFilter',
        minWidth: 125,
        hide: true,
      },
      {
        headerName: 'Model format',
        field: 'model.format',
        valueGetter: modelFormatGetter,
        filter: 'agSetColumnFilter',
        minWidth: 125,
        hide: true,
      },

      {
        headerName: 'Parent',
        field: 'parent.name',
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Authors',
        field: 'refs',
        valueGetter: authorGetter,
        filterValueGetter: authorGetter,
        valueFormatter: authorFormatter,
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Owner',
        field: 'owner',
        valueGetter: ownerGetter,
        minWidth: 150,
        hide: !this.showOwner,
      },
      {
        headerName: 'Model authors',
        field: 'model.refs',
        valueGetter: modelAuthorGetter,
        filterValueGetter: modelAuthorGetter,
        valueFormatter: authorFormatter,
        minWidth: 150,
        hide: true,
      },
      {
        headerName: 'Model owner',
        field: 'model.owner',
        valueGetter: modelOwnerGetter,
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
        headerName: 'Model license',
        field: 'model.license.name',
        filter: 'agSetColumnFilter',
        minWidth: 75,
        hide: true,
      },

      {
        headerName: 'Status',
        field: 'status',
        filter: 'agSetColumnFilter',
        valueFormatter: capitalizeFormatter,
        minWidth: 75,
        hide: !this.showStatus,
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

      {
        headerName: 'Start date',
        field: 'startDate',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        headerName: 'End date',
        field: 'endDate',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        headerName: 'Wall time',
        field: 'wallTime',
        valueFormatter: this.timeFormatter,
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        hide: true,
      },

      {
        headerName: 'Model created',
        field: 'model.created',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        minWidth: 100,
        hide: true,
      },

      // outLog
      // errLog
    ];

    this.rowData = this.simulationService.list(null, this._owner);
  }

  timeFormatter(params): string {
    const secs:number = params.value;
    return UtilsService.formatTimeForHumans(secs);
  }

  select(event) {
    this.onSelect.emit(event)
  }
}

function tagsGetter(params): string[] {
  return params.data.tags;
}

function modelTagsGetter(params): string[] {
  return params.data.model.tags;
}

function taxonGetter(params): string {
  return params.data.model.taxon.getShortName();
}

function setFormatter(params) {
  const value = params.value;
  return value.join(', ');
}

function numModelParameterChangesGetter(params): number {
  return params.data.modelParameterChanges.length;
}

function ownerGetter(params): string {
  const owner:User = params.data.owner;
  return owner.getFullName();
}

function modelOwnerGetter(params): string {
  const owner:User = params.data.model.owner;
  return owner.getFullName();
}

function modelFormatGetter(params): string {
  const format:Format = params.data.model.format;
  return format.getFullName();
}

function formatGetter(params): string {
  const format:Format = params.data.format;
  return format.getFullName();
}

function simulatorGetter(params): string {
  const simulator:Simulator = params.data.simulator;
  return simulator.getFullName();
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

function modelAuthorGetter(params): string[] {
  return params.data.model.getAuthors().map(author => author.getFullName());
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
