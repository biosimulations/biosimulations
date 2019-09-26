import { Component, OnInit } from '@angular/core';
import { Visualization } from 'src/app/Models/visualization';
import { VisualizationsService } from 'src/app/Services/visualizations.service';
@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.sass'],
})
export class VisualizeComponent implements OnInit {
  visualizations: Visualization[];
  constructor(private visService: VisualizationsService) {}

  ngOnInit() {
    this.visualizations = this.visService.getVisualizations();
  }
}
