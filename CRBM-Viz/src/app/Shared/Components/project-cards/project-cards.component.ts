import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../Models/project';

@Component({
  selector: 'app-project-cards',
  templateUrl: './project-cards.component.html',
  styleUrls: ['./project-cards.component.sass']
})
export class ProjectCardsComponent {
  @Input() projects: Project[];
  @Input() maxProjects = Infinity;

  constructor(private router: Router) { }
}
