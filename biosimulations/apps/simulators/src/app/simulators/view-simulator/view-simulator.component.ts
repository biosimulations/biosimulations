import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  pluck,
  map,
  mergeAll,
  tap,
  catchError,
  switchMap,
  delay,
} from 'rxjs/operators';
import { Observable, of, BehaviorSubject, concat } from 'rxjs';

import {
  TocSection,
  TocSectionsContainerDirective,
  Column,
  ColumnLinkType,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import { SimulatorService } from '../simulator.service';
import { ViewSimulatorService } from './view-simulator.service';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';
import { Simulator } from '@biosimulations/simulators/api-models';
import { ViewAlgorithm, ViewSimulator } from './view-simulator.interface';
const edamTerms = edamJson as {
  [id: string]: { name: string; description: string; url: string };
};
const kisaoTerms = kisaoJson as {
  [id: string]: { name: string; description: string; url: string };
};
const sboTerms = sboJson as {
  [id: string]: { name: string; description: string; url: string };
};
const spdxTerms = spdxJson as { [id: string]: { name: string; url: string } };

interface Algorithm extends ViewAlgorithm {
  id: string;
  heading: Observable<string>;
  name: Observable<string>;
  description: Observable<DescriptionFragment[]>;
  url: Observable<string>;
  frameworks: Observable<Framework>[];
  formats: Observable<Format>[];
  parameters: Observable<Parameter[]>;
  citations: Citation[];
}

export enum DescriptionFragmentType {
  text = 'text',
  href = 'href',
}

export interface DescriptionFragment {
  type: DescriptionFragmentType;
  value: string;
}

interface Framework {
  id: string;
  name: string;
  url: string;
}

interface Format {
  id: string;
  name: string;
  url: string;
}

interface Parameter {
  id?: string;
  name?: string;
  type: string;
  value: boolean | number | string;
  range: string | null;
  kisaoId: string;
  kisaoUrl: string;
}

interface Citation {
  url: string;
  text: string;
}

interface Version {
  label: string;
  date: string;
  image: string;
  url?: string;
}

@Component({
  selector: 'biosimulations-view-simulator',
  templateUrl: './view-simulator.component.html',
  styleUrls: ['./view-simulator.component.scss'],
})
export class ViewSimulatorComponent implements OnInit {
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private service: SimulatorService,
    private simService: ViewSimulatorService
  ) {}

  loadingSubject = new BehaviorSubject(true);
  loading$!: Observable<boolean>;
  // TODO handler errors from simulator service
  error = false;

  parameterColumns = ['id', 'name', 'type', 'value', 'range', 'kisaoId'];
  Columns = ['label', 'date', 'image'];
  simulator!: Observable<ViewSimulator>;
  id!: string;
  version!: string;
  name!: string;
  description!: string | null;
  image!: string;
  url!: string;
  licenseUrl!: Observable<string>;
  licenseName!: Observable<string>;
  authors!: string | null;
  citations!: Citation[];
  algorithms!: Algorithm[];
  private _versions = new BehaviorSubject<Version[]>([]);
  versions: Observable<Version[]> = this._versions.asObservable();

  parametersColumns: Column[] = [
    {
      id: 'id',
      heading: 'Id',
      key: 'id',
      showStacked: false,
    },
    {
      id: 'name',
      heading: 'Name',
      key: 'name',
      showStacked: false,
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
      rightLinkType: ColumnLinkType.href,
      rightHref: (parameter: Parameter): string => {
        return parameter.kisaoUrl;
      },
      showStacked: false,
      minWidth: 130,
    },
  ];

  getParameterStackedHeading(parameter: Parameter): string {
    const ids = [];
    if (parameter.id) {
      ids.push(parameter.id);
    }
    if (parameter.kisaoId) {
      ids.push(parameter.kisaoId);
    }

    const name = kisaoTerms[parameter.kisaoId].name;

    if (ids.length) {
      return kisaoTerms[parameter.kisaoId].name + ' (' + ids.join(', ') + ')';
    } else {
      return name;
    }
  }

  getParameterStackedHeadingMoreInfoRouterLink(
    parameter: Parameter
  ): string | null {
    if (parameter.kisaoUrl) {
      return parameter.kisaoUrl;
    } else {
      return null;
    }
  }

  versionsColumns: Column[] = [
    {
      id: 'label',
      heading: 'Version',
      key: 'label',
      rightIcon: 'internalLink',
      rightLinkType: ColumnLinkType.routerLink,
      rightRouterLink: (version: Version) => {
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
      rightIcon: 'link',
      rightLinkType: ColumnLinkType.href,
      rightHref: (version: Version): string | null => {
        if (version.url === undefined) {
          return null;
        } else {
          return version.url;
        }
      },
      minWidth: 300,
    },
  ];

  getVersionStackedHeading(version: Version): string {
    return version.label;
  }

  getVersionStackedHeadingMoreInfoRouterLink(version: Version): string[] {
    console.log();
    return ['/simulators', this.id, version.label];
  }

  ngOnInit(): void {
    const params = this.route.params;
    this.loading$ = this.loadingSubject.asObservable();
    this.simulator = params.pipe(
      switchMap((value: Params) => {
        const id = value.id;
        const version = value.version;
        this.id = id;
        if (version) {
          return this.simService.getVersion(id, version);
        } else {
          return this.simService
            .getLatest(id)
            .pipe(tap((val) => console.log(val)));
        }
      }),

      tap((_) => this.loadingSubject.next(false))
    );
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

  makeCitation(citation: any): Citation {
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

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.getToc();
    });
  }

  copyDockerPullCmd(image = '{ image }'): void {
    const cmd = 'docker pull ' + image;
    navigator.clipboard.writeText(cmd);
  }
}
