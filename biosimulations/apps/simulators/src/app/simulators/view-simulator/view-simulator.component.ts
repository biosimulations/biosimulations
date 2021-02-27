import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  TocSection,
  TocSectionsContainerDirective,
  Column,
  ColumnActionType,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import {
  ValueType,
  IDependentVariableTargetPattern,
} from '@biosimulations/datamodel/common';
import { ViewSimulatorService } from './view-simulator.service';
import { ConfigService } from '@biosimulations/shared/services';
import { snackBarDuration } from '@biosimulations/config/common';

import {
  ViewSimulator,
  ViewParameter,
  ViewVersion,
} from './view-simulator.interface';

@Component({
  selector: 'biosimulations-view-simulator',
  templateUrl: './view-simulator.component.html',
  styleUrls: ['./view-simulator.component.scss'],
})
export class ViewSimulatorComponent implements OnInit {
  getVersionLinkBound!: (version: ViewVersion) => string[];
  dispatchAppUrl!: string;
  dispatchAppRunUrl!: string;
  simulatorDocumentationUrl!: string | undefined;

  constructor(
    public route: ActivatedRoute,
    private simService: ViewSimulatorService,
    private cd: ChangeDetectorRef,
    private config: ConfigService,
    private snackBar: MatSnackBar,
  ) {}

  loadingSubject = new BehaviorSubject(true);
  loading$ = this.loadingSubject.asObservable()
  // TODO handler errors from simulator service
  error = false;

  simulator!: Observable<ViewSimulator>;
  id!: string;

  parametersColumns: Column[] = [
    {
      id: 'name',
      heading: 'Name',
      key: 'name',
      toolTipFormatter: (name: string): string => {
        return name;
      },
      showStacked: false,
      minWidth: 234,
    },
    {
      id: 'type',
      heading: 'Type',
      key: 'type',
      minWidth: 66,
      maxWidth: 66,
    },
    {
      id: 'value',
      heading: 'Default',
      key: 'value',
      getter: (parameter: ViewParameter): string | null => {
        return this.formatParameterVal(parameter.type, parameter.value);
      },
      minWidth: 66,
      maxWidth: 66,
    },
    {
      id: 'range',
      heading: 'Recommended range',
      key: 'range',
      getter: (parameter: ViewParameter): string | null => {
        if (parameter.range) {
          return parameter.range
            .map(this.formatParameterVal.bind(this, parameter.type))
            .join(', ');
        } else {
          return null;
        }
      },
      minWidth: 163,
      maxWidth: 163,
      filterable: false,
    },
    {
      id: 'availableSoftwareInterfaceTypes',
      heading: 'Availability',
      key: 'availableSoftwareInterfaceTypes',
      formatter: (interfaceTypes: string[] | string): string => {
        let returnVal = '';
        if (Array.isArray(interfaceTypes)) {
          returnVal = interfaceTypes.join(', ');
        } else {
          returnVal = interfaceTypes;
        }
        return returnVal.substring(0, 1).toUpperCase() + returnVal.substring(1);
      },
      toolTipFormatter: (interfaceTypes: string[]): string => {
        return interfaceTypes.join(', ');
      },
      minWidth: 163,
      maxWidth: 163,
    },
    {
      id: 'kisaoId',
      heading: 'KiSAO id',
      key: 'kisaoId',
      centerAction: ColumnActionType.href,
      centerHref: (parameter: ViewParameter): string => {
        return parameter.kisaoUrl;
      },
      showStacked: true,
      minWidth: 110,
      maxWidth: 110,
    },
  ];

  formatParameterVal(
    type: string,
    value: boolean | number | string | null,
  ): string | null {
    if (value == null) {
      return value;
    } else if (type === ValueType.boolean) {
      return value.toString();
    } else if (type === ValueType.integer || type === ValueType.float) {
      if (value === 0) {
        return '0';
      } else if (value < 1e-3 || value > 1e3) {
        const exp = Math.floor(Math.log10(value as number));
        const val = (value as number) / Math.pow(10, exp);
        let valStr: string;
        if (Math.abs((val * 1 - Math.round(val * 1)) / (val * 1)) < 1e-12) {
          valStr = val.toFixed(0);
        } else if (
          Math.abs((val * 1e1 - Math.round(val * 1e1)) / (val * 1e1)) < 1e-12
        ) {
          valStr = val.toFixed(1);
        } else if (
          Math.abs((val * 1e2 - Math.round(val * 1e2)) / (val * 1e2)) < 1e-12
        ) {
          valStr = val.toFixed(2);
        } else {
          valStr = val.toFixed(3);
        }
        return `${valStr}e${exp}`;
      } else {
        return value.toString();
      }
    } else {
      return value as string;
    }
  }

  getParameterStackedHeading(parameter: ViewParameter): string {
    return parameter.name;
  }

  getParameterStackedHeadingMoreInfoRouterLink(
    parameter: ViewParameter,
  ): string {
    return parameter.kisaoUrl;
  }

  dependentVariablesColumns: Column[] = [
    {
      id: 'variables',
      heading: 'Description',
      key: 'variables',
      toolTipFormatter: (value: string): string => {
        return value;
      },
      minWidth: 200,
    },
    {
      id: 'targetPattern',
      heading: 'Target pattern',
      key: 'targetPattern',
      toolTipFormatter: (value: string): string => {
        return value;
      },
      minWidth: 600,
    },
  ];

  getDependentVariablesStackedHeading(
    dependentVariableTargetPattern: IDependentVariableTargetPattern,
  ): string {
    return dependentVariableTargetPattern.variables;
  }

  versionsColumns: Column[] = [
    {
      id: 'label',
      heading: 'Version',
      key: 'label',
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (version: ViewVersion): string[] => {
        return ['/simulators', this.id, version.label];
      },
      minWidth: 73,
      showStacked: false,
    },
    {
      id: 'date',
      heading: 'Date',
      key: 'created',
      filterType: ColumnFilterType.date,
      minWidth: 80,
    },
    {
      id: 'image',
      heading: 'Image',
      key: 'image',
      getter: (version: ViewVersion): string | null => {
        return version.image ? version.image.url : null;
      },
      stackedFormatter: (image: string | null): string => {
        if (image) {
          return image;
        } else {
          return 'Not available';
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (version: ViewVersion): string | null => {
        if (version.image) {
          return (
            'https://github.com/orgs/biosimulators/packages/container/package/' +
            this.id
          );
        } else {
          return null;
        }
      },
      minWidth: 610,
    },
    {
      id: 'curationStatus',
      heading: 'Curation',
      key: 'curationStatus',
      show: true,
      center: true,
      minWidth: 74,
      filterable: true,
    },
    {
      id: 'run',
      heading: 'Run',
      key: 'label',
      formatter: (): null => {
        return null;
      },
      stackedFormatter: (label: string): string => {
        return (
          this.config.dispatchAppUrl +
          'run?simulator=' +
          this.id +
          '&simulatorVersion=' +
          label
        );
      },
      rightIcon: 'simulator',
      rightIconTitle: (version: ViewVersion): string => {
        return (
          'Execute simulations with v' + version.label + ' @ runBioSimulations'
        );
      },
      centerAction: ColumnActionType.href,
      rightAction: ColumnActionType.href,
      centerHref: (version: ViewVersion): string => {
        return (
          this.config.dispatchAppUrl +
          'run?simulator=' +
          this.id +
          '&simulatorVersion=' +
          version.label
        );
      },
      rightHref: (version: ViewVersion): string => {
        return (
          this.config.dispatchAppUrl +
          'run?simulator=' +
          this.id +
          '&simulatorVersion=' +
          version.label
        );
      },
      rightShowStacked: false,
      minWidth: 40,
      center: true,
      filterable: false,
      sortable: false,
    },
  ];

  getVersionStackedHeading(version: ViewVersion): string {
    return version.label;
  }

  getVersionStackedHeadingMoreInfoRouterLink(version: ViewVersion): string[] {
    return ['/simulators', this.id, version.label];
  }

  highlightVersion!: (version: ViewVersion) => boolean;

  ngOnInit(): void {
    this.getVersionLinkBound = this.getVersionStackedHeadingMoreInfoRouterLink.bind(
      this,
    );

    const params = this.route.params;
    this.simulator = params.pipe(
      switchMap((value: Params) => {
        const id = value.id;
        const version = value.version;
        this.id = id;
        let simulator: Observable<ViewSimulator>;
        if (version) {
          simulator = this.simService.getVersion(id, version);
        } else {
          simulator = this.simService.getLatest(id);
        }
        simulator.subscribe(this.processSimulator.bind(this));
        return simulator;
      }),

      tap(() => {
        this.loadingSubject.next(false);
        this.cd.detectChanges();
      }),
    );
  }

  processSimulator(simulator: ViewSimulator): void {
    this.dispatchAppUrl =
      this.config.dispatchAppUrl +
      'run' +
      '?simulator=' +
      simulator.id +
      '&simulatorVersion=' +
      simulator.version;
    this.dispatchAppRunUrl =
      this.config.dispatchAppUrl +
      'run' +
      '?simulator=' +
      simulator.id +
      '&simulatorVersion=' +
      simulator.version;
    this.highlightVersion = (version: ViewVersion): boolean => {
      return version.label === simulator.version;
    };

    // find documentation URL
    this.simulatorDocumentationUrl = undefined;
    for (const url of simulator.urls) {
      if (url.type === 'Documentation') {
        this.simulatorDocumentationUrl = url.url;
        break;
      }
    }

    if (!this.simulatorDocumentationUrl) {
      for (const url of simulator.urls) {
        if (url.type === 'Home page') {
          this.simulatorDocumentationUrl = url.url;
          break;
        }
      }
    }
  }

  algorithmsTocSections!: Observable<TocSection[]>;
  testResultsTocSections = of(null);

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    if (container) {
      setTimeout(() => {
        this.algorithmsTocSections = container.sections$;
      });
    }
  }

  copyDockerPullCmd(image = '{ image }'): void {
    const cmd = 'docker pull ' + image;
    navigator.clipboard.writeText(cmd);
    this.snackBar.open('The command to pull the Docker image was copied to your clipboard.', undefined, {
      duration: snackBarDuration,
    });
  }
}
