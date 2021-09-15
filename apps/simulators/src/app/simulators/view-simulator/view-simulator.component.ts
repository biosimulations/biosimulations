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
import { ViewSimulatorService } from './view-simulator.service';
import { ConfigService } from '@biosimulations/shared/services';
import { snackBarDuration } from '@biosimulations/config/common';

import { ViewSimulator, ViewVersion } from './view-simulator.interface';

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

  public loadingSubject = new BehaviorSubject(true);
  public loading$ = this.loadingSubject.asObservable();
  // TODO handler errors from simulator service
  public error = false;

  public simulator!: Observable<ViewSimulator>;
  public id!: string;
  public algorithmsTocSections!: Observable<TocSection[]>;
  public testResultsTocSections = of(null);

  public versionsColumns: Column[] = [
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
      key: 'validated',
      formatter: (): null => {
        return null;
      },
      stackedFormatter: (
        label: string,
        version: ViewVersion,
      ): string | null => {
        if (version.validated) {
          return (
            this.config.dispatchAppUrl +
            'run?simulator=' +
            this.id +
            '&simulatorVersion=' +
            label
          );
        } else {
          return null;
        }
      },
      rightIcon: 'simulator',
      rightIconTitle: (version: ViewVersion): string | null => {
        if (version.validated) {
          return (
            'Execute simulations with v' +
            version.label +
            ' @ runBioSimulations'
          );
        } else {
          return null;
        }
      },
      centerAction: ColumnActionType.href,
      rightAction: ColumnActionType.href,
      centerHref: (version: ViewVersion): string | null => {
        if (version.validated) {
          return (
            this.config.dispatchAppUrl +
            'run?simulator=' +
            this.id +
            '&simulatorVersion=' +
            version.label
          );
        } else {
          return null;
        }
      },
      rightHref: (version: ViewVersion): string | null => {
        if (version.validated) {
          return (
            this.config.dispatchAppUrl +
            'run?simulator=' +
            this.id +
            '&simulatorVersion=' +
            version.label
          );
        } else {
          return null;
        }
      },
      rightShowStacked: false,
      minWidth: 40,
      center: true,
      filterable: false,
      sortable: false,
    },
  ];

  public highlightVersion!: (version: ViewVersion) => boolean;

  public getVersionStackedHeading(version: ViewVersion): string {
    return version.label;
  }

  public getVersionStackedHeadingMoreInfoRouterLink(
    version: ViewVersion,
  ): string[] {
    return ['/simulators', this.id, version.label];
  }

  public ngOnInit(): void {
    this.getVersionLinkBound =
      this.getVersionStackedHeadingMoreInfoRouterLink.bind(this);

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

  public processSimulator(simulator: ViewSimulator): void {
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

  @ViewChild(TocSectionsContainerDirective)
  public set tocSectionsContainer(container: TocSectionsContainerDirective) {
    if (container) {
      setTimeout(() => {
        this.algorithmsTocSections = container.sections$;
      });
    }
  }

  public copyDockerPullCmd(image = '{ image }'): void {
    const cmd = 'docker pull ' + image;
    navigator.clipboard.writeText(cmd);
    this.snackBar.open(
      'The command to pull the Docker image was copied to your clipboard.',
      undefined,
      {
        duration: snackBarDuration,
      },
    );
  }

  public copyDockerRunCmd(image = '{ image }'): void {
    const cmd = 'docker run ' + image;
    navigator.clipboard.writeText(cmd);
    this.snackBar.open(
      'The command to run the Docker image was copied to your clipboard.',
      undefined,
      {
        duration: snackBarDuration,
      },
    );
  }

  public copyPipInstallCmd(pythonPackage = '{ package }'): void {
    const cmd = 'pip install ' + pythonPackage;
    navigator.clipboard.writeText(cmd);
    this.snackBar.open(
      'The command to install the Python package was copied to your clipboard.',
      undefined,
      {
        duration: snackBarDuration,
      },
    );
  }

  public copyPythonImportCmd(module = '{ module }'): void {
    const cmd = 'import ' + module;
    navigator.clipboard.writeText(cmd);
    this.snackBar.open(
      'The command to import the Python module was copied to your clipboard.',
      undefined,
      {
        duration: snackBarDuration,
      },
    );
  }
}
