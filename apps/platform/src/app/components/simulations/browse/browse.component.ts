import { Endpoints } from '@biosimulations/config/common';
import { PLATFORM_APP_ROUTES } from '../../../app.component';
//import { ConfigService } from '@biosimulations/config/angular';
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ISimulation, isUnknownSimulation } from '../../../datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { TableComponent, Column, ColumnActionType, ColumnFilterType } from '@biosimulations/shared/ui';
import { Observable } from 'rxjs';
import { environment } from '@biosimulations/shared/environments';
import exampleSimulationsDevJson from './example-simulations.dev.json';
import exampleSimulationsProdJson from './example-simulations.prod.json';
import { debounceTime, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSimulationsDialogComponent } from './delete-simulations-dialog.component';
import { FormatService } from '@biosimulations/shared/services';
import { ClipboardService } from '@biosimulations/shared/angular';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  private endpoints = new Endpoints();

  @ViewChild(TableComponent) public table!: TableComponent;

  @ViewChild('tableContainer', { static: false }) tableContainer: ElementRef | undefined;
  collapsed = false;

  public columns: Column[] = [
    {
      id: 'id',
      heading: 'Id',
      key: 'id',
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return ['/runs', simulation.id];
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
          return `${PLATFORM_APP_ROUTES.platformApp}simulators/${simulation.simulator}/${simulation.simulatorVersion}`;
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
      units: 'GB',
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
        if (valueMin !== null && valueMin !== undefined) {
          return FormatService.formatDuration(valueMin * 60);
        } else {
          return 'N/A';
        }
      },
      stackedFormatter: (valueMin: number): string => {
        if (valueMin !== null && valueMin !== undefined) {
          return FormatService.formatDuration(valueMin * 60);
        } else {
          return 'N/A';
        }
      },
      filterType: ColumnFilterType.number,
      units: 'min',
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
        if (SimulationStatusService.isSimulationStatusRunning(simulation.status)) {
          return 'spinner';
        } else {
          return null;
        }
      },
      comparator: (a: SimulationRunStatus, b: SimulationRunStatus, _sign: number): number => {
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
        return valueSec !== null ? SimulationStatusService.FormatService.formatDuration(valueSec) : null;
      },
      stackedFormatter: (valueSec: number | null): string => {
        return valueSec !== null ? SimulationStatusService.FormatService.formatDuration(valueSec) : 'N/A';
      },
      filterType: ColumnFilterType.number,
      units: 's',
      show: false,
    },
    */
    {
      id: 'submitted',
      heading: 'Submitted',
      key: 'submitted',
      formatter: (value: Date | undefined | null): string => {
        if (value) {
          return FormatService.formatDate(value);
        } else {
          return 'N/A';
        }
      },
      toolTipFormatter: (value: Date | undefined | null): string => {
        if (value) {
          return FormatService.formatDate(value);
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
          return FormatService.formatDate(value);
        } else {
          return 'N/A';
        }
      },
      toolTipFormatter: (value: Date | undefined | null): string => {
        if (value) {
          return FormatService.formatDate(value);
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
          SimulationStatusService.isSimulationStatusSucceeded(simulation.status) &&
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
          SimulationStatusService.isSimulationStatusSucceeded(simulation.status) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        ) {
          return ['/runs', simulation.id, '#tab=select-viz'];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(simulation.status) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        ) {
          return ['/runs', simulation.id, '#tab=select-viz'];
        } else {
          return null;
        }
      },
      formatter: (_hasReports: boolean): null => {
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
      comparator: (a: boolean, b: boolean, _sign: number): number => {
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
          SimulationStatusService.isSimulationStatusSucceeded(simulation.status) &&
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
          SimulationStatusService.isSimulationStatusSucceeded(simulation.status) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        ) {
          return this.endpoints.getRunResultsDownloadEndpoint(false, simulation.id);
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (simulation: ISimulation): string | null => {
        if (
          SimulationStatusService.isSimulationStatusSucceeded(simulation.status) &&
          simulation.resultsSize !== undefined &&
          simulation.resultsSize !== null &&
          simulation.resultsSize > 0
        ) {
          return this.endpoints.getRunResultsDownloadEndpoint(false, simulation.id);
        } else {
          return null;
        }
      },
      formatter: (_hasReports: boolean): null => {
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
      comparator: (a: boolean, b: boolean, _sign: number): number => {
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
        if (SimulationStatusService.isSimulationStatusCompleted(simulation.status)) {
          return ['/runs', simulation.id, '#tab=log'];
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (SimulationStatusService.isSimulationStatusCompleted(simulation.status)) {
          return ['/runs', simulation.id, '#tab=log'];
        } else {
          return null;
        }
      },
      formatter: (_status: SimulationRunStatus): null => {
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
      comparator: (a: SimulationRunStatus, b: SimulationRunStatus, _sign: number): number => {
        const aVal = SimulationStatusService.isSimulationStatusCompleted(a) ? 0 : 1;
        const bVal = SimulationStatusService.isSimulationStatusCompleted(b) ? 0 : 1;
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
      leftClick: (simulation: ISimulation): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
            const queryParams: any = {
              projectUrl: this.endpoints.getSimulationRunDownloadEndpoint(false, simulation.id),
              simulator: simulation.simulator,
              simulatorVersion: simulation.simulatorVersion,
              runName: simulation.name + ' (rerun)',
            };
            this.router.navigate(['/runs/new'], { queryParams: queryParams });
          };
        }
      },
      centerAction: ColumnActionType.click,
      centerClick: (simulation: ISimulation): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
            const queryParams: any = {
              projectUrl: this.endpoints.getSimulationRunDownloadEndpoint(false, simulation.id),
              simulator: simulation.simulator,
              simulatorVersion: simulation.simulatorVersion,
              runName: simulation.name + ' (rerun)',
            };
            this.router.navigate(['/runs/new'], { queryParams: queryParams });
          };
        }
      },
      formatter: (_status: SimulationRunStatus): null => {
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
      leftClick: (simulation: ISimulation): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
            const toCopy = window.location.protocol + '//' + window.location.host + '/runs/' + simulation.id;
            this.clipboardService.copyToClipboard(
              toCopy,
              'The URL for sharing the simulation was copied to your clipboard.',
            );
          };
        }
      },
      centerAction: ColumnActionType.click,
      centerClick: (simulation: ISimulation): ((simulation: ISimulation) => void) | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return (simulation: ISimulation): void => {
            const toCopy = window.location.protocol + '//' + window.location.host + '/runs/' + simulation.id;
            this.clipboardService.copyToClipboard(
              toCopy,
              'The URL for sharing the simulation was copied to your clipboard.',
            );
          };
        }
      },
      formatter: (_simulation: ISimulation): null => {
        return null;
      },
      stackedFormatter: (simulation: ISimulation): string => {
        if (isUnknownSimulation(simulation)) {
          return 'N/A';
        } else {
          return window.location.protocol + '//' + window.location.host + '/runs/' + simulation.id;
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
          return ['/runs', simulation.id, 'publish'];
        }
      },
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (simulation: ISimulation): string[] | null => {
        if (isUnknownSimulation(simulation)) {
          return null;
        } else {
          return ['/runs', simulation.id, 'publish'];
        }
      },
      formatter: (_status: SimulationRunStatus): null => {
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
      leftClick: (_simulation: ISimulation): ((simulation: ISimulation) => void) => {
        return (simulation: ISimulation): void => {
          this.removeSimulations(simulation);
        };
      },
      centerAction: ColumnActionType.click,
      centerClick: (_simulation: ISimulation): ((simulation: ISimulation) => void) => {
        return (simulation: ISimulation): void => {
          this.removeSimulations(simulation);
        };
      },
      formatter: (_id: string): null => {
        return null;
      },
      stackedFormatter: (_id: string): string => {
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
  public simulations!: Observable<ISimulation[]>;

  public constructor(
    //private config: ConfigService,
    private simulationService: SimulationService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private clipboardService: ClipboardService,
  ) {
    this.tableContainer = undefined;
    activatedRoute.queryParams.subscribe((params: Params): void => {
      if (params?.try) {
        const numSimulations = this.loadExampleSimulations();
        this.snackBar.open(`${numSimulations} example simulations were loaded into your list of simulations.`, 'Ok', {
          verticalPosition: 'top',
          duration: 10000,
        });
      }
    });
  }

  collapseTable(): void {
    this.collapsed = !this.collapsed;
  }

  public ngOnInit(): void {
    this.simulations = this.simulationService
      .getSimulations()
      /*
       * / This limits rendering of the table to around 60 fps.
       * The lag is not noticible to the user, but prevents continious rendering which is very resource heavy
       * At around 20 or so simulations,the page is unresponsive without this
       */
      .pipe(debounceTime(16));
  }

  public getStackedHeading(simulation: ISimulation): string {
    return (simulation.name || 'N/A') + ' (' + simulation.id + ')';
  }

  public getStackedHeadingMoreInfoRouterLink(simulation: ISimulation): string[] | null {
    if (isUnknownSimulation(simulation)) {
      return null;
    } else {
      return ['/runs', simulation.id];
    }
  }

  public exportSimulations(): void {
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

  public importSimulations(): void {
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

  public removeSimulations(simulation?: ISimulation): void {
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

  public loadExampleSimulations(): number {
    const exampleSimulationsJson = environment.env == 'prod' ? exampleSimulationsProdJson : exampleSimulationsDevJson;

    const exampleSimulations = exampleSimulationsJson as unknown[] as ISimulation[];
    this.simulationService.storeExistingExternalSimulations(exampleSimulations);
    return exampleSimulations.length;
  }
}
