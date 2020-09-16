import { Component, ViewChild } from '@angular/core';
import { Simulation, SimulationStatus } from '../../../datamodel';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { TableComponent, Column, ColumnLinkType, ColumnFilterType } from '@biosimulations/shared/ui';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent {
  @ViewChild(TableComponent) table!: TableComponent;

  columns: Column[] = [
    {
      id: 'id',
      heading: "Id",
      key: 'id',
      minWidth: 34,
      filterable: false,
    },
    {
      id: 'name',
      heading: "Name",
      key: 'name',
      minWidth: 34
    },
    {
      id: 'status',
      heading: "Status",
      key: 'status',
      formatter: (value: SimulationStatus): string => {
        if (value) {
          return value.substring(0, 1).toUpperCase() + value.substring(1);
        } else {
          return value;
        }
      },
      comparator: (a: SimulationStatus, b: SimulationStatus, sign: number): number => {
        let aVal = 0;
        if (a === SimulationStatus.queued) aVal = 0;
        else if (a === SimulationStatus.started) aVal = 1;
        else if (a === SimulationStatus.succeeded) aVal = 2;
        else if (a === SimulationStatus.failed) aVal = 3;

        let bVal = 0;
        if (b === SimulationStatus.queued) bVal = 0;
        else if (b === SimulationStatus.started) bVal = 1;
        else if (b === SimulationStatus.succeeded) bVal = 2;
        else if (b === SimulationStatus.failed) bVal = 3;

        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
      minWidth: 77,
    },
    {
      id: 'runtime',
      heading: "Runtime",
      key: 'runtime',
      formatter: (value: number): string | null => {
        if (value === undefined) {
          return null;
        }

        if (value > 7 * 24 * 60 * 60) {
          return (value / (7 * 24 * 60 * 60)).toFixed(1) + ' w';

        } else if (value > 24 * 60 * 60) {
          return (value / (24 * 60 * 60)).toFixed(1) + ' d';

        } else if (value > 60 * 60) {
          return (value / (60 * 60)).toFixed(1) + ' h';

        } else if (value > 60) {
          return (value / 60).toFixed(1) + ' m';

        } else if (value > 1) {
          return (value).toFixed(1) + ' s';

        } else {
          return (value * 1000).toFixed(1) + ' ms';
        }
      },
      filterType: ColumnFilterType.number,
      show: false,
    },
    {
      id: 'submitted',
      heading: "Submitted",
      key: 'submitted',
      formatter: (value: Date): string => {
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0')
          + ' ' + value.getHours().toString().padStart(2, '0')
          + ':' + value.getMinutes().toString().padStart(2, '0')
          + ':' + value.getSeconds().toString().padStart(2, '0');
      },
      filterType: ColumnFilterType.date,
      minWidth: 140,
    },
    {
      id: 'updated',
      heading: "Last updated",
      key: 'updated',
      formatter: (value: Date): string => {
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0')
          + ' ' + value.getHours().toString().padStart(2, '0')
          + ':' + value.getMinutes().toString().padStart(2, '0')
          + ':' + value.getSeconds().toString().padStart(2, '0');
      },
      filterType: ColumnFilterType.date,
      minWidth: 140,
    },
    {
      id: 'submittedLocally',
      heading: "Submitted locally",
      key: 'submittedLocally',
      formatter: (value: boolean): string => {
        return value ? 'Yes' : 'No';
      },
      minWidth: 134,
      center: true,
      show: false,
    },
    {
      id: 'visualize',
      heading: "Visualize",
      center: true,
      leftIcon: 'chart',
      leftLinkType: ColumnLinkType.routerLink,
      leftRouterLink: (simulation: Simulation): string[] => {
        return ['/simulations', simulation.id];
      },
      minWidth: 66,
      filterable: false,
      sortable: false,
    },
    {
      id: 'download',
      heading: "Download",
      center: true,
      leftIcon: 'download',
      leftLinkType: ColumnLinkType.href,
      leftHref: (simulation: Simulation): string | null => {
        if (simulation.status === SimulationStatus.succeeded) {
          return 'download-results/' + simulation.id;
        } else {
          return null;
        }
      },
      minWidth: 66,
      filterable: false,
      sortable: false,
    },
    {
      id: 'log',
      heading: "Log",
      center: true,
      leftIcon: 'logs',
      leftLinkType: ColumnLinkType.routerLink,
      leftRouterLink: (simulation: Simulation): string[] | null => {
        if (simulation.status === SimulationStatus.succeeded || simulation.status === SimulationStatus.failed) {
          return ['/simulations', simulation.id];
        } else {
          return null;
        }
      },
      minWidth: 66,
      filterable: false,
      sortable: false,
    },
  ];

  constructor(private simulationService: SimulationService) {}

  ngAfterViewInit() {
    this.table.defaultSort = {active: 'id', direction: 'asc'};

    this.simulationService.simulations$.subscribe(
      (simulations: Simulation[]): void => {
        setTimeout(() => this.table.setData(simulations));
      }
    );
  }

  exportSimulations() {
    const simulations = [...this.simulationService.getSimulations()] as any[];
    simulations.forEach((simulation: any) => {
      simulation.submitted = simulation.submitted.getTime();
      simulation.updated = simulation.updated.getTime();
    });

    const blob = new Blob([JSON.stringify(simulations, null, 2)], {type: 'application/json'});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = 'simulations.json';
    a.click();
  }

  importSimulations() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = () => {
      if (input.files == null || input.files.length === 0) {
        return;
      }
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target == null || typeof e.target.result !== 'string') {
          return;
        }

        const simulations = JSON.parse(e.target.result);
        simulations.forEach((simulation: any) => {
          simulation.submitted = new Date(simulation.submitted);
          simulation.updated = new Date(simulation.updated);
          simulation.submittedLocally = false;
        });
        this.simulationService.setSimulations(simulations, true);
      };
      reader.readAsText(file);      
    };
    input.click();
  }
}
