import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'biosimulations-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  public projects$!: Observable<
    { id: string; thumbnails: string[]; title: string }[]
  >;
  constructor(private service: ProjectsService) {}

  ngOnInit(): void {
    this.projects$ = this.service.getProjects();
  }
}
