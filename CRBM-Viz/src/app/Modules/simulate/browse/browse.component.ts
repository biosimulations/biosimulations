import { Component, OnInit } from '@angular/core';
import { DetailsRouteRendererComponent } from './details-route-renderer.component';
import 'ag-grid-enterprise';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent implements OnInit {
  frameworkComponents;
  defaultColDef;
  columnDefs;
  sideBar;
  statusBar;
  rowData;

  private gridApi;

  constructor() {}

  ngOnInit() {
    this.frameworkComponents = {
      detailsRouteRendererComponent: DetailsRouteRendererComponent,
    }

    this.defaultColDef = {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
    };

    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        cellRenderer: 'detailsRouteRendererComponent',
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
        children: [
          {
            headerName: 'Id',
            field: 'model.id',
            hide: true,
          },
          {
            headerName: 'Name',
            field: 'model.name',
          },
          {
            headerName: 'Taxon',
            field: 'model.taxon.name',
            filter: 'agSetColumnFilter',
          },
          {
            headerName: 'Format',
            field: 'model.format',
            valueGetter: modelFormatGetter,
            hide: true,
            filter: 'agSetColumnFilter',
          },
          {
            headerName: 'Author',
            field: 'model.author',
            valueGetter: modelAuthorGetter,
          },
          {
            headerName: 'Year',
            field: 'model.date',
            valueGetter: modelYearGetter,
            hide: true,
            filter: 'agNumberColumnFilter',
          },
        ],
        marryChildren: true,
      },
      {
        headerName: 'Length (s)',
        field: 'length',
        hide: true,
        valueFormatter: lengthFormatter,
        filter: 'agNumberColumnFilter',
      },

      {
        headerName: 'Format',
        field: 'format',
        valueGetter: formatGetter,
        hide: true,
        filter: 'agSetColumnFilter',
      },
      {
        headerName: 'Simulator',
        field: 'simulator',
        valueGetter: simulatorGetter,
        hide: true,
        filter: 'agSetColumnFilter',
      },
      {
        headerName: 'Author',
        field: 'author',
        valueGetter: authorGetter,
        hide: true,
      },
      {
        headerName: 'Date',
        headerTooltip: 'Date when the simulation was requested',
        field: 'date',
        valueGetter: dateGetter,
        valueFormatter: dateFormatter,
        hide: true,
        filter: 'agDateColumnFilter',
      },
    ];

    this.sideBar = {
      toolPanels: [
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
      defaultToolPanel: 'filters',
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
          date: '2019-11-06 00:00:00',
        },

        {
          id: '003',
          name: 'Third simulation',
          tags: ['wild type', 'normal'],

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

          format: {name: 'SED-ML', version: 'L1V3'},
          length: 10.,

          simulator: {name: 'VCell', version: '7.1'},

          author: {id: 1, firstName: 'Yara', lastName: 'Skaf'},
          date: '2019-11-06 00:00:00',
        },

        {
          id: '006',
          name: 'Sixth simulation',
          tags: ['wild type', 'normal'],

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

          format: {name: 'SED-ML', version: 'L1V3'},
          length: 10.,

          simulator: {name: 'VCell', version: '7.1'},

          author: {id: 1, firstName: 'Bilal', lastName: 'Shaikh'},
          date: '2019-11-06 00:00:00',
        },
      ];
  }

  onGridReady(event) {
    this.gridApi = event.api;

    const statusPanel = this.gridApi.getStatusPanel('counts');
    statusPanel.eLabel.innerHTML = 'Simulations';
    statusPanel.textContent = 'Simulations';

    // size columns
    this.gridApi.sizeColumnsToFit();
  }

  onFirstDataRendered(event) {
    this.gridApi.sizeColumnsToFit();
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

function dateGetter(params) {
  const date:Date = new Date(Date.parse(params.data.date));
  return date;
}
function dateFormatter(params) {
  const date:Date = params.value;
  return (date.getFullYear()
     + '-' + String(date.getMonth() + 1).padStart(2, '0')
     + '-' + String(date.getDate()).padStart(2, '0'));
}

function modelYearGetter(params) {
  const date:Date = new Date(Date.parse(params.data.model.date));
  return date.getFullYear();
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

