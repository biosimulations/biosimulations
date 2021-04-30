import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispatchService, SimulatorsData, SimulatorSpecsMap, OntologyTerm, OntologyTermsMap } from '../../../services/dispatch/dispatch.service';
import { CombineService } from '../../../services/combine/combine.service';
import { AlgorithmSubstitution, AlgorithmSubstitutionPolicy } from '../../../kisao.interface';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Algorithm {
  id: string;
  name: string;
  url?: string;
}

interface AltAlgPolicy {
  policy: AlgorithmSubstitutionPolicy;
  algorithms: Algorithm[];
}

interface Simulator {
  id: string;
  name: string;
  url: string;
  algorithms: Algorithm[];
}

interface SimulatorAlgPolicy {
  policy: AlgorithmSubstitutionPolicy;
  simulators: Simulator[];
}

interface Suggestions {
  altAlgsByPolicies: AltAlgPolicy[];
  simulatorsByPolicies: SimulatorAlgPolicy[];
}

@Component({
  selector: 'biosimulations-suggest-simulator',
  templateUrl: './suggest-simulator.component.html',
  styleUrls: ['./suggest-simulator.component.scss'],
})
export class SuggestSimulatorComponent implements OnInit, OnDestroy {
  algorithms: Observable<Algorithm[]> | undefined = undefined;
  private algorithmsMap: OntologyTermsMap | undefined = undefined;
  private simulatorSpecsMap: SimulatorSpecsMap | undefined = undefined;

  formGroup: FormGroup;
  selectedAlgorithm: Algorithm | undefined = undefined;

  suggestions: Observable<Suggestions | undefined> | undefined = undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private combineService: CombineService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        algorithm: [null, [Validators.required]],
      },
    );
    this.formGroup.controls.algorithm.disable();
  }

  ngOnInit(): void {
    const simulatorsDataObs = this.dispatchService.getSimulatorsFromDb();
    const algorithmsMapObs = simulatorsDataObs.pipe(
      map((simulatorsData: SimulatorsData): OntologyTermsMap => {
        return simulatorsData.simulationAlgorithms;
      }));
    const simulatorSpecsMapObs = simulatorsDataObs.pipe(
      map((simulatorsData: SimulatorsData): SimulatorSpecsMap => {
        return simulatorsData.simulatorSpecs;
      }));

    this.algorithms = combineLatest([algorithmsMapObs, this.activatedRoute.queryParams]).pipe(
      map((algorithmsMapParams: [OntologyTermsMap, Params]): Algorithm[] => {
        this.algorithmsMap = algorithmsMapParams[0];
        const params = algorithmsMapParams[1];

        const algorithms = Object.values(this.algorithmsMap)
          .map((alg: OntologyTerm): Algorithm => {
            return {
              id: alg.id,
              name: alg.name,
            };
          });
        algorithms.sort((a: Algorithm, b: Algorithm): number => {
          return a.name.localeCompare(b.name, undefined, { numeric: true });
        });

        const simulationAlgorithm = params?.simulationAlgorithm;
        if (simulationAlgorithm) {
          this.formGroup.controls.algorithm.setValue(simulationAlgorithm)
        }

        this.formGroup.controls.algorithm.enable();
        return algorithms;
      })
    );

    const simulatorSpecsSub = simulatorSpecsMapObs.subscribe(
      (simulatorSpecsMap: SimulatorSpecsMap): void => {
        this.simulatorSpecsMap = simulatorSpecsMap;
      });
    this.subscriptions.push(simulatorSpecsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe(),
    );
  }

  getAlgorithmSimulatorSuggestions(): void {
    const selectedAlgorithmId = this.formGroup.controls.algorithm.value;
    this.selectedAlgorithm = {
      id: selectedAlgorithmId,
      name: this.algorithmsMap?.[selectedAlgorithmId]?.name as string,
      url: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + selectedAlgorithmId,
    }
    this.suggestions = undefined;

    this.suggestions = this.combineService.getSimilarAlgorithms(selectedAlgorithmId).pipe(
      map((altAlgs: AlgorithmSubstitution[] | undefined): Suggestions | undefined => {
        if (altAlgs) {
          const altAlgsByPolicies: any = {};
          const simulatorAlgPolicies: any = {};
          altAlgs
            .filter((altAlg: AlgorithmSubstitution): boolean => {
              return altAlg.algorithm.id in (this.algorithmsMap as OntologyTermsMap);
            })
            .forEach((altAlg: AlgorithmSubstitution): void => {
              if (!(altAlg.maxPolicy.id in altAlgsByPolicies)) {
                altAlgsByPolicies[altAlg.maxPolicy.id] = {
                  policy: altAlg.maxPolicy,
                  algorithms: [],
                };
              }
              altAlgsByPolicies[altAlg.maxPolicy.id].algorithms.push({
                id: altAlg.algorithm.id,
                name: altAlg.algorithm.name,
                url: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + altAlg.algorithm.id,
              });

              this.algorithmsMap?.[altAlg.algorithm.id]?.simulators?.forEach((simulator: string): void => {
                if (!(simulator in simulatorAlgPolicies)) {
                  simulatorAlgPolicies[simulator] = {
                    id: simulator,
                    algPolicies: [],
                  };
                }
                simulatorAlgPolicies[simulator].algPolicies.push(altAlg)
              });
            });

          const simulatorAlgMaxPolicies = Object.values(simulatorAlgPolicies)
            .map((simulatorAlgPolicies: any): any => {
              let maxPolicy = simulatorAlgPolicies.algPolicies[0].maxPolicy;
              simulatorAlgPolicies.algPolicies.forEach((altAlg: AlgorithmSubstitution): void => {
                if (altAlg.maxPolicy.level < maxPolicy.level) {
                  maxPolicy = altAlg.maxPolicy;
                }
              });

              const algorithms = simulatorAlgPolicies.algPolicies
                .filter((altAlg: AlgorithmSubstitution): boolean => {
                  return altAlg.maxPolicy.level <= maxPolicy.level;
                })
                .map((altAlg: AlgorithmSubstitution): Algorithm => {
                  return {
                    id: altAlg.algorithm.id,
                    name: altAlg.algorithm.name,
                    url: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + altAlg.algorithm.id,
                  }
                });
              algorithms.sort((a: Algorithm, b: Algorithm): number => {
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              });

              return {
                id: simulatorAlgPolicies.id,
                maxPolicy,
                algorithms,
              };
            });

          const simulatorsByPolicies: {[id: string]: SimulatorAlgPolicy} = {};
          simulatorAlgMaxPolicies.forEach((simulatorAlgMaxPolicy: any): void => {
            if (!(simulatorAlgMaxPolicy.maxPolicy.id in simulatorsByPolicies)) {
              simulatorsByPolicies[simulatorAlgMaxPolicy.maxPolicy.id] = {
                policy: simulatorAlgMaxPolicy.maxPolicy,
                simulators: [],
              }
            }

            simulatorsByPolicies[simulatorAlgMaxPolicy.maxPolicy.id].simulators.push({
              id: simulatorAlgMaxPolicy.id,
              name: this.simulatorSpecsMap?.[simulatorAlgMaxPolicy.id]?.name as string,
              url: 'https://biosimulators.org/simulators/' + simulatorAlgMaxPolicy.id,
              algorithms: simulatorAlgMaxPolicy.algorithms,
            });
          });

          const altAlgsByPoliciesList = (Object.values(altAlgsByPolicies) as AltAlgPolicy[])
            .filter((altAlgPolicy: AltAlgPolicy): boolean => {
              return altAlgPolicy.policy.level > 1;
            });
          altAlgsByPoliciesList.sort((a: AltAlgPolicy, b: AltAlgPolicy): number => {
            if (a.policy.level < b.policy.level) {
              return -1;
            } else if (a.policy.level > b.policy.level) {
              return 1;
            } else {
              return 0;
            }
          });

          altAlgsByPoliciesList.forEach((altAlgsByPoly: AltAlgPolicy): void => {
            altAlgsByPoly.algorithms.sort((a: Algorithm, b: Algorithm): number => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
          });

          const simulatorsByPoliciesList = (Object.values(simulatorsByPolicies) as SimulatorAlgPolicy[]);
          simulatorsByPoliciesList.sort((a: SimulatorAlgPolicy, b: SimulatorAlgPolicy): number => {
            if (a.policy.level < b.policy.level) {
              return -1;
            } else if (a.policy.level > b.policy.level) {
              return 1;
            } else {
              return 0;
            }
          });

          simulatorsByPoliciesList.forEach((simulatorsAlgPolicy: SimulatorAlgPolicy): void => {
            simulatorsAlgPolicy.simulators.sort((a: Simulator, b: Simulator): number => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
          });

          return {
            altAlgsByPolicies: altAlgsByPoliciesList,
            simulatorsByPolicies: simulatorsByPoliciesList,
          };
        } else {
          this.snackBar.open(
            'Sorry! We were unable to determine similar algorithms.',
            undefined,
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
          return undefined;
        }
      })
    );
  }
}
