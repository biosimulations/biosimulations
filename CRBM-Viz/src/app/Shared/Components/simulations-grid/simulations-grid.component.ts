import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
// import { IdRendererGridComponent } from '../grid/id-renderer-grid.component';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { SimulationStatus } from 'src/app/Shared/Enums/simulation-status';
import { Format } from 'src/app/Shared/Models/format';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { User } from 'src/app/Shared/Models/user';

@Component({
  selector: 'app-simulations-grid',
  templateUrl: './simulations-grid.component.html',
  styleUrls: ['./simulations-grid.component.sass'],
})
export class SimulationsGridComponent implements OnInit {
  // frameworkComponents;
  private columnDefs;
  private rowData;

  constructor(private simulationService: SimulationService) {}

  ngOnInit() {    
    // this.frameworkComponents = {
    //   idRenderer: IdRendererGridComponent,
    // }

    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        cellRenderer: 'idRenderer',
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

    this.rowData = this.simulationService.getSimulations();
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
