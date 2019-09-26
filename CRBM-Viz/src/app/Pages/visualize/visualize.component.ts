import { Component, OnInit } from '@angular/core';
import { Visualization } from 'src/app/Models/visualization';
import { VisualizationsService } from 'src/app/Services/visualizations.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.sass'],
})
export class VisualizeComponent implements OnInit {
  visualizations: Visualization[] = [];

  constructor(private visService: VisualizationsService) {}

  ngOnInit() {
    this.visService.getVisualizations().subscribe((res: Visualization[]) => {
      this.visualizations = res;
      console.log(res);
      console.log(typeof this.visualizations[0].spec);
      console.log(this.visualizations[0].spec);
    });
  }
}
