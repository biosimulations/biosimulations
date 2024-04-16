import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { SharedSimulationService } from '../../../../../../../libs/shared/services/src/lib/shared-simulation/shared-simulation.service';

@Component({
  selector: 'biosimulations-customize-simulation',
  templateUrl: './customize-simulation.component.html',
  styleUrls: ['./customize-simulation.component.scss'],
})
export class CustomizeSimulationComponent implements OnInit {
  public sedParamsForm: FormGroup;

  public constructor(private formBuilder: FormBuilder, simService: SharedSimulationService) {
    this.sedParamsForm = this.formBuilder.group({});
  }

  public ngOnInit() {}
}
