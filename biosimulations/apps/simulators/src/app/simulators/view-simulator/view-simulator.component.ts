import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { pluck, map, mergeAll, tap, catchError } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';
import { SimulatorService, Simulator } from '../simulator.service';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';

const edamTerms = edamJson as { [id: string]: {name: string, description: string, url: string}};
const kisaoTerms = kisaoJson as { [id: string]: {name: string, description: string, url: string}};
const sboTerms = sboJson as { [id: string]: {name: string, description: string, url: string}};
const spdxTerms = spdxJson as { [id: string]: {name: string, url: string}};

interface Algorithm {
  id: string;
  heading: string;
  name: string;
  description: DescriptionFragment[];
  url: string;
  frameworks: Framework[];
  formats: Format[];
  parameters: Parameter[];
  citations: Citation[];
}

enum DescriptionFragmentType {
  text = 'text',
  href = 'href',
}

interface DescriptionFragment {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSimulatorComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  simulator$!: Observable<Simulator | undefined>;
  loading$!: Observable<boolean>;
  // TODO handler errors from simulator service
  error = false;

  parameterColumns = ['id', 'name', 'type', 'value', 'range', 'kisaoId'];
  versionColumns = ['label', 'date', 'image'];

  id!: string;
  version!: string;
  name!: string;
  description!: string | null;
  image!: string;
  url!: string;
  licenseUrl!: string;
  licenseName!: string;
  authors!: string | null;
  citations!: Citation[];
  algorithms!: Algorithm[];
  versions!: Version[];

  ngOnInit(): void {
    const id$ = this.route.params.pipe(pluck('id'));
    const version$ = this.route.params.pipe(pluck('version'));
    /*
    this.simulator$ = this.id$.pipe(
      map((id: string) => this.simulatorService.get(id)),
      mergeAll(),
      tap((_) => (this.loading = false)),
      catchError((err: any) =>
        of(undefined).pipe(tap((_) => (this.error = err))),
      ),
    );
    */

    const simulatorSubject = new BehaviorSubject<Simulator | undefined>(undefined);
    const loadingSubject = new BehaviorSubject<boolean>(true);
    for (const simulator of SimulatorService.data) {
      if (simulator.id === this.route.snapshot.params['id']) {
        simulatorSubject.next(simulator);
        loadingSubject.next(false);

        this.id = simulator.id;
        this.version = simulator.version;
        this.name = simulator.name;
        this.description = simulator.description;
        this.image = simulator.image;
        this.url = simulator.url;
        this.licenseUrl = spdxTerms[simulator.license.id].url;
        this.licenseName = spdxTerms[simulator.license.id].name.replace(/\bLicense\b/, '').replace('  ', ' ');

        const authors = simulator.authors.map((author) => {
          let name = author.lastName;
          if (author.middleName) {
            name = author.middleName + ' ' + name;
          }
          if (author.firstName) {
            name = author.firstName + ' ' + name;
          }
          return name;
        })
        switch (authors.length) {
          case 0:
            this.authors = null;
            break;
          case 1:
            this.authors = authors[0];
            break;
          default:
            this.authors = authors.slice(0, -1).join(', ') + ' & ' + authors[authors.length - 1];
            break;
        }

        this.citations = simulator.references.citations.map(this.makeCitation);

        this.algorithms = simulator.algorithms.map((algorithm): Algorithm => {
          return {
            id: algorithm.kisaoId.id,
            heading: kisaoTerms[algorithm.kisaoId.id].name + ' (KISAO:' + algorithm.kisaoId.id + ')',
            name: kisaoTerms[algorithm.kisaoId.id].name,
            description: this.formatKisaoDescription(kisaoTerms[algorithm.kisaoId.id].description),
            url: kisaoTerms[algorithm.kisaoId.id].url,
            frameworks: algorithm.modelingFrameworks.map((framework): Framework => {
              return {
                id: framework.id,
                name: sboTerms[framework.id].name,
                url: sboTerms[framework.id].url,
              };
            }),
            formats: algorithm.modelFormats.map((format): Format => {
              return {
                id: format.id,
                name: edamTerms[format.id].name,
                url: edamTerms[format.id].url,
              };
            }),
            parameters: algorithm.parameters.map((parameter): Parameter => {
              return {
                id: parameter.id,
                name: parameter.name,
                type: parameter.type,
                value: parameter.value,
                range: parameter.recommendedRange === undefined ? null : parameter.recommendedRange.map((val) => {return val.toString();}).join(' - '),
                kisaoId: parameter.kisaoId.id,
                kisaoUrl: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_' + parameter.kisaoId.id,
              };
            }),
            citations: algorithm.citations === undefined ? [] : algorithm.citations.map(this.makeCitation),
          };
        })

        const created = new Date(simulator.created);
        this.versions = [
          {
            label: simulator.version,
            date: created.getFullYear().toString()
              + '-' + (created.getMonth() + 1).toString().padStart(2, '0')
              + '-' + created.getDate().toString().padStart(2, '0'),
            image: simulator.image,
            url: simulator.imageUrl,
          },
          {
            label: '1.0',
            date: created.getFullYear().toString()
              + '-' + (created.getMonth() + 1).toString().padStart(2, '0')
              + '-' + created.getDate().toString().padStart(2, '0'),
            image: simulator.image,
            url: simulator.imageUrl,
          },
          {
            label: '2.0',
            date: created.getFullYear().toString()
              + '-' + (created.getMonth() + 1).toString().padStart(2, '0')
              + '-' + created.getDate().toString().padStart(2, '0'),
            image: simulator.image,
            url: simulator.imageUrl,
          },
        ];
        this.versions.sort((a, b): number => {
          return -1 * a.label.localeCompare(b.label, undefined, {numeric: true});
        });

        break;
      }
    }
    this.simulator$ = simulatorSubject.asObservable();
    this.loading$ = loadingSubject.asObservable();
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
      })
    }
    if (prevEnd < value.length) {
      formattedValue.push({
        type: DescriptionFragmentType.text,
        value: value.substring(prevEnd),
      });
    }
    return formattedValue;
  }

  makeCitation(citation: any): Citation {
    let text = citation.authors + '. ' + citation.title + '. <i>' + citation.journal + '</i>';
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
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
