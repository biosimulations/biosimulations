import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Model } from '../../Models/model';

@Component({
  selector: 'app-model-cards',
  templateUrl: './model-cards.component.html',
  styleUrls: ['./model-cards.component.sass']
})
export class ModelCardsComponent {
  @Input() models: Model[];
  @Input() maxModels = Infinity;
  @Input() cols = 2;

  constructor(private router: Router) { }
}
