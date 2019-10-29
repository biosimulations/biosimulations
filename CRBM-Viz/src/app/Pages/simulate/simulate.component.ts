import { Component, OnInit } from '@angular/core';
import { SimulationService } from 'src/app/Services/simulation.service';

@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.sass']
})
export class SimulateComponent implements OnInit {

  constructor(private simulationService: SimulationService) { }

  ngOnInit() {
    this.simulationService.getSimulationAndJobFilesInfo();
  }

}
