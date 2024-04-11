import { Component, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

import { FormattedSimulation } from '../view.model';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SharedSimulationService } from '../../../../../../../../libs/shared/services/src/lib/shared-simulation/shared-simulation.service';

@Component({
  selector: 'biosimulations-simulation-run-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  @Input() public simulation!: FormattedSimulation;
  @Input() public hasSbml!: boolean;

  public constructor(private sharedSimulationService: SharedSimulationService, public snackBar: MatSnackBar) {
    /* Constructor is empty */
  }

  public rerunProject(id: string): void {
    this.sharedSimulationService.rerunProject(id);
  }

  public rerunCustomProject(id: string): void {
    this.sharedSimulationService.rerunCustomProject(id);
  }

  public rerunNotSupported(): MatSnackBarRef<TextOnlySnackBar> {
    const msg =
      'This feature is only currently available for models encoded in BNGL, CellML, SBML, SBML-fbc, ' +
      'SBML-qual, and Smoldyn.';
    return this.snackBar.open(msg, 'Ok', {
      duration: 15000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
