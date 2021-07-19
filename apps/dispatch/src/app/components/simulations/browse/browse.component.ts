import { urls } from '@biosimulations/config/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Simulation } from '../../../datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
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
import { environment } from '@biosimulations/shared/environments';
import exampleSimulationsDevJson from './example-simulations.dev.json';
import exampleSimulationsOrgJson from './example-simulations.org.json';
import { debounceTime, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackBarDuration } from '@biosimulations/config/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSimulationsDialogComponent } from './delete-simulations-dialog.component';

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
      minWidth: 205,
      maxWidth: 205,
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
      id: 'cpus',
      heading: 'CPUs',
      getter: (simulation: Simulation): number => {
        return simulation.cpus || 1;
      },
      filterType: ColumnFilterType.number,
      minWidth: 34,
      show: false,
    },
    {
      id: 'memory',
      heading: 'RAM',
      getter: (simulation: Simulation): number => {
        return simulation.memory || 8;
      },
      formatter: (valueGB: number): string => {
        return valueGB.toFixed(2) + ' GB';
      },
      stackedFormatter: (valueGB: number): string => {
        return valueGB.toFixed(2) + ' GB';
      },
      filterType: ColumnFilterType.number,
      minWidth: 34,
      show: false,
    },
    {
      id: 'maxTime',
      heading: 'Max time',
      getter: (simulation: Simulation): number => {
        return simulation.maxTime || 20;
      },
      formatter: (valueMin: number): string => {
        return SimulationStatusService.formatTime(
          null,
          valueMin * 60,
        ) as string;
      },
      stackedFormatter: (valueMin: number): string => {
        return SimulationStatusService.formatTime(
          'N/A',
          valueMin * 60,
        ) as string;
      },
      filterType: ColumnFilterType.number,
      minWidth: 34,
      show: false,
    },
    {
      id: 'status',
      heading: 'Status',
      key: 'status',
      formatter: (value: SimulationRunStatus): string => {
        return SimulationStatusService.getSimulationStatusMessage(value, false);
      },
      filterFormatter: (value: SimulationRunStatus): string => {
        return SimulationStatusService.getSimulationStatusMessage(value, true);
      },
      rightIcon: (simulation: Simulation): string | null => {
        if (
          SimulationStatusService.isSimulationStatusRunning(simulation.status)
        ) {
          return 'spinner';
        } else {
          return null;
        }
      },
      comparator: (
        a: SimulationRunStatus,
        b: SimulationRunStatus,
        sign: number,
      ): number => {
        const aVal = SimulationStatusService.getSimulationStatusOrder(a);
        const bVal = SimulationStatusService.getSimulationStatusOrder(b);
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
      minWidth: 75,
      maxWidth: 75,
    },
    /*
    {
      id: 'runtime',
      heading: 'Runtime',
      key: 'runtime',
      //formatter: SimulationStatusService.formatRuntime.bind(null),
      getter: (simulation: Simulation): number | null => {
        if (simulation.runtime == null || simulation.runtime === undefined) {
          return null;
        } else {
          return simulation.runtime;
        }
      },
      formatter: (valueSec: number | null): string | null => {
        return SimulationStatusService.formatTime(null, valueSec);
      },
      stackedFormatter: (valueSec: number | null): string => {
        return SimulationStatusService.formatTime('N/A', valueSec) as string;
      },
      filterType: ColumnFilterType.number,
      show: false,
    },
    */
    {
      id: 'submitted',
      heading: 'Submitted',
      key: 'submitted',
      formatter: (value: Date): string => {
        return (
          value.getFullYear().toString() +
          '-' +
          (value.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          value.getDate().toString().padStart(2, '0')
        );
      },
      toolTipFormatter: (value: Date): string => {
        return (
          value.getFullYear().toString() +
          '-' +
          (value.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          value.getDate().toString().padStart(2, '0') +
          ' ' +
          value.getHours().toString().padStart(2, '0') +
          ':' +
          value.getMinutes().toString().padStart(2, '0') +
          ':' +
          value.getSeconds().toString().padStart(2, '0')
        );
      },
      filterType: ColumnFilterType.date,
      minWidth: 78,
      maxWidth: 78,
    },
    {
      id: 'updated',
      heading: 'Last updated',
      key: 'updated',
      formatter: (value: Date): string => {
        return (
          value.getFullYear().toString() +
          '-' +
          (value.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          value.getDate().toString().padStart(2, '0')
        );
      },
      toolTipFormatter: (value: Date): string => {
        return (
          value.getFullYear().toString() +
          '-' +
          (value.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          value.getDate().toString().padStart(2, '0') +
          ' ' +
          value.getHours().toString().padStart(2, '0') +
          ':' +
          value.getMinutes().toString().padStart(2, '0') +
          ':' +
          value.getSeconds().toString().padStart(2, '0')
        );
      },
      filterType: ColumnFilterType.date,
      minWidth: 78,
      maxWidth: 78,
      show: false,
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
      heading: 'Viz',
      key: 'status',
      getter: (simulation: Simulation): boolean => {
        return (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize > 0
        );
      },
      center: true,
      leftIcon: 'chart',
      leftAction: ColumnActionType.routerLink,
      leftRouterLink: (simulation: Simulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize > 0
        ) {
          return ['/simulations', simulation.id, '#tab=design-viz'];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: Simulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize > 0
        ) {
          return ['/simulations', simulation.id, '#tab=design-viz'];
        } else {
          return null;
        }
      },
      formatter: (hasReports: boolean): null => {
        return null;
      },
      stackedFormatter: (hasReports: boolean): string | null => {
        if (hasReports) {
          return 'visualize results';
        } else {
          return 'N/A';
        }
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      comparator: (a: boolean, b: boolean, sign: number): number => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      },
    },
    {
      id: 'download',
      heading: 'Export',
      key: 'status',
      getter: (simulation: Simulation): boolean => {
        return (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize > 0
        );
      },
      center: true,
      leftIcon: 'download',
      leftAction: ColumnActionType.href,
      leftHref: (simulation: Simulation): string | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize > 0
        ) {
          return `${urls.dispatchApi}download/result/${simulation.id}`;
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (simulation: Simulation): string | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize > 0
        ) {
          return `${urls.dispatchApi}download/result/${simulation.id}`;
        } else {
          return null;
        }
      },
      formatter: (hasReports: boolean): null => {
        return null;
      },
      stackedFormatter: (hasReports: boolean): string | null => {
        if (hasReports) {
          return 'download results';
        } else {
          return 'N/A';
        }
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      comparator: (a: boolean, b: boolean, sign: number): number => {
        if (a > b) return -1;
        if (a < b) return 1;
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
        if (
          !SimulationStatusService.isSimulationStatusRunning(simulation.status)
        ) {
          return ['/simulations', simulation.id, '#tab=log'];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: Simulation): string[] | null => {
        if (
          !SimulationStatusService.isSimulationStatusRunning(simulation.status)
        ) {
          return ['/simulations', simulation.id, '#tab=log'];
        } else {
          return null;
        }
      },
      formatter: (status: SimulationRunStatus): null => {
        return null;
      },
      stackedFormatter: (status: SimulationRunStatus): string | null => {
        if (!SimulationStatusService.isSimulationStatusRunning(status)) {
          return 'view logs';
        } else {
          return 'N/A';
        }
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      comparator: (
        a: SimulationRunStatus,
        b: SimulationRunStatus,
        sign: number,
      ): number => {
        const aVal = !SimulationStatusService.isSimulationStatusRunning(a)
          ? 0
          : 1;
        const bVal = !SimulationStatusService.isSimulationStatusRunning(b)
          ? 0
          : 1;
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
    },
    {
      id: 'rerun',
      heading: 'Rerun',
      key: 'id',
      center: true,
      leftIcon: 'redo',
      leftAction: ColumnActionType.click,
      leftClick: (simulation: Simulation): void => {
        const queryParams: any = {
          projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
          simulator: simulation.simulator,
          simulatorVersion: simulation.simulatorVersion,
          runName: simulation.name + ' (rerun)',
        };
        this.router.navigate(['/run'], {queryParams: queryParams});
      },
      centerAction: ColumnActionType.click,
      centerClick: (simulation: Simulation): void => {
        const queryParams: any = {
          projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
          simulator: simulation.simulator,
          simulatorVersion: simulation.simulatorVersion,
          runName: simulation.name + ' (rerun)',
        };
        this.router.navigate(['/run'], {queryParams: queryParams});
      },
      formatter: (id: string): null => {
        return null;
      },
      stackedFormatter: (id: string): string => {
        return 'Rerun simulation (e.g., with another simulation tool)';
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      show: true,
      showStacked: true,
    },
    {
      id: 'share',
      heading: 'Share',
      key: 'id',
      center: true,
      leftIcon: 'share',
      leftAction: ColumnActionType.click,
      leftClick: (simulation: Simulation): void => {
        navigator.clipboard.writeText(
          window.location.protocol +
            '//' +
            window.location.host +
            '/simulations/' +
            simulation.id,
        );
        this.snackBar.open(
          'The URL for sharing the simulation was copied to your clipboard.',
          undefined,
          {
            duration: snackBarDuration,
          },
        );
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: Simulation): string[] => {
        return ['/simulations', simulation.id];
      },
      formatter: (id: string): null => {
        return null;
      },
      stackedFormatter: (id: string): string => {
        return (
          window.location.protocol +
          '//' +
          window.location.host +
          '/simulations/' +
          id
        );
      },
      leftIconTitle: (simulation: Simulation): string => {
        return 'Click to copy URL to clipboard';
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      show: true,
      showStacked: true,
    },
    {
      id: 'remove',
      heading: 'Trash',
      key: 'id',
      center: true,
      leftIcon: 'trash',
      leftAction: ColumnActionType.click,
      leftClick: (simulation: Simulation): void => {
        this.removeSimulations(simulation);
      },
      centerAction: ColumnActionType.click,
      centerClick: (simulation: Simulation): void => {
        this.removeSimulations(simulation);
      },
      formatter: (id: string): null => {
        return null;
      },
      stackedFormatter: (id: string): string => {
        return 'Remove simulation';
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      show: true,
      showStacked: false,
    },
  ];
  simulations!: Observable<Simulation[]>;

  constructor(
    private config: ConfigService,
    private simulationService: SimulationService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    activatedRoute.queryParams.subscribe((params: Params): void => {
      if (params?.try) {
        const numSimulations = this.loadExampleSimulations();
        this.snackBar.open(
          `${numSimulations} example simulations were loaded into your list of simulations.`,
          undefined,
          {
            verticalPosition: 'top',
            duration: 10000,
          },
        );
      }
    });
  }

  ngOnInit(): void {
    this.simulations = this.simulationService
      .getSimulations()
      /*
       * / This limits rendering of the table to around 60 fps.
       * The lag is not noticible to the user, but prevents continious rendering which is very resource heavy
       * At around 20 or so simulations,the page is unresponsive without this
       */
      .pipe(debounceTime(16));
  }

  getStackedHeading(simulation: Simulation): string {
    return simulation.name + ' (' + simulation.id + ')';
  }

  getStackedHeadingMoreInfoRouterLink(simulation: Simulation): string[] {
    return ['/simulations', simulation.id];
  }

  exportSimulations(): void {
    const simulations = this.simulationService.getSimulations();
    // Use the take operator to make sure that we don't download every time the observable emits
    simulations.pipe(take(1)).subscribe((sims: Simulation[]) => {
      const blob = new Blob([JSON.stringify(sims, null, 2)], {
        type: 'application/json',
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'simulations.json';
      a.click();
    });
  }

  importSimulations(): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = (): void => {
      if (input.files == null || input.files.length === 0) {
        return;
      }
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e): void => {
        if (e.target == null || typeof e.target.result !== 'string') {
          return;
        }

        const simulations = JSON.parse(e.target.result);

        this.simulationService.storeExistingExternalSimulations(simulations);
      };
      reader.readAsText(file);
    };
    input.click();
  }

  removeSimulations(simulation?: Simulation): void {
    const dialogRef = this.dialog.open(DeleteSimulationsDialogComponent, {
      width: '350px',
      data: simulation,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean): void => {
      if (confirmed) {
        if (simulation) {
          this.simulationService.removeSimulation(simulation.id);
        } else {
          this.simulationService.removeSimulations();
        }
      }
    });
  }

  loadExampleSimulations(): number {
    const exampleSimulationsJson =
      environment.env == 'prod'
        ? exampleSimulationsOrgJson
        : exampleSimulationsDevJson;

    const exampleSimulations =
      exampleSimulationsJson as unknown[] as Simulation[];
    this.simulationService.storeExistingExternalSimulations(exampleSimulations);
    return exampleSimulations.length;
  }
}
