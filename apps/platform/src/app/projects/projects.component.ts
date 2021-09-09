import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'biosimulations-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public projects$!: Observable<
    { id: string; thumbnails: string[]; title: string }[]
  >;
  public gridColumns: any;
  constructor(private service: ProjectsService) {}

  ngOnInit(): void {
    this.projects$ = this.service.getProjects();
  }
}
