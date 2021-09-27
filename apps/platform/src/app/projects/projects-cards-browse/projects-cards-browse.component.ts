import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectsService } from '../projects.service';
import { ProjectSummary } from '../datamodel';

@Component({
  selector: 'biosimulations-projects-cards-browse',
  templateUrl: './projects-cards-browse.component.html',
  styleUrls: ['./projects-cards-browse.component.scss'],
})
export class ProjectsCardsBrowseComponent implements OnInit {
  public projects$!: Observable<ProjectSummary[]>;
  public gridColumns: any;

  constructor(private service: ProjectsService) {}

  ngOnInit(): void {
    this.projects$ = this.service.getProjects();
  }
}
