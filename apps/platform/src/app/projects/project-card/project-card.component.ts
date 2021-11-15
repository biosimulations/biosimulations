import { Component, Input, OnInit } from '@angular/core';
import { Column } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() public project!: any;

  @Input() public columns!: Column[];

  public route!: string;

  public constructor() {}

  public ngOnInit(): void {
    this.route = `/projects/${this.project.id}`;
  }

  public isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
