import { urls } from '@biosimulations/config/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Simulation, SimulationStatus } from '../../../datamodel';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import {
  TableComponent,
  Column,
  ColumnActionType,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  @ViewChild(TableComponent) table!: TableComponent;

  columns: Column[] = [
    {
      id: 'id',
      heading: 'Id',
      key: 'id',
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: Simulation): string[] => {
        return ['/simulations', simulation.id];
      },
      minWidth: 34,
      filterable: false,
      showStacked: false,
    },
    {
      id: 'name',
      heading: 'Name',
      key: 'name',
      minWidth: 34,
    },
    {
      id: 'simulator',
      heading: 'Simulator',
      getter: (simulation: Simulation): string => {
        return simulation.simulator + ' ' + simulation.simulatorVersion;
      },
      centerAction: ColumnActionType.href,
      centerHref: (simulation: Simulation): string => {
        return `${this.config.simulatorsAppUrl}simulators/${simulation.simulator}/${simulation.simulatorVersion}`;
      },
      minWidth: 34,
      show: false,
    },
    {
      id: 'status',
      heading: 'Status',
      key: 'status',
      formatter: (value: SimulationStatus): string => {
        return SimulationStatusService.getSimulationStatusMessage(value, false);
      },
      filterFormatter: (value: SimulationStatus): string => {
        return SimulationStatusService.getSimulationStatusMessage(value, true);
      },
      comparator: (
        a: SimulationStatus,
        b: SimulationStatus,
        sign: number
      ): number => {
        const aVal = SimulationStatusService.getSimulationStatusOrder(a);
        const bVal = SimulationStatusService.getSimulationStatusOrder(b);
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
      minWidth: 77,
    },
    {
      id: 'runtime',
      heading: 'Runtime',
      key: 'runtime',
      formatter: (value: number | null | undefined): string | null => {
        if (value == null || value === undefined) {
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
          return value.toFixed(1) + ' s';
        } else {
          return (value * 1000).toFixed(1) + ' ms';
        }
      },
      stackedFormatter: (value: number | null | undefined): string => {
        if (value == null || value === undefined) {
          return 'N/A';
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
          return value.toFixed(1) + ' s';
        } else {
          return (value * 1000).toFixed(1) + ' ms';
        }
      },
      filterType: ColumnFilterType.number,
      show: false,
    },
    {
      id: 'submitted',
      heading: 'Submitted',
      key: 'submitted',
      formatter: (value: Date): string => {
        const dateVal = new Date(value);
        return (
          dateVal.getFullYear().toString() +
          '-' +
          (dateVal.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          dateVal.getDate().toString().padStart(2, '0') +
          ' ' +
          dateVal.getHours().toString().padStart(2, '0') +
          ':' +
          dateVal.getMinutes().toString().padStart(2, '0') +
          ':' +
          dateVal.getSeconds().toString().padStart(2, '0')
        );
      },
      filterType: ColumnFilterType.date,
      minWidth: 140,
    },
    {
      id: 'updated',
      heading: 'Last updated',
      key: 'updated',
      formatter: (value: Date): string => {
        const dateVal = new Date(value);
        return (
          dateVal.getFullYear().toString() +
          '-' +
          (dateVal.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          dateVal.getDate().toString().padStart(2, '0') +
          ' ' +
          dateVal.getHours().toString().padStart(2, '0') +
          ':' +
          dateVal.getMinutes().toString().padStart(2, '0') +
          ':' +
          dateVal.getSeconds().toString().padStart(2, '0')
        );
      },
      filterType: ColumnFilterType.date,
      minWidth: 140,
    },
    {
      id: 'submittedLocally',
      heading: 'Submitted locally',
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
      heading: 'Visualize',
      key: 'status',
      center: true,
      leftIcon: 'chart',
      leftAction: ColumnActionType.routerLink,
      leftRouterLink: (simulation: Simulation): string[] | null => {
        if (SimulationStatusService.isSimulationStatusSucceeded(simulation.status)) {
          return ['/simulations', simulation.id];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: Simulation): string[] | null => {
        if (SimulationStatusService.isSimulationStatusSucceeded(simulation.status)) {
          return ['/simulations', simulation.id];
        } else {
          return null;
        }
      },
      formatter: (status: SimulationStatus): null => {
        return null;
      },
      stackedFormatter: (status: SimulationStatus): string | null => {
        if (SimulationStatusService.isSimulationStatusSucceeded(status)) {
          return 'visualize results';
        } else {
          return 'N/A';
        }
      },
      minWidth: 66,
      filterable: false,
      comparator: (
        a: SimulationStatus,
        b: SimulationStatus,
        sign: number
      ): number => {
        const aVal = SimulationStatusService.isSimulationStatusSucceeded(a) ? 0 : 1;
        const bVal = SimulationStatusService.isSimulationStatusSucceeded(b) ? 0 : 1;
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
    },
    {
      id: 'download',
      heading: 'Download',
      key: 'status',
      center: true,
      leftIcon: 'download',
      leftAction: ColumnActionType.href,
      leftHref: (simulation: Simulation): string | null => {
        if (SimulationStatusService.isSimulationStatusSucceeded(simulation.status)) {
          return `${urls.dispatchApi}download/result/${simulation.id}`;
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (simulation: Simulation): string | null => {
        if (SimulationStatusService.isSimulationStatusSucceeded(simulation.status)) {
          return `${urls.dispatchApi}download/result/${simulation.id}`;
        } else {
          return null;
        }
      },
      formatter: (status: SimulationStatus): null => {
        return null;
      },
      stackedFormatter: (status: SimulationStatus): string | null => {
        if (SimulationStatusService.isSimulationStatusSucceeded(status)) {
          return 'download results';
        } else {
          return 'N/A';
        }
      },
      minWidth: 66,
      filterable: false,
      comparator: (
        a: SimulationStatus,
        b: SimulationStatus,
        sign: number
      ): number => {
        const aVal = SimulationStatusService.isSimulationStatusSucceeded(a) ? 0 : 1;
        const bVal = SimulationStatusService.isSimulationStatusSucceeded(b) ? 0 : 1;
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
    },
    {
      id: 'log',
      heading: 'Log',
      key: 'status',
      center: true,
      leftIcon: 'logs',
      leftAction: ColumnActionType.routerLink,
      leftRouterLink: (simulation: Simulation): string[] | null => {
        if (!SimulationStatusService.isSimulationStatusRunning(simulation.status)) {
          return ['/simulations', simulation.id];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: Simulation): string[] | null => {
        if (!SimulationStatusService.isSimulationStatusRunning(simulation.status)) {
          return ['/simulations', simulation.id];
        } else {
          return null;
        }
      },
      formatter: (status: SimulationStatus): null => {
        return null;
      },
      stackedFormatter: (status: SimulationStatus): string | null => {
        if (!SimulationStatusService.isSimulationStatusRunning(status)) {
          return 'view logs';
        } else {
          return 'N/A';
        }
      },
      minWidth: 66,
      filterable: false,
      comparator: (
        a: SimulationStatus,
        b: SimulationStatus,
        sign: number
      ): number => {
        const aVal = !SimulationStatusService.isSimulationStatusRunning(a) ? 0 : 1;
        const bVal = !SimulationStatusService.isSimulationStatusRunning(b) ? 0 : 1;
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
    },
  ];
  simulations!: Observable<Simulation[]>;

  constructor(private config: ConfigService, private simulationService: SimulationService) {}

  ngOnInit() {
    this.simulations = this.simulationService.simulations$;
  }

  getStackedHeading(simulation: Simulation): string {
    return simulation.name + ' (' + simulation.id + ')';
  }

  getStackedHeadingMoreInfoRouterLink(simulation: Simulation): string[] {
    return ['/simulations', simulation.id];
  }

  exportSimulations() {
    const simulations = [...this.simulationService.getSimulations()] as any[];
    simulations.forEach((simulation: any) => {
      simulation.submitted = simulation.submitted.getTime();
      simulation.updated = simulation.updated.getTime();
    });

    const blob = new Blob([JSON.stringify(simulations, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
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
