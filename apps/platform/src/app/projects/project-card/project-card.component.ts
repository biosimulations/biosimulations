import { Component, Input, OnInit } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

export interface ProjectCardColumnData {
  value: string | string[];
  icon: BiosimulationsIcon;
  heading: string;
}

export interface ProjectCardInput {
  route: string;
  title: string;
  thumbnail: string;
  data: ProjectCardColumnData[];
}
@Component({
  selector: 'biosimulations-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() public projectInput!: ProjectCardInput;

  public thumbnail!: string;
  public route!: string;
  public title!: string;
  public data!: ProjectCardColumnData[];

  public constructor() {}

  public ngOnInit(): void {
    this.route = this.projectInput.route;
    this.thumbnail = this.projectInput.thumbnail;
    this.title = this.projectInput.title;
    this.data = this.projectInput.data;
  }

  public isArray(value: any): value is string[] {
    return Array.isArray(value);
  }
}
