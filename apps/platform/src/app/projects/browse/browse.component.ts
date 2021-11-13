import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BrowseService } from './browse.service';
import { FormattedProjectSummary } from './browse.model';
import {
  Column,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import { FormatService } from '@biosimulations/shared/services';
import { LabeledIdentifier } from '@biosimulations/datamodel/common';

@Component({
  selector: 'biosimulations-projects-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  public projects$!: Observable<FormattedProjectSummary[]>;

  public columns: Column[] = [
    {
      id: 'id',
      key: 'id',
      heading: 'Id',
      hidden: true,
      show: false,
      filterable: false,
    },
    {
      id: 'title',      
      key: 'title',
      heading: 'Title',
      filterable: false,
      hidden: false,
      show: true,
    },
    {
      id: 'abstract',      
      key: ['metadata', 'abstract'],
      heading: 'Abstract',
      filterable: false,
      hidden: false,
      show: true,
    },
    {
      id: 'description',
      key: ['metadata', 'description'],
      heading: 'Description',
      filterable: false,
      hidden: true,
      show: false,
    },
    {
      id: 'keywords',
      key: ['metadata', 'keywords'],
      heading: 'Keywords',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.keywords.map((v: LabeledIdentifier) => v.label) as string[];
      },
    },
    //keywords: LabeledIdentifier[];
    //taxa: LabeledIdentifier[];
    //encodes: LabeledIdentifier[];
    //identifiers: LabeledIdentifier[];
    //citations: LabeledIdentifier[];
    //creators: LabeledIdentifier[];
    //contributors: LabeledIdentifier[];
    //license?: LabeledIdentifier[];
    //funders: LabeledIdentifier[];    
    {
      id: 'projectSize',      
      key: ['simulationRun', 'projectSize'],
      heading: 'Project size (MB)',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): number => {
        return project.simulationRun.projectSize / 1e6;
      },
      formatter: (value: number): string => {
        return FormatService.formatDigitalSize(value * 1e6);
      },
      filterType: ColumnFilterType.number,
    },
    // model format
    // simulation algorithm
    {
      id: 'simulatorId',      
      key: ['simulationRun', 'simulator'],
      heading: 'Simulator',
      hidden: true,
      show: false,
      filterable: false,
    },
    {
      id: 'simulator',      
      key: ['simulationRun', 'simulatorName'],
      heading: 'Simulator',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string => {
        return project.simulationRun.simulatorName + ' ' + project.simulationRun.simulatorVersion;
      },
    },
    {
      id: 'cpus',      
      key: ['simulationRun', 'cpus'],
      heading: 'CPUs',
      hidden: false,
      show: false,
      filterable: true,
      filterType: ColumnFilterType.number,
    },
    {
      id: 'memory',      
      key: ['simulationRun', 'memory'],
      heading: 'Memory (GB)',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: number): string => {
        return FormatService.formatDigitalSize(value);
      },
      filterType: ColumnFilterType.number,
    },
    {
      id: 'runtime',      
      key: ['simulationRun', 'runtime'],
      heading: 'Runtime (min)',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): number => {
        return project.simulationRun.runtime / 60;
      },
      formatter: (value: number): string => {
        return FormatService.formatDuration(value * 60);
      },
      filterType: ColumnFilterType.number,
    },
    {
      id: 'resultsSize',      
      key: ['simulationRun', 'resultsSize'],
      heading: 'Results size (MB)',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): number => {
        return project.simulationRun.resultsSize / 1e6;
      },
      formatter: (value: number): string => {
        return FormatService.formatDigitalSize(value * 1e6);
      },
      filterType: ColumnFilterType.number,
    },
    {
      id: 'created',      
      key: ['metadata', 'created'],
      heading: 'Created',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: Date): string => {
        return FormatService.formatDate(value);
      },
      filterType: ColumnFilterType.date,
    },
    {
      id: 'published',      
      key: 'created',
      heading: 'Published',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: Date): string => {
        return FormatService.formatDate(value);
      },
      filterType: ColumnFilterType.date,
    },
    {
      id: 'updated',      
      key: 'updated',
      heading: 'Updated',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: Date): string => {
        return FormatService.formatDate(value);
      },
      filterType: ColumnFilterType.date,
    },    
  ];

  constructor(private service: BrowseService) {
    this.openControls = this.openControls.bind(this);
  }

  ngOnInit(): void {
    this.projects$ = this.service.getProjects();
  }

  public controlsOpen = false;

  public openControls(route: string, router: Router): void {
    this.controlsOpen = !this.controlsOpen;
  }
}
