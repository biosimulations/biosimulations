import { Injectable } from '@angular/core';
import { SimulatorService, Version } from '../simulator.service';
import {
  ViewSimulator,
  ViewCitation,
  ViewVersion,
  ViewAlgorithm,
  ViewFramework,
  ViewFormat,
  ViewParameter,
  DescriptionFragment,
  DescriptionFragmentType,
} from './view-simulator.interface';
import { OntologyService } from '../ontology.service';
import { Observable, of } from 'rxjs';
import { Simulator, Algorithm } from '@biosimulations/simulators/api-models';
import { map, pluck, tap } from 'rxjs/operators';
import { } from './view-simulator.component';
import {
  IEdamOntologyId,
  ISboOntologyID,
} from '@biosimulations/shared/datamodel';
import { AlgorithmParameter } from '@biosimulations/shared/datamodel';
import { BiosimulationsError } from '@biosimulations/shared/ui';

@Injectable({ providedIn: 'root' })
export class ViewSimulatorService {
  constructor(
    private simService: SimulatorService,
    private ontService: OntologyService
  ) { }
  getVersions(simulatorId: string) { }
  getLatest(simulatorId: string): Observable<ViewSimulator> {
    const sim: Observable<Simulator> = this.simService.getLatestById(
      simulatorId
    );
    return sim.pipe(map(this.apiToView.bind(this, simulatorId, undefined)));
  }
  getVersion(simulatorId: string, version: string): Observable<ViewSimulator> {
    const sim: Observable<Simulator> = this.simService.getOneByVersion(
      simulatorId,
      version
    );
    return sim.pipe(map(this.apiToView.bind(this, simulatorId, version)));
  }

  apiToView(simulatorId: string, version: string | undefined, sim: Simulator | undefined): ViewSimulator {
    if (sim === undefined) {
      if (version) {
        throw new BiosimulationsError('Simulation version not found', `Simulator "${simulatorId}" does not have version "${version}".`, 404);
      } else {
        throw new BiosimulationsError('Simulator not found', `There is no simulator with id "${simulatorId}".`, 404);
      }
    }

    const viewSim: ViewSimulator = {
      id: sim.id,
      version: sim.version,
      name: sim.name,
      image: sim.image,
      description: sim.description,
      url: sim.url,
      authors: this.getAuthors(sim),
      citations: sim?.references?.citations?.map(this.makeCitation),

      licenseName: this.ontService.getSpdxTerm(sim.license.id).pipe(
        pluck('name'),
        map((name: string) =>
          name.replace(/\bLicense\b/, '').replace('  ', ' ')
        )
      ),
      licenseUrl: this.ontService
        .getSpdxTerm(sim.license.id)
        .pipe(pluck('url')),
      versions: this.simService
        .getVersions(sim.id)
        .pipe(map((value: Version[]) => value.map(this.setVersionDate))),
      algorithms: sim.algorithms.map(this.mapAlgorithms, this),
    };
    return viewSim;
  }

  mapAlgorithms(value: Algorithm): ViewAlgorithm {
    const kisaoTerm = this.ontService.getKisaoTerm(value.kisaoId.id);
    const kisaoName = kisaoTerm.pipe(pluck('name'));

    return {
      id: value.kisaoId.id,

      name: kisaoName,
      heading: kisaoName.pipe(
        map((nameval: string) => nameval + ' (' + value.kisaoId.id + ')')
      ),
      description: kisaoTerm.pipe(
        pluck('description'),
        map(this.formatKisaoDescription)
      ),
      url: kisaoTerm.pipe(pluck('url')),
      frameworks: value.modelingFrameworks.map(this.getFrameworks, this),
      formats: value.modelFormats.map(this.getFormats, this),
      parameters: of(value.parameters.map(this.getParameters, this)),
      citations: value?.citations
        ? value.citations.map(this.makeCitation, this)
        : [],
    };
  }
  getParameters(parameter: AlgorithmParameter): ViewParameter {
    return {
      id: parameter.id,
      name: parameter.name,
      type: parameter.type,
      value: parameter.value,
      range: parameter.recommendedRange
        ? parameter.recommendedRange
          .map((val: { toString: () => any }) => {
            return val.toString();
          })
          .join(' - ')
        : null,
      kisaoId: parameter.kisaoId.id,
      kisaoUrl: this.ontService.getKisaoUrl(parameter.kisaoId.id),
    };
  }
  getFrameworks(value: ISboOntologyID): Observable<ViewFramework> {
    return this.ontService.getSboTerm(value.id);
  }
  getFormats(value: IEdamOntologyId): Observable<ViewFormat> {
    return this.ontService.getEdamTerm(value.id);
  }
  setVersionDate(value: Version): ViewVersion {
    let created: Date = value.date;
    created = new Date(created);
    const date =
      created.getFullYear().toString() +
      '-' +
      (created.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      created.getDate().toString().padStart(2, '0');

    return {
      label: value.version,
      date: date,
      url: value.url,
      image: value.image,
    };
  }
  getAuthors(simulator: Simulator): string | null {
    const authors = simulator?.authors?.map(
      (author: {
        lastName: string;
        middleName: string | null;
        firstName: string;
      }) => {
        let name = author.lastName;
        if (author.middleName) {
          name = author.middleName + ' ' + name;
        }
        if (author.firstName) {
          name = author.firstName + ' ' + name;
        }
        return name;
      }
    );
    if (!authors) {
      return null;
    }
    switch (authors.length) {
      case 0:
        return null;

      case 1:
        return authors[0];

      default:
        return (
          authors.slice(0, -1).join(', ') + ' & ' + authors[authors.length - 1]
        );
    }
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
      url: citation?.identifiers?.[0]?.url as string || null,
      text: text,
    };
  }
}
