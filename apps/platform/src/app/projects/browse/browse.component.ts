import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowseService } from './browse.service';
import { ProjectSummary } from './browse.model';

@Component({
  selector: 'biosimulations-projects-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  public projects$!: Observable<ProjectSummary[]>;

  constructor(private service: BrowseService) {}

  ngOnInit(): void {
    this.projects$ = this.service.getProjects();
  }
}
