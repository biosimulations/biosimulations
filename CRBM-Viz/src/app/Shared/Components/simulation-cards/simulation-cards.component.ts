import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Simulation } from '../../Models/simulation';

@Component({
  selector: 'app-simulation-cards',
  templateUrl: './simulation-cards.component.html',
  styleUrls: ['./simulation-cards.component.sass']
})
export class SimulationCardsComponent {
  @Input() simulations: Simulation[];
  @Input() maxSimulations: number = Infinity;
  @Input() cols: number = 2;

  constructor(private router: Router) { }
}
