import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  TableComponent,
  Column,
  ColumnLinkType,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import { SimulatorService } from '../simulator.service';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';
import { Subscription } from 'rxjs';
import { columns, TableSimulator } from './browse-simulators.columns';

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

@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent;
  columns = columns;
  data: TableSimulator[] = [];
  subscription!: Subscription;

  constructor(private router: Router, private service: SimulatorService) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    this.table.defaultSort = { active: 'name', direction: 'asc' };

    setTimeout(() => {
      this.subscription = this.service
        .getLatest()
        .subscribe((simulators: any[]) => {
          console.log(simulators);
          this.data = simulators.map(
            (simulator: any): TableSimulator => {
              console.log(simulator);
              const frameworks = new Set();
              const algorithms = new Set();
              const algorithmSynonyms = new Set();
              const formats = new Set();
              for (const algorithm of simulator.algorithms) {
                for (const framework of algorithm.modelingFrameworks) {
                  frameworks.add(
                    this.trimFramework(sboTerms[framework.id]?.name)
                  );
                }
                algorithms.add(kisaoTerms[algorithm.kisaoId.id]?.name);
                for (const synonym of algorithm.kisaoSynonyms) {
                  algorithmSynonyms.add(kisaoTerms[synonym.id]?.name);
                }
                for (const format of algorithm.modelFormats) {
                  formats.add(edamTerms[format.id]?.name);
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
                license: this.shortenLicense(
                  spdxTerms[simulator.license.id]?.name
                ),
                created: new Date(simulator.created),
              } as TableSimulator;
            }
          );
          this.table.setData(this.data);
        });
    });
  }

  trimFramework(name: string): string {
    if (name.toLowerCase().endsWith(' framework')) {
      name = name.substring(0, name.length - 10);
    }
    return name;
  }

  shortenLicense(name: string | undefined): string {
    if (name) {
      return name
        .replace(/\bLicense\b/, '')
        .replace('  ', ' ')
        .trim();
    } else {
      return '';
    }
  }
}
