import { urls } from '@biosimulations/config/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ISimulation, isUnknownSimulation } from '../../../datamodel';
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
import { UtilsService } from '@biosimulations/shared/services';

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
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return ['/simulations', simulation.id];
        }
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
      getter: (simulation: ISimulation): string => {
        return simulation.name || 'N/A';
      },
    },
    {
      id: 'simulator',
      heading: 'Simulator',
      getter: (simulation: ISimulation): string => {
        if (simulation.simulator) {
          return simulation.simulator + ' ' + simulation.simulatorVersion;
        } else {
          return 'N/A';
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (simulation: ISimulation): string | null => {
        if (simulation.simulator) {
          return `${this.config.simulatorsAppUrl}simulators/${simulation.simulator}/${simulation.simulatorVersion}`;
        } else {
          return null;
        }
      },
      minWidth: 34,
      show: false,
    },
    {
      id: 'cpus',
      heading: 'CPUs',
      getter: (simulation: ISimulation): number | string => {
        if (simulation.cpus) {
          return simulation.cpus;
        } else {
          return NaN;
        }
      },
      formatter: (value: number): string => {
        if (value) {
          return value.toString();
        } else {
          return 'N/A';
        }
      },
      stackedFormatter: (value: number): string => {
        if (value) {
          return value.toString();
        } else {
          return 'N/A';
        }
      },
      filterType: ColumnFilterType.number,
      minWidth: 34,
      show: false,
    },
    {
      id: 'memory',
      heading: 'RAM',
      getter: (simulation: ISimulation): number => {
        if (simulation.memory) {
          return simulation.memory;
        } else {
          return NaN;
        }
      },
      formatter: (valueGB: number): string => {
        if (valueGB) {
          return valueGB.toFixed(2) + ' GB';
        } else {
          return 'N/A';
        }
      },
      stackedFormatter: (valueGB: number): string => {
        if (valueGB) {
          return valueGB.toFixed(2) + ' GB';
        } else {
          return 'N/A';
        }
      },
      filterType: ColumnFilterType.number,
      minWidth: 34,
      show: false,
    },
    {
      id: 'maxTime',
      heading: 'Max time',
      getter: (simulation: ISimulation): number => {
        if (simulation.maxTime) {
          return simulation.maxTime;
        } else {
          return NaN;
        }
      },
      formatter: (valueMin: number): string => {
        if (valueMin) {
          return SimulationStatusService.formatTime(
            null,
            valueMin * 60,
          ) as string;
        } else {
          return 'N/A';
        }
      },
      stackedFormatter: (valueMin: number): string => {
        if (valueMin) {
          return SimulationStatusService.formatTime(
            'N/A',
            valueMin * 60,
          ) as string;
        } else {
          return 'N/A';
        }
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
      rightIcon: (simulation: ISimulation): string | null => {
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
      getter: (simulation: ISimulation): number | null => {
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
      formatter: (value: Date | undefined | null): string => {
        if (value) {
          return UtilsService.getDateString(value);
        } else {
          return 'N/A';
        }
      },
      toolTipFormatter: (value: Date | undefined | null): string => {
        if (value) {
          return UtilsService.getDateString(value);
        } else {
          return 'N/A';
        }
      },
      filterType: ColumnFilterType.date,
      minWidth: 78,
      maxWidth: 78,
    },
    {
      id: 'updated',
      heading: 'Last updated',
      key: 'updated',
      formatter: (value: Date | undefined | undefined): string => {
        if (value) {
          return UtilsService.getDateString(value);
        } else {
          return 'N/A';
        }
      },
      toolTipFormatter: (value: Date | undefined | null): string => {
        if (value) {
          return UtilsService.getDateString(value);
        } else {
          return 'N/A';
        }
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
      formatter: (value: boolean | undefined | null): string => {
        if (value === undefined || value === null) {
          return 'N/A';
        } else {
          return value ? 'Yes' : 'No';
        }
      },
      minWidth: 134,
      center: true,
      show: false,
    },
    {
      id: 'visualize',
      heading: 'Viz',
      key: 'status',
      getter: (simulation: ISimulation): boolean | null => {
        return (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        );
      },
      center: true,
      leftIcon: 'chart',
      leftIconTitle: (simulation: ISimulation): string | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return 'Viz';
        }
      },
      leftAction: ColumnActionType.routerLink,
      leftRouterLink: (simulation: ISimulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        ) {
          return ['/simulations', simulation.id, '#tab=design-viz'];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
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
          return 'Visualize results';
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
      getter: (simulation: ISimulation): boolean => {
        return (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        );
      },
      center: true,
      leftIcon: 'download',
      leftIconTitle: (simulation: ISimulation): string | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return 'Export';
        }
      },
      leftAction: ColumnActionType.href,
      leftHref: (simulation: ISimulation): string | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        ) {
          return `${urls.dispatchApi}download/result/${simulation.id}`;
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (simulation: ISimulation): string | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(
            simulation.status,
          ) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
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
          return 'Download results';
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
      leftIconTitle: (simulation: ISimulation): string | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return 'Log';
        }
      },
      leftAction: ColumnActionType.routerLink,
      leftRouterLink: (simulation: ISimulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusCompleted(simulation.status)
        ) {
          return ['/simulations', simulation.id, '#tab=log'];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusCompleted(simulation.status)
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
        if (SimulationStatusService.isSimulationStatusCompleted(status)) {
          return 'View logs';
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
        const aVal = SimulationStatusService.isSimulationStatusCompleted(a)
          ? 0
          : 1;
        const bVal = SimulationStatusService.isSimulationStatusCompleted(b)
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
      key: 'status',
      center: true,
      leftIcon: 'redo',
      leftIconTitle: (simulation: ISimulation): string | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return 'Rerun';
        }
      },
      leftAction: ColumnActionType.click,
      leftClick: (
        simulation: ISimulation,
      ): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
            const queryParams: any = {
              projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
              simulator: simulation.simulator,
              simulatorVersion: simulation.simulatorVersion,
              runName: simulation.name + ' (rerun)',
            };
            this.router.navigate(['/run'], { queryParams: queryParams });
          };
        }
      },
      centerAction: ColumnActionType.click,
      centerClick: (
        simulation: ISimulation,
      ): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
            const queryParams: any = {
              projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
              simulator: simulation.simulator,
              simulatorVersion: simulation.simulatorVersion,
              runName: simulation.name + ' (rerun)',
            };
            this.router.navigate(['/run'], { queryParams: queryParams });
          };
        }
      },
      formatter: (status: SimulationRunStatus): null => {
        return null;
      },
      stackedFormatter: (status: SimulationRunStatus): string => {
        if (status === undefined || status === null) {
          return 'N/A';
        } else {
          return 'Rerun project (e.g., with another simulation tool)';
        }
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
      getter: (simulation: ISimulation): ISimulation => {
        return simulation;
      },
      center: true,
      leftIcon: 'share',
      leftIconTitle: (simulation: ISimulation): string | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return 'Click to copy URL to clipboard';
        }
      },
      leftAction: ColumnActionType.click,
      leftClick: (
        simulation: ISimulation,
      ): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
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
          };
        }
      },
      centerAction: ColumnActionType.click,
      centerClick: (
        simulation: ISimulation,
      ): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
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
          };
        }
      },
      formatter: (simulation: ISimulation): null => {
        return null;
      },
      stackedFormatter: (simulation: ISimulation): string => {
        if (isUnknownSimulation(simulation)) {
          return 'N/A';
        } else {
          return (
            window.location.protocol +
            '//' +
            window.location.host +
            '/simulations/' +
            simulation.id
          );
        }
      },
      minWidth: 38,
      maxWidth: 38,
      filterable: false,
      sortable: false,
      show: true,
      showStacked: true,
    },
    {
      id: 'publish',
      heading: 'Pub',
      key: 'status',
      center: true,
      leftIcon: 'publish',
      leftIconTitle: (simulation: ISimulation): string | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return 'Click to copy URL to clipboard';
        }
      },
      leftAction: ColumnActionType.routerLink,
      leftRouterLink: (simulation: ISimulation): string[] | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return ['/simulations', simulation.id, 'publish'];
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return ['/simulations', simulation.id, 'publish'];
        }
      },
      formatter: (status: SimulationRunStatus): null => {
        return null;
      },
      stackedFormatter: (status: SimulationRunStatus): string => {
        if (status === undefined || status === null) {
          return 'N/A';
        } else {
          return 'Publish simulation (e.g., with another simulation tool)';
        }
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
      leftClick: (
        simulation: ISimulation,
      ): ((simulation: ISimulation) => void) => {
        return (simulation: ISimulation): void => {
          this.removeSimulations(simulation);
        };
      },
      centerAction: ColumnActionType.click,
      centerClick: (
        simulation: ISimulation,
      ): ((simulation: ISimulation) => void) => {
        return (simulation: ISimulation): void => {
          this.removeSimulations(simulation);
        };
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
  simulations!: Observable<ISimulation[]>;

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

  getStackedHeading(simulation: ISimulation): string {
    return (simulation.name || 'N/A') + ' (' + simulation.id + ')';
  }

  getStackedHeadingMoreInfoRouterLink(simulation: ISimulation): string[] | null {
    if (isUnknownSimulation(simulation)) {
      return null;
    } else {
      return ['/simulations', simulation.id];
    }
  }

  exportSimulations(): void {
    const simulations = this.simulationService.getSimulations();
    // Use the take operator to make sure that we don't download every time the observable emits
    simulations.pipe(take(1)).subscribe((sims: ISimulation[]) => {
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

  removeSimulations(simulation?: ISimulation): void {
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
      exampleSimulationsJson as unknown[] as ISimulation[];
    this.simulationService.storeExistingExternalSimulations(exampleSimulations);
    return exampleSimulations.length;
  }
}
