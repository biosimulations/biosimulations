import { Component, OnInit } from '@angular/core';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { ActivatedRoute } from '@angular/router';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { TimeFormatHumanReadablePipe } from 'src/app/Shared/Pipes/time-format-human-readable.pipe';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  id: string;
  simulation: Simulation;

  constructor(
    private simulationService: SimulationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      if (this.id) {
        this.getData();
      }
    });
  }

  getData() {
    this.simulation = this.simulationService.getSimulation(this.id);
  }
}
