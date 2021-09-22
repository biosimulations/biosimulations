import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() public project: { id: string; title: string; thumbnails: string[] } =
    { id: '', title: '', thumbnails: [] };
  public url = '';
  public constructor() {}
  public ngOnInit(): void {
    this.url = `/projects/${this.project.id}`;
  }
}
