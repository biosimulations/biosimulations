import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { UtilsService } from '@biosimulations/shared/services';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { ProjectsService } from '../projects.service';
import { pluck, map, Observable, of } from 'rxjs';
import { SimulatorIdNameMap } from '../datamodel';

interface Item {
  title: string;  
  value: Observable<string>;
  icon: BiosimulationsIcon;
  href: string | null;
}

interface Section {
  title: string;  
  items: Item[];
}

@Component({
  selector: 'biosimulations-project-simulation',
  templateUrl: './project-simulation.component.html',
  styleUrls: ['./project-simulation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSimulationComponent {
  @Input()
  set simulationRun(value: any) { // SimulationRun
    this.initSections(value);
  }

  sections!: Section[];

  constructor(private projectsService: ProjectsService) {}

  private initSections(simulationRun: any) {
    const methods: Item[] = [];

    /* TODO: add simulation algorithms
    for () {
      methods.push({
        title: 'Simulation algorithm',
        value: of('SED-ML'),
        icon: 'code',
        href: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + id
      });
    }
    */

    const formats: Item[] = [];
    formats.push({
      title: 'Project',
      value: of('COMBINE/OMEX'),
      icon: 'format',
      href: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
    });

    /* TODO: add model format(s)
    for () {
      formats.push({
        title: 'Model',
        value: of('SBML'),
        icon: 'format',
        href: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
      });
    }
    */

    formats.push({
      title: 'Simulation',
      value: of('SED-ML'),
      icon: 'format',
      href: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3685'
    });

    const tools: Item[] = [];
    const simulator = this.projectsService.getSimulatorIdNameMap().pipe(
      map((simulatorIdNameMap: SimulatorIdNameMap): string => {
        return simulatorIdNameMap[simulationRun.simulator] + ' ' + simulationRun.simulatorVersion;
      })
    );
    tools.push({
      title: 'Simulator',
      value: simulator,
      icon: 'simulator',
      href: `https://biosimulators.org/simulators/${simulationRun.simulator}/${simulationRun.simulatorVersion}`,
    });

    const compResources: Item[] = [];

    compResources.push({
      title: 'Project',
      value: of(UtilsService.formatDigitalSize(simulationRun.projectSize)),
      icon: 'disk',
      href: null,
    });

    compResources.push({
      title: 'Results',
      value: of(UtilsService.formatDigitalSize(simulationRun.resultsSize)),
      icon: 'disk',
      href: null,
    });

    const durationSec = this.projectsService.getProjectSimulationLog(simulationRun.id)
      .pipe(
        pluck('duration'),
        map((durationSec: number): string => UtilsService.formatDuration(durationSec) as string),
      );
    compResources.push({
      title: 'Duration',
      value: durationSec,
      icon: 'duration',
      href: null,
    });

    compResources.push({
      title: 'CPUs',
      value: of(simulationRun.cpus.toString()),
      icon: 'processor',
      href: null,
    });

    compResources.push({
      title: 'Memory',
      value: of(UtilsService.formatDigitalSize(simulationRun.memory * 1e9)),
      icon: 'memory',
      href: null,
    });

    const run: Item[] = [];

    run.push({
      title: 'Id',
      value: of(simulationRun.id),
      icon: 'id',
      href: `https://run.biosimulations.org/simulations/${simulationRun.id}`,
    });

    run.push({
      title: 'Submitted',
      value: of(UtilsService.getDateTimeString(new Date(simulationRun.submitted))),
      icon: 'date',
      href: null,
    });

    run.push({
      title: 'Completed',
      value: of(UtilsService.getDateTimeString(new Date(simulationRun.updated))),
      icon: 'date',
      href: null,
    });

    run.push({
      title: 'Log',
      value: of('Log'),
      icon: 'logs',
      href: 'https://run.biosimulations.org/simulations/${simulationRun.id}#tab=log',
    });

    // data
    this.sections = [
      {title: 'Methods', items: methods},
      {title: 'Formats', items: formats},
      {title: 'Tools', items: tools},
      {title: 'Computational resources', items: compResources},
      {title: 'Simulation run', items: run},
    ];
  }
}
