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

import { ViewSimulatorService } from './view-simulator.service';

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
  constructor(
    public route: ActivatedRoute,

    private simService: ViewSimulatorService,
    private cd: ChangeDetectorRef
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
        const value = parameter.value;
        if (value == null || value === undefined) {
          return null;
        } else if (typeof value === 'string') {
          return value;
        } else if (value === true || value === false) {
          return value.toString();
        } else if (value === 0) {
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
      },
    },
    {
      id: 'range',
      heading: 'Recommended range',
      key: 'range',
      minWidth: 163,
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

  getParameterStackedHeading(parameter: ViewParameter): Observable<string> {
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
      rightIcon: 'internalLink',
      rightAction: ColumnActionType.routerLink,
      rightRouterLink: (version: ViewVersion) => {
        return ['/simulators', this.id, version.label];
      },
      minWidth: 73,
      showStacked: false,
    },
    {
      id: 'date',
      heading: 'Date',
      key: 'date',
      filterType: ColumnFilterType.date,
      minWidth: 80,
    },
    {
      id: 'image',
      heading: 'Image',
      key: 'image',
      rightIcon: 'copy',
      rightIconTitle: (): string => {
        return 'Copy to clipboard';
      },
      rightAction: ColumnActionType.click,
      rightClick: (version: ViewVersion): void => {
        this.copyDockerPullCmd(version.image);
      },
      minWidth: 650,
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
        simulator.subscribe(this.setHighlightVersion.bind(this));
        return simulator;
      }),

      tap((_) => {
        this.loadingSubject.next(false);
        this.cd.detectChanges();
      })
    );
  }

  setHighlightVersion(simulator: ViewSimulator) {
    this.highlightVersion = (version: ViewVersion): boolean => {
      return version.label === simulator.version;
    };
  }

  formatKisaoDescription(value: string): DescriptionFragment[] {
    const formattedValue = [];
    let prevEnd = 0;

    const regExp = /\[(https?:\/\/.*?)\]/gi;
    let match;
    while ((match = regExp.exec(value)) !== null) {
      if (match.index > 0) {
        formattedValue.push({
          type: DescriptionFragmentType.text,
          value: value.substring(prevEnd, match.index),
        });
      }
      prevEnd = match.index + match[0].length;
      formattedValue.push({
        type: DescriptionFragmentType.href,
        value: match[1],
      });
    }
    if (prevEnd < value?.length) {
      formattedValue.push({
        type: DescriptionFragmentType.text,
        value: value.substring(prevEnd),
      });
    }
    return formattedValue;
  }

  makeCitation(citation: any): ViewCitation {
    let text =
      citation.authors +
      '. ' +
      citation.title +
      '. <i>' +
      citation.journal +
      '</i>';
    if (citation.volume) {
      text += ' ' + citation.volume;
    }
    if (citation.issue) {
      text += ' (' + citation.issue + ')';
    }
    if (citation.pages) {
      text += ', ' + citation.pages;
    }
    text += ' (' + citation.year + ').';

    return {
      url: citation.identifiers[0].url as string,
      text: text,
    };
  }

  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  copyDockerPullCmd(image = '{ image }'): void {
    const cmd = 'docker pull ' + image;
    navigator.clipboard.writeText(cmd);
  }
}
