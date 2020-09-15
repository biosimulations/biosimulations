import { Injectable } from '@angular/core';
import { SimulatorService } from '../simulator.service';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TableSimulator } from './tableSimulator.interface';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';

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

@Injectable({ providedIn: 'root' })
export class SimulatorTableService {
  constructor(private service: SimulatorService) {}
  getData(): Observable<TableSimulator[]> {
    return this.service.getLatest().pipe(
      delay(1000),
      map((simulators: any[]): TableSimulator[] => {
        return simulators.map(
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
      })
    );
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
