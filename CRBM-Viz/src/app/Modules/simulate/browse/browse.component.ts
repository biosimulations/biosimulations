import { Component, OnInit } from '@angular/core';
import { DetailsRouteRendererComponent } from './details-route-renderer.component';
import { SearchToolPanelComponent } from './search-tool-panel.component';
import 'ag-grid-enterprise';
import { ElementRef, ViewChild } from '@angular/core';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { SimulationStatus } from 'src/app/Shared/Enums/simulation-status';
import { Format } from 'src/app/Shared/Models/format';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { User } from 'src/app/Shared/Models/user';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent implements OnInit {
  icons;
  frameworkComponents;
  defaultColDef;
  columnDefs;
  sideBar;
  statusBar;
  rowData;
  @ViewChild('searchGrid', { read: ElementRef, static: true }) searchGrid: ElementRef;

  private gridApi;

  constructor(private simulationService: SimulationService) {}

  ngOnInit() {    
    this.icons = {
      search: `<mat-icon
        aria-hidden="false"
        aria-label="Search icon"
        class="icon mat-icon material-icons search-tool-panel-icon"
        role="img"
        >search</mat-icon>`,
    };

    this.frameworkComponents = {
      detailsRouteRenderer: DetailsRouteRendererComponent,
      searchToolPanel: SearchToolPanelComponent,
    }

    this.defaultColDef = {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
        suppressMenu: true,
    };

    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        cellRenderer: 'detailsRouteRenderer',
        minWidth: 52,
        width: 60,
        maxWidth: 70,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Name',
        field: 'name',
      },
      {
        headerName: 'Model',
        field: 'model.name',
      },

      {
        headerName: 'Tags',        
        field: 'tags',
        filter: 'agSetColumnFilter',
        valueGetter: tagsGetter,
        filterValueGetter: tagsGetter,
        valueFormatter: setFormatter,
        hide: true,
      },
      {
        headerName: 'Model tags',
        field: 'model.tags',
        filter: 'agSetColumnFilter',
        valueGetter: modelTagsGetter,
        filterValueGetter: modelTagsGetter,
        valueFormatter: setFormatter,
        hide: true,
      },
      {
        headerName: 'Taxon',
        field: 'model.taxon.name',
        filter: 'agSetColumnFilter',
        hide: true,
      },
      {
        headerName: 'Length (s)',
        field: 'length',        
        valueFormatter: lengthFormatter,
        filter: 'agNumberColumnFilter',
        hide: true,
      },
      
      {
        headerName: 'Format',
        field: 'format',
        valueGetter: formatGetter,        
        filter: 'agSetColumnFilter',
        hide: true,
      },
      {
        headerName: 'Simulator',
        field: 'simulator',
        valueGetter: simulatorGetter,        
        filter: 'agSetColumnFilter',
        hide: true,
      },
      {
        headerName: 'Model format',
        field: 'model.format',
        valueGetter: modelFormatGetter,        
        filter: 'agSetColumnFilter',
        hide: true,
      },

      {
        headerName: 'Author',
        field: 'author',
        valueGetter: authorGetter,
        hide: false,
      },
      {
        headerName: 'Model author',
        field: 'model.author',        
        valueGetter: modelAuthorGetter,
        hide: true,
      },

      {
        headerName: 'Access',
        field: 'access',
        filter: 'agSetColumnFilter',
        valueFormatter: accessFormatter,
        hide: true,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: 'agSetColumnFilter',
        valueFormatter: statusFormatter,
        hide: true,
      },

      {
        headerName: 'Date',
        field: 'date',
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        hide: true,
      },
      {
        headerName: 'Model date',
        field: 'model.date',
        valueFormatter: dateFormatter,      
        filter: 'agDateColumnFilter',
        hide: true,
      },
    ];

    // TODO: implement custom tool panel that displays number of matches to each facet
    // TODO: implement custom tool panel with inverted filtering behavior (facet selection is positive rather than negative)
    // TODO: connect values of filters to database
    this.sideBar = {
      toolPanels: [
        {
          id: 'search',
          labelDefault: 'Search',
          labelKey: 'searchToolPanel',
          iconKey: 'search',
          toolPanel: 'searchToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressSideButtons: false,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
          }
        }
      ],
      defaultToolPanel: 'search',
      hiddenByDefault: false,
    };

    this.statusBar = {
        statusPanels: [
            {
              key: 'counts',
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            }
        ]
    };

    this.rowData = this.simulationService.getSimulations();
  }

  onGridReady(event) {
    this.gridApi = event.api;

    const statusPanel = this.gridApi.getStatusPanel('counts');
    statusPanel.eLabel.innerHTML = 'Simulations';
    statusPanel.textContent = 'Simulations';
  }

  onFirstDataRendered(event) {
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
  }

  onColumnVisible(event) {
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
  }

  onGridSizeChanged(event) {
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
  }

  onToolPanelVisibleChanged(event) {
    this.gridApi = event.api;
    if (this.gridApi.isToolPanelShowing()) {
      this.searchGrid.nativeElement.classList.add('tool-panel-open');
    } else {
      this.searchGrid.nativeElement.classList.remove('tool-panel-open');
    }
    this.gridApi.sizeColumnsToFit();
  }
}

function tagsGetter(params): string[] {  
  return params.data.tags;
}

function modelTagsGetter(params): string[] {  
  return params.data.model.tags;
}

function setFormatter(params) {  
  const value = params.value;
  if (value instanceof Array) {
    return value.join(', ');
  } else {
    return value;
  }
}

function authorGetter(params): string {
  const author:User = params.data.author;
  return author.getFullName();
}

function modelAuthorGetter(params): string {
  const author:User = params.data.model.author;
  return author.getFullName();
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
  const format:Format = params.data.simulator;
  return format.getFullName();
}

function accessFormatter(params): string {
  const value:AccessLevel = params.value;
  const valueStr: string = AccessLevel[value];
  return valueStr.substring(0, 1).toUpperCase() + valueStr.substring(1);
}

function statusFormatter(params): string {
  const value:SimulationStatus = params.value;
  const valueStr: string = SimulationStatus[value];
  return valueStr.substring(0, 1).toUpperCase() + valueStr.substring(1);
}

function dateFormatter(params): string {
  const date:Date = params.value;
  return (date.getFullYear()
     + '-' + String(date.getMonth() + 1).padStart(2, '0')
     + '-' + String(date.getDate()).padStart(2, '0'));
}

function lengthFormatter(params): string {
  const secs:number = params.value;
  return Simulation.getHumanReadableTime(secs);
}
