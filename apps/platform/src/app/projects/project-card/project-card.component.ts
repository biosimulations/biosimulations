import { Component, Input, OnInit } from '@angular/core';
import { ProjectSummary } from '../browse/browse.model';

@Component({
  selector: 'biosimulations-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() public project!: ProjectSummary;

  public route = '';

  public constructor() {}

  public ngOnInit(): void {
    this.route = `/projects/${this.project.id}`;
  }
}
