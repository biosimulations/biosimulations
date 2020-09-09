import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent, Column, ColumnLinkType, ColumnFilterType } from '@biosimulations/shared/ui';
import { SimulatorService } from '../simulator.service';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';

const edamTerms = edamJson as { [id: string]: {name: string, description: string, url: string}};
const kisaoTerms = kisaoJson as { [id: string]: {name: string, description: string, url: string}};
const sboTerms = sboJson as { [id: string]: {name: string, description: string, url: string}};
const spdxTerms = spdxJson as { [id: string]: {name: string, url: string}};

interface Simulator {
  id: string;
  name: string;
  frameworks: string[];
  algorithms: string[];
  algorithmSynonyms: string[];
  formats: string[];
  latestVersion: string;
  url: string;
  license: string;
  created: Date;
}

@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent;

  columns: Column[] = [
    {
      id: 'id',
      heading: "Id",
      key: 'id',
      filterable: false,
      minWidth: 90,
    },
    {
      id: 'name',
      heading: "Name",
      key: 'name',
      filterable: false,
      minWidth: 90,
    },
    {
      id: 'frameworks',
      heading: "Frameworks",
      key: 'frameworks',
      getter: (element: Simulator): string[] => {
        const value = [];
        for (const framework of element.frameworks) {
          value.push(framework);
        }
        value.sort((a: string, b: string): number => {
          return a.localeCompare( b, undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.join(', ');
      },
      filterFormatter: (name: string): string => {
        return name;
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.join(', '), bNames.join(', '), sign);
      },
      filterComparator: (aName: string, bName: string, sign = 1): number => {
        return TableComponent.comparator(aName, bName, sign);
      },
      minWidth: 200,
    },
    {
      id: 'algorithms',
      heading: "Algorithms",
      key: 'algorithms',
      getter: (element: Simulator): string[] => {
        const value = [];
        for (const algorithm of element.algorithms) {
          value.push(algorithm);
        }
        value.sort((a: string, b: string): number => {
          return a.localeCompare( b, undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.join(', ');
      },
      filterFormatter: (name: string): string => {
        return name;
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.join(', '), bNames.join(', '), sign);
      },
      passesFilter: (element: Simulator, filterValues: string[]): boolean => {
        const algorithms = element.algorithms;
        const algorithmSynonyms = element.algorithmSynonyms;
        for (const v of filterValues) {
          if (algorithms.includes(v)) {
            return true;
          }
          if (algorithmSynonyms.includes(v)) {
            return true;
          }
        }

        return false;
      },
      filterComparator: TableComponent.comparator,
      minWidth: 250,
    },
    {
      id: 'formats',
      heading: "Model formats",
      key: 'formats',
      getter: (element: Simulator): string[] => {
        const value = [];
        for (const format of element.formats) {
          value.push(format);
        }
        value.sort((a: string, b: string): number => {
          return a.localeCompare( b, undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.join(', ');
      },
      filterFormatter: (name: string): string => {
        return name;
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.join(', '), bNames.join(', '), sign);
      },
      filterComparator: TableComponent.comparator,
      minWidth: 114,
    },
    {
      id: 'latestVersion',
      heading: "Latest version",
      key: 'latestVersion',
      filterable: false,
      show: false,
      minWidth: 110,
    },
    {
      id: 'license',
      heading: "License",
      key: 'license',
      show: false,
      minWidth: 75,
    },
    {
      id: 'created',
      heading: "Created",
      key: 'created',
      formatter: (value: Date): string => {
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0');
      },
      filterType: ColumnFilterType.date,
      show: false,
    },
    {
      id: 'moreInfo',
      heading: "More info",
      leftIcon: 'internalLink',
      rightIcon: 'link',
      leftIconTitle: (element: Simulator): string => {
        return element.name + ' image';
      },
      rightIconTitle: (element: Simulator): string => {
        return element.name + ' website';
      },
      leftLinkType: ColumnLinkType.routerLink,
      rightLinkType: ColumnLinkType.href,
      leftRouterLink: (element: any): string[] => {
        return ['/simulators', element.id];
      },
      rightHref: (element: Simulator): string => {
        return element.url;
      },
      minWidth: 66,
      center: true,
      filterable: false,
      sortable: false,
    },
  ];

  data: Simulator[] = [];

  constructor(
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.table.defaultSort = {active: 'name', direction: 'asc'};

    setTimeout(() => {


      this.data = SimulatorService.data.map((simulator: any): Simulator => {
        const frameworks = new Set();
        const algorithms = new Set();
        const algorithmSynonyms = new Set();
        const formats = new Set();
        for (const algorithm of simulator.algorithms) {
          for (const framework of algorithm.modelingFrameworks) {
            frameworks.add(this.trimFramework(sboTerms[framework.id].name));
          }
          algorithms.add(kisaoTerms[algorithm.kisaoId.id].name);
          for (const synonym of algorithm.kisaoSynonyms) {
            algorithmSynonyms.add(kisaoTerms[synonym.id].name);
          }
          for (const format of algorithm.modelFormats) {
            formats.add(edamTerms[format.id].name);
          }
        }

        return {
          id: simulator.id,
          name: simulator.name,
          frameworks: Array.from(frameworks),
          algorithms: Array.from(algorithms),
          algorithmSynonyms: Array.from(algorithmSynonyms),
          formats: Array.from(formats),
          latestVersion: simulator.version,
          url: simulator.url,
          license: this.shortenLicense(spdxTerms[simulator.license.id].name),
          created: new Date(simulator.created),
        } as Simulator;
      });
      this.table.setData(this.data);
    });
  }

  trimFramework(name: string): string {
    if (name.toLowerCase().endsWith(' framework')) {
      name = name.substring(0, name.length - 10);
    }
    return name;
  }

  shortenLicense(name: string): string {
    return name.replace(/\bLicense\b/, "").replace("  ", " ").trim();
  }
}
