import { Component, OnInit } from '@angular/core';
import { DetailsRouteRendererComponent } from './details-route-renderer.component';
import { SearchToolPanelComponent } from './search-tool-panel.component';
import 'ag-grid-enterprise';
import {ElementRef, Renderer2, ViewChild} from '@angular/core';

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

  constructor(private rd: Renderer2) {}

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
        filter: 'agSetColumnFilter', // public, private
        valueFormatter: upperCaseFormatter,
        hide: true,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: 'agSetColumnFilter', // queued, running, finished, failed
        valueFormatter: upperCaseFormatter,
        hide: true,
      },

      {
        headerName: 'Date',
        field: 'date',
        valueGetter: dateGetter,
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
        hide: true,
      },
      {
        headerName: 'Model date',
        field: 'model.date',
        valueGetter: modelDateGetter,
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

    this.rowData = [
        {
          id: '001',
          name: 'First simulation',
          tags: ['wild type', 'normal'],

          model: {
            id: '001',
            name: 'EPSP ACh event',
            tags: ['neurotransmission', 'signaling'],
            taxon: {id: 7787, name: 'Tetronarce californica'},
            format: {name: 'SBML', version: 'L2V4'},
            identifiers: [
              {namespace: 'biomodels', id: 'BIOMD0000000001'},
              {namespace: 'doi', id: '10.1007/s004220050302'},
              {namespace: 'pubmed', id: 8983160},
            ],
            author: {id: 4, firstName: 'S', lastName: 'Edelstein'},
            date: '1996-11-01 00:00:00',
          },

          format: {name: 'SED-ML', version: 'L1V3'},
          length: 10.,

          simulator: {name: 'VCell', version: '7.1'},

          author: {id: 1, firstName: 'Yara', lastName: 'Skaf'},
          access: 'public',
          status: 'finished',
          date: '2019-11-06 00:00:00',
        },

        {
          id: '003',
          name: 'Third simulation',
          tags: ['disease', 'cancer'],

          model: {
            id: '003',
            name: 'Min Mit Oscil',
            tags: ['cell cycle', 'mitosis'],
            taxon: {id: 8292, name: 'Xenopus laevis'},
            format: {name: 'SBML', version: 'L2V4'},
            identifiers: [
              {namespace: 'biomodels', id: 'BIOMD0000000003'},
              {namespace: 'doi', id: '10.1073/pnas.88.20.9107'},
              {namespace: 'pubmed', id: 1833774},
            ],
            author: {id: 5, firstName: 'A', lastName: 'Goldbeter'},
            date: '1991-10-15 00:00:00',
          },

          format: {name: 'SED-ML', version: 'L1V2'},
          length: 10.,

          simulator: {name: 'VCell', version: '7.1'},

          author: {id: 1, firstName: 'Yara', lastName: 'Skaf'},
          access: 'private',
          status: 'queued',
          date: '2019-11-06 00:00:00',
        },

        {
          id: '006',
          name: 'Sixth simulation',
          tags: ['disease', 'diabetes'],

          model: {
            id: '006',
            name: 'Cell Cycle 6 var',
            tags: ['cell cycle'],
            taxon: {id: 33154, name: 'Homo sapiens'},
            format: {name: 'SBML', version: 'L2V4'},
            identifiers: [
              {namespace: 'biomodels', id: 'BIOMD0000000006'},
              {namespace: 'doi', id: '10.1186/1752-0509-4-92'},
              {namespace: 'pubmed', id: 20587024},
            ],
            author: {id: 5, firstName: 'J', lastName: 'Tyson'},
            date: '1991-08-15 00:00:00',
          },

          format: {name: 'SED-ML', version: 'L1V1'},
          length: 10.,

          simulator: {name: 'VCell', version: '7.1'},

          author: {id: 1, firstName: 'Bilal', lastName: 'Shaikh'},
          access: 'public',
          status: 'failed',
          date: '2019-11-06 00:00:00',
        },
      ];
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
  }
}

function tagsGetter(params) {  
  return params.data.tags;
}

function modelTagsGetter(params) {  
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

function authorGetter(params) {
  const author = params.data.author;
  let value:string = author.firstName;
  if (author.lastName) {
    value += ' ' + author.lastName;
  }
  return value;
}

function modelAuthorGetter(params) {
  const author = params.data.model.author;
  let value:string = author.firstName;
  if (author.lastName) {
    value += ' ' + author.lastName;
  }
  return value;
}

function modelFormatGetter(params) {
  const format = params.data.model.format;
  let value:string = format.name;
  if (format.version) {
    value += ' ' + format.version;
  }
  return value;
}

function formatGetter(params) {
  const format = params.data.format;
  let value:string = format.name;
  if (format.version) {
    value += ' ' + format.version;
  }
  return value;
}

function simulatorGetter(params) {
  const format = params.data.simulator;
  let value:string = format.name;
  if (format.version) {
    value += ' ' + format.version;
  }
  return value;
}

function upperCaseFormatter(params) {
  const value:string = params.value;
  return value.substring(0, 1).toUpperCase() + value.substring(1);
}

function dateGetter(params) {
  const date:Date = new Date(Date.parse(params.data.date));
  return date;
}

function modelDateGetter(params) {
  const date:Date = new Date(Date.parse(params.data.model.date));
  return date;
}

function dateFormatter(params) {
  const date:Date = params.value;
  return (date.getFullYear()
     + '-' + String(date.getMonth() + 1).padStart(2, '0')
     + '-' + String(date.getDate()).padStart(2, '0'));
}

function lengthFormatter(params) {
  const secs:number = params.value;
  let numerator:number;
  let units:string;

  if (secs >= 1) {
    if (secs >= 60) {
      if (secs >= 60 * 60) {
        if (secs >= 60 * 60 * 24) {
          if (secs >= 60 * 60 * 24 * 365) {
            numerator = 60 * 60 * 24 * 365;
            units = 'y';
          } else {
            numerator = 60 * 60 * 24;
            units = 'd';
          }
        } else {
          numerator = 60 * 60;
          units = 'h';
        }
      } else {
        numerator = 60;
        units = 'm';
      }
    } else {
      numerator = 1;
      units = 's';
    }
  } else if (secs >= 1e-3) {
    numerator = 1e-3;
    units = 'ms';
  } else if (secs >= 1e-6) {
    numerator = 1e-6;
    units = 'us';
  } else if (secs >= 1e-9) {
    numerator = 1e-9;
    units = 'ns';
  } else if (secs >= 1e-12) {
    numerator = 1e-12;
    units = 'ps';
  } else if (secs >= 1e-15) {
    numerator = 1e-15;
    units = 'fs';
  } else if (secs >= 1e-18) {
    numerator = 1e-18;
    units = 'as';
  } else if (secs >= 1e-21) {
    numerator = 1e-21;
    units = 'zs';
  } else {
    numerator = 1e-24;
    units = 'ys';
  }
  return Math.round(secs / numerator) + ' ' + units;
}

