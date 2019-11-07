import { Component, OnInit } from '@angular/core';
import 'ag-grid-enterprise';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent implements OnInit {
  defaultColDef;
  columnDefs;
  sideBar;
  statusBar;
  rowData;

  private gridApi;

  constructor() {}

  ngOnInit() {
    this.defaultColDef = {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
    };

    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        pinned: 'left',
      },
      {
        headerName: 'Name',
        field: 'name',
        pinned: 'left',
      },

      {
        headerName: 'Model',
        children: [
          {
            headerName: 'Id', 
            field: 'model.id', 
            columnGroupShow: 'closed',
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
            field: 'model.format.name', 
            filter: 'agSetColumnFilter', 
            columnGroupShow: 'closed',
          },
          {
            headerName: 'Author', 
            field: 'model.author', 
            valueFormatter: authorFormatter,
          },
          {
            headerName: 'Year', 
            field: 'model.date', 
            valueFormatter: yearFormatter, 
            filter: 'agDateColumnFilter', 
            columnGroupShow: 'closed',
          },
        ],
        marryChildren: true,
      },
      {
        headerName: 'Length (s)',
        field: 'length',
        filter: 'agNumberColumnFilter',
      },

      {
        headerName: 'Format',
        children: [
            {headerName: 'Name', field: 'format.name', filter: 'agSetColumnFilter', pinned: 'right'},
            {headerName: 'Version', field: 'format.version', filter: 'agSetColumnFilter', pinned: 'right', columnGroupShow: 'closed'},
        ],
        marryChildren: true,
      },
      {
        headerName: 'Simulator',
        children: [
            {headerName: 'Name', field: 'simulator.name', filter: 'agSetColumnFilter', pinned: 'right'},
            {headerName: 'Version', field: 'simulator.version', filter: 'agSetColumnFilter', pinned: 'right', columnGroupShow: 'closed'},
        ],
        marryChildren: true,
      },
      {
        headerName: 'Author',
        field: 'author',
        valueFormatter: authorFormatter,
        pinned: 'right',
      },
      {
        headerName: 'Date',
        headerTooltip: 'Date when the simulation was requested',
        field: 'date',
        valueFormatter: dateFormatter,
        pinned: 'right',
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
            suppressColumnFilter: false,
            suppressColumnSelectAll: false,
            suppressColumnExpandAll: false,
          }
        }
      ],
      defaultToolPanel: 'filters',
      hiddenByDefault: false,
    };

    this.statusBar = {
        statusPanels: [
            {
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

  onGridReady(params) {
    this.gridApi = params.api;

    // resize columns
    this.gridApi.sizeColumnsToFit();

    // tslint:disable-next-line:only-arrow-functions
    window.addEventListener('resize', function() {
      // tslint:disable-next-line:only-arrow-functions
      setTimeout(function() {
        this.gridApi.sizeColumnsToFit();
      });
    });

    // close tool panel
    // this.gridApi.closeToolPanel();
  }
}

function authorFormatter(params) {
  const author = params.value;
  let name:string = author.firstName;
  if (author.lastName) {
    name += ' ' + author.lastName
  }
  return name;
}

function dateFormatter(params) {
  const date:Date = new Date(Date.parse(params.value));
  return (date.getFullYear()
     + '-' + String(date.getMonth() + 1).padStart(2, '0')
     + '-' + String(date.getDate()).padStart(2, '0'));
}

function yearFormatter(params) {
  const date:Date = new Date(Date.parse(params.value));
  return date.getFullYear();
}

