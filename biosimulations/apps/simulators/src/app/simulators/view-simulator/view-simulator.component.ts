import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
  Column,
  ColumnActionType,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import {
  AlgorithmParameterType,
} from '@biosimulations/datamodel/common';
import { ViewSimulatorService } from './view-simulator.service';
import { ConfigService } from '@biosimulations/shared/services';

import {
  ViewSimulator,
  ViewParameter,
  ViewVersion,
  ViewCitation,
  DescriptionFragment,
  DescriptionFragmentType,
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

  constructor(
    public route: ActivatedRoute,
    private simService: ViewSimulatorService,
    private cd: ChangeDetectorRef,
    private config: ConfigService
  ) {}

  loadingSubject = new BehaviorSubject(true);
  loading$!: Observable<boolean>;
  // TODO handler errors from simulator service
  error = false;

  simulator!: Observable<ViewSimulator>;
  id!: string;

  parametersColumns: Column[] = [
    {
      id: 'name',
      heading: 'Name',
      key: 'name',
      showStacked: false,
      minWidth: 250
    },
    {
      id: 'type',
      heading: 'Type',
      key: 'type',
    },
    {
      id: 'value',
      heading: 'Default value',
      key: 'value',
      getter: (parameter: ViewParameter): string | null => {
        return this.formatParameterVal(parameter.type, parameter.value);
      },
    },
    {
      id: 'range',
      heading: 'Recommended range',
      key: 'range',
      getter: (parameter: ViewParameter): string | null => {
        if (parameter.range) {
          return parameter.range.map(this.formatParameterVal.bind(this, parameter.type)).join(', ');
        } else {
          return null;
        }
      },
      minWidth: 163,
      filterable: false,
    },
    {
      id: 'kisaoId',
      heading: 'KiSAO id',
      key: 'kisaoId',
      rightIcon: 'link',
      rightAction: ColumnActionType.href,
      rightHref: (parameter: ViewParameter): string => {
        return parameter.kisaoUrl;
      },
      showStacked: true,
      minWidth: 130,
    },
  ];

  formatParameterVal(type: string, value: boolean | number | string | null): string | null {
    if (value == null) {
      return value;
    } else if (type === AlgorithmParameterType.boolean) {
      return value.toString();
    } else if (type === AlgorithmParameterType.integer || type === AlgorithmParameterType.float) {
      if (value === 0) {
        return '0';
      } else if (value < 1e-3 || value > 1e3) {
        const exp = Math.floor(Math.log10(value as number));
        const val = (value as number) / Math.pow(10, exp);
        let valStr: string;
        if (Math.abs((val * 1e0 - Math.round(val * 1e0)) / (val * 1e0)) < 1e-12) {
          valStr = val.toFixed(0);
        } else if (Math.abs((val * 1e1 - Math.round(val * 1e1)) / (val * 1e1)) < 1e-12) {
          valStr = val.toFixed(1);
        } else if (Math.abs((val * 1e2 - Math.round(val * 1e2)) / (val * 1e2)) < 1e-12) {
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
    parameter: ViewParameter
  ): string {
    return parameter.kisaoUrl;
  }

  versionsColumns: Column[] = [
    {
      id: 'label',
      heading: 'Version',
      key: 'label',
      centerAction: ColumnActionType.routerLink,
      centerRouterLink: (version: ViewVersion) => {
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
      stackedFormatter: (image: string | undefined): string => {
        if (image) {
          return image;
        } else {
          return 'Not available';
        }
      },
      centerAction: ColumnActionType.href,
      centerHref: (version: ViewVersion): string | null => {
        if (version.image) {
          return 'https://github.com/orgs/biosimulators/packages/container/package/' + this.id;
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
      formatter: (label: string): null => {
        return null;
      },
      stackedFormatter: (label: string): string => {
        return this.config.dispatchAppUrl + 'run?simulator=' + this.id + '&simulatorVersion=' + label;
      },
      rightIcon: 'simulator',
      rightIconTitle: (version: ViewVersion): string => {
        return 'Execute simulations with v' + version.label + ' @ runBioSimulations';
      },
      centerAction: ColumnActionType.href,
      rightAction: ColumnActionType.href,
      centerHref: (version: ViewVersion): string => {
        return this.config.dispatchAppUrl + 'run?simulator=' + this.id + '&simulatorVersion=' + version.label;
      },
      rightHref: (version: ViewVersion): string => {
        return this.config.dispatchAppUrl + 'run?simulator=' + this.id + '&simulatorVersion=' + version.label;
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
      this
    );

    const params = this.route.params;
    this.loading$ = this.loadingSubject.asObservable();
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

      tap((_) => {
        this.loadingSubject.next(false);
        this.cd.detectChanges();
      })
    );
  }

  processSimulator(simulator: ViewSimulator) {
    this.dispatchAppUrl = this.config.dispatchAppUrl + 'run' + '?simulator=' + simulator.id + '&simulatorVersion=' + simulator.version;
    this.dispatchAppRunUrl = this.config.dispatchAppUrl + 'run' + '?simulator=' + simulator.id + '&simulatorVersion=' + simulator.version;
    this.highlightVersion = (version: ViewVersion): boolean => {
      return version.label === simulator.version;
    };
  }

  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    if (container) {
      setTimeout(() => {
        this.tocSections = container.sections$;
      });
    }
  }

  copyDockerPullCmd(image = '{ image }'): void {
    const cmd = 'docker pull ' + image;
    navigator.clipboard.writeText(cmd);
  }
}
