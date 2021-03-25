import { Injectable } from '@angular/core';
import { SimulatorService, Version } from '../simulator.service';
import {
  ViewSimulator,
  ViewIdentifier,
  ViewCitation,
  ViewVersion,
  ViewAlgorithm,
  ViewAlgorithmObservable,
  ViewFramework,
  ViewFormat,
  ViewFormatObservable,
  ViewParameter,
  ViewParameterObservable,
  ViewSioId,
  ViewAuthor,
  ViewFunding,
  DescriptionFragment,
  DescriptionFragmentType,
  ViewValidationTests,
  ViewTestCaseResult,
} from './view-simulator.interface';
import { OntologyService } from '../ontology.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Simulator, Algorithm } from '@biosimulations/simulators/api-models';
import { map, pluck } from 'rxjs/operators';
import {
  IEdamOntologyIdVersion,
  ILinguistOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  Identifier,
  Person,
  DependentPackage,
  Funding,
  AlgorithmParameter,
  ValueType,
  SoftwareInterfaceType,
  sortUrls,
  IValidationTests,
  ITestCaseResult,
  TestCaseResultType,
} from '@biosimulations/datamodel/common';
import { UtilsService } from '@biosimulations/shared/services';
import { Citation } from '@biosimulations/datamodel/api';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';

@Injectable({ providedIn: 'root' })
export class ViewSimulatorService {
  constructor(
    private simService: SimulatorService,
    private ontService: OntologyService,
  ) {}

  getLatest(simulatorId: string): Observable<ViewSimulator> {
    const sim: Observable<Simulator> = this.simService.getLatestById(
      simulatorId,
    );
    return sim.pipe(map(this.apiToView.bind(this, simulatorId, undefined)));
  }

  getVersion(simulatorId: string, version: string): Observable<ViewSimulator> {
    const sim: Observable<Simulator> = this.simService.getOneByVersion(
      simulatorId,
      version,
    );
    return sim.pipe(map(this.apiToView.bind(this, simulatorId, version)));
  }

  apiToView(
    simulatorId: string,
    version: string | undefined,
    sim: Simulator | undefined,
  ): ViewSimulator {
    if (sim === undefined) {
      if (version) {
        throw new BiosimulationsError(
          'Simulator version not found',
          `Simulator "${simulatorId}" does not have version "${version}".`,
          404,
        );
      } else {
        throw new BiosimulationsError(
          'Simulator not found',
          `There is no simulator with id "${simulatorId}".`,
          404,
        );
      }
    }

    const viewSimAlgorithms = new BehaviorSubject<ViewAlgorithm[]>([]);

    let viewValidationTests: ViewValidationTests | null = null;
    if (sim?.biosimulators?.validationTests) {
      const validationTests: IValidationTests =
        sim.biosimulators.validationTests;

      let numTestsPassed = 0;
      let numTestPassedWithWarnings = 0;
      let numTestsSkipped = 0;
      let numTestsFailed = 0;
      validationTests.results.forEach((result: ITestCaseResult): void => {
        if (result.resultType == TestCaseResultType.passed) {
          numTestsPassed++;
          if (result.warnings?.length > 0) {
            numTestPassedWithWarnings++;
          }
        } else if (result.resultType == TestCaseResultType.skipped) {
          numTestsSkipped++;
        } else {
          numTestsFailed++;
        }
      });

      const viewResults = validationTests.results
        .map(
          (result: ITestCaseResult): ViewTestCaseResult => {
            const caseArchive = result.case.id.split('/')?.[1] || null;

            return {
              case: {
                id: result.case.id,
                description: result.case.description.replace('\n', '<br/>'),
              },
              caseUrl:
                'https://github.com/biosimulators/Biosimulators_test_suite/blob/' +
                validationTests.testSuiteVersion +
                '/biosimulators_test_suite/test_case/' +
                result.case.id.split('.')[0] +
                '.py',
              caseClass: result.case.id.split(':')[0],
              caseArchive: caseArchive,
              caseArchiveUrl: caseArchive
                ? 'https://github.com/biosimulators/Biosimulators_test_suite/raw/' +
                  validationTests.testSuiteVersion +
                  '/examples/' +
                  result.case.id.split(':')[1] +
                  '.omex'
                : null,
              resultType:
                result.resultType.substring(0, 1).toUpperCase() +
                result.resultType.substring(1),
              duration: result.duration.toFixed(1),
              exception: result.exception,
              warnings: result.warnings,
              skipReason: result.skipReason,
              log: result.log,
            };
          },
        )
        .sort((a, b) => {
          return a.case.id.localeCompare(b.case.id, undefined, {
            numeric: true,
          });
        });

      viewValidationTests = {
        testSuiteVersion: validationTests.testSuiteVersion,
        testSuiteVersionUrl:
          'https://github.com/biosimulators/Biosimulators_test_suite/releases/tag/' +
          validationTests.testSuiteVersion,
        numTests: validationTests.results.length,
        numTestsPassed: numTestsPassed,
        numTestPassedWithWarnings: numTestPassedWithWarnings,
        numTestsSkipped: numTestsSkipped,
        numTestsFailed: numTestsFailed,
        results: viewResults,
        ghIssue: validationTests.ghIssue,
        ghIssueUrl: `https://github.com/biosimulators/Biosimulators/issues/${validationTests.ghIssue}`,
        ghActionRun: validationTests.ghActionRun,
        ghActionRunUrl: `https://github.com/biosimulators/Biosimulators/actions/runs/${validationTests.ghActionRun}`,
      };
    }

    const viewSim: ViewSimulator = {
      _json: JSON.stringify(sim, null, 2),
      id: sim.id,
      version: sim.version,
      name: sim.name,
      image: sim.image,
      description: sim.description,
      urls: sim.urls.sort(sortUrls),
      authors: this.getAuthors(sim),
      identifiers: sim?.references?.identifiers
        ?.map(this.makeIdentifier, this)
        .sort((a, b) => {
          return a.text.localeCompare(b.text, undefined, { numeric: true });
        }),
      citations: sim?.references?.citations?.map(this.makeCitation, this),

      licenseName: sim.license
        ? this.ontService.getSpdxTerm(sim.license.id).pipe(
            pluck('name'),
            map((name: string) =>
              name.replace(/\bLicense\b/, '').replace('  ', ' '),
            ),
          )
        : null,
      licenseUrl: sim.license
        ? this.ontService.getSpdxTerm(sim.license.id).pipe(pluck('url'))
        : null,
      versions: this.simService
        .getVersions(sim.id)
        .pipe(map((value: Version[]) => value.map(this.setVersionDate, this))),
      algorithms: viewSimAlgorithms.asObservable(),
      interfaceTypes: sim.interfaceTypes
        .map((interfaceType: SoftwareInterfaceType): string => {
          return (
            interfaceType.substring(0, 1).toUpperCase() +
            interfaceType.substring(1)
          );
        })
        .sort((a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        }),
      supportedOperatingSystemTypes: sim.supportedOperatingSystemTypes.sort(
        (a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        },
      ),
      supportedProgrammingLanguages: sim.supportedProgrammingLanguages.sort(
        (a: ILinguistOntologyId, b: ILinguistOntologyId) => {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        },
      ),
      curationStatus: UtilsService.getSimulatorCurationStatusMessage(
        UtilsService.getSimulatorCurationStatus(sim),
      ),
      validated: sim?.biosimulators?.validated || false,
      validationTests: viewValidationTests,
      funding: sim.funding.map(this.getFunding, this),
      created: this.getDateStr(new Date(sim.biosimulators.created)),
      updated: this.getDateStr(new Date(sim.biosimulators.updated)),
    };

    const unresolvedAlgorithms = sim.algorithms
      .filter((alg: Algorithm) => {
        return !!alg.kisaoId;
      })
      .map(this.mapAlgorithms, this);
    UtilsService.recursiveForkJoin(unresolvedAlgorithms).subscribe(
      (algorithms: ViewAlgorithm[] | undefined) => {
        if (algorithms !== undefined) {
          algorithms.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          });

          algorithms.forEach((algorithm: ViewAlgorithm): void => {
            algorithm.modelingFrameworks.sort(
              (a: ViewFramework, b: ViewFramework): number => {
                return a.name.localeCompare(b.name, undefined, {
                  numeric: true,
                });
              },
            );
            algorithm.modelFormats.sort(
              (a: ViewFormat, b: ViewFormat): number => {
                return a.term.name.localeCompare(b.term.name, undefined, {
                  numeric: true,
                });
              },
            );
            algorithm.simulationFormats.sort(
              (a: ViewFormat, b: ViewFormat): number => {
                return a.term.name.localeCompare(b.term.name, undefined, {
                  numeric: true,
                });
              },
            );
            algorithm.archiveFormats.sort(
              (a: ViewFormat, b: ViewFormat): number => {
                return a.term.name.localeCompare(b.term.name, undefined, {
                  numeric: true,
                });
              },
            );

            algorithm.parameters?.forEach((parameter: ViewParameter): void => {
              if (
                parameter.type !== ValueType.boolean &&
                parameter.type !== ValueType.integer &&
                parameter.type !== ValueType.float &&
                parameter.range
              ) {
                (parameter.range as string[]).sort((a: string, b: string) => {
                  return a.localeCompare(b, undefined, { numeric: true });
                });
              }
            });
          });
          viewSimAlgorithms.next(algorithms);
        }
      },
    );

    return viewSim;
  }

  mapAlgorithms(value: Algorithm): ViewAlgorithmObservable {
    const kisaoTerm = this.ontService.getKisaoTerm(value.kisaoId.id);
    const kisaoName = kisaoTerm.pipe(pluck('name'));

    return {
      kisaoId: value.kisaoId.id,

      name: kisaoName,
      heading: kisaoName.pipe(
        map((nameval: string) => nameval + ' (' + value.kisaoId.id + ')'),
      ),
      description: kisaoTerm.pipe(
        pluck('description'),
        map(this.formatKisaoDescription),
      ),
      kisaoUrl: kisaoTerm.pipe(pluck('url')),
      modelingFrameworks: value.modelingFrameworks.map(
        this.getFrameworks,
        this,
      ),
      modelFormats: value.modelFormats.map(this.getFormats, this),
      simulationFormats: value.simulationFormats.map(this.getFormats, this),
      archiveFormats: value.archiveFormats.map(this.getFormats, this),
      parameters: value.parameters
        ? value.parameters.map(this.getParameters, this)
        : null,
      dependentDimensions: value?.dependentDimensions
        ? (value?.dependentDimensions?.map(
            this.getDependentDimensions,
            this,
          ) as Observable<ViewSioId>[])
        : null,
      dependentVariableTargetPatterns:
        value?.dependentVariableTargetPatterns || [],
      availableSoftwareInterfaceTypes: value.availableSoftwareInterfaceTypes
        .map((interfaceType: SoftwareInterfaceType): string => {
          return (
            interfaceType.substring(0, 1).toUpperCase() +
            interfaceType.substring(1)
          );
        })
        .sort((a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        }),
      dependencies: value?.dependencies
        ? value?.dependencies?.sort(
            (a: DependentPackage, b: DependentPackage) => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            },
          )
        : null,
      citations: value?.citations
        ? value.citations.map(this.makeCitation, this)
        : [],
    };
  }

  getParameters(parameter: AlgorithmParameter): ViewParameterObservable {
    const kisaoTerm = this.ontService.getKisaoTerm(parameter.kisaoId.id);

    return {
      name: kisaoTerm.pipe(pluck('name')),
      type: parameter.type,
      value: this.parseParameterVal(parameter.type, parameter.value),
      range: parameter.recommendedRange
        ? (parameter.recommendedRange.map(
            this.parseParameterVal.bind(this, parameter.type),
          ) as (boolean | number | string | Observable<string>)[])
        : null,
      kisaoId: parameter.kisaoId.id,
      kisaoUrl: this.ontService.getKisaoUrl(parameter.kisaoId.id),
      availableSoftwareInterfaceTypes: parameter.availableSoftwareInterfaceTypes.sort(
        (a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        },
      ),
    };
  }

  parseParameterVal(
    type: string,
    val: string | null,
  ): boolean | number | string | Observable<string> | null {
    if (val == null || val === '') {
      return null;
    } else {
      if (type === ValueType.kisaoId) {
        return this.ontService.getKisaoTerm(val).pipe(pluck('name'));
      } else if (type === ValueType.boolean) {
        return ['1', 'true'].includes(val.toLowerCase());
      } else if (type === ValueType.integer) {
        return parseInt(val);
      } else if (type === ValueType.float) {
        return parseFloat(val);
      } else {
        return val;
      }
    }
  }

  getDependentDimensions(value: ISioOntologyId): Observable<ViewSioId> {
    return this.ontService.getSioTerm(value.id);
  }

  getFrameworks(value: ISboOntologyId): Observable<ViewFramework> {
    return this.ontService.getSboTerm(value.id);
  }

  getFormats(value: IEdamOntologyIdVersion): ViewFormatObservable {
    return {
      term: this.ontService.getEdamTerm(value.id),
      version: value.version,
      supportedFeatures: value?.supportedFeatures?.sort(
        (a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        },
      ),
    };
  }

  setVersionDate(value: Version): ViewVersion {
    return {
      label: value.version,
      created: this.getDateStr(new Date(value.created as Date)),
      image: value.image,
      curationStatus: value.curationStatus,
    };
  }

  getAuthors(simulator: Simulator): ViewAuthor[] {
    return simulator?.authors?.map(
      (author: Person): ViewAuthor => {
        let name = author.lastName;
        if (author.middleName) {
          name = author.middleName + ' ' + name;
        }
        if (author.firstName) {
          name = author.firstName + ' ' + name;
        }

        let orcidUrl: string | null = null;
        for (const identifier of author.identifiers) {
          if (identifier.namespace === 'orcid') {
            orcidUrl = identifier.url;
          }
        }

        return { name, orcidUrl };
      },
    );
  }

  formatKisaoDescription(value: string | null): DescriptionFragment[] | null {
    if (value == null) {
      return null;
    }

    const formattedValue: DescriptionFragment[] = [];
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

  makeIdentifier(identifier: Identifier): ViewIdentifier {
    return {
      text: identifier.namespace + ':' + identifier.id,
      url: this.getIdentifierUrl(identifier),
    };
  }

  makeCitation(citation: Citation): ViewCitation {
    let text = citation.authors + '. ' + citation.title;
    if (citation.journal) {
      text += '. <i>' + citation.journal + '</i>';
    }
    if (citation.volume) {
      text += ' ' + citation.volume;
    }
    if (citation.issue) {
      text += ' (' + citation.issue + ')';
    }
    if (citation.pages) {
      text += ', ' + citation.pages.replace(/-+/g, '–');
    }
    text += ' (' + citation.year + ').';

    const identifier = citation?.identifiers?.[0];
    let url: string | null = null;
    if (identifier) {
      url = this.getIdentifierUrl(identifier);
    }

    return {
      text: text,
      url: url,
    };
  }

  getIdentifierUrl(identifier: Identifier): string {
    return identifier.url;
  }

  getDateStr(date: Date): string {
    return (
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  }

  getFunding(funding: Funding): ViewFunding {
    return {
      funderName: this.ontService
        .getFunderRegistryTerm(funding.funder.id)
        .pipe(pluck('name')),
      funderUrl: this.ontService
        .getFunderRegistryTerm(funding.funder.id)
        .pipe(pluck('url')),
      grant: funding.grant,
      url: funding.url,
    };
  }
}
