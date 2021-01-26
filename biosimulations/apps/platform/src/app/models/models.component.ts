import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.sass'],
})
export class ModelsComponent {
  constructor(public config: ConfigService) {}
}
