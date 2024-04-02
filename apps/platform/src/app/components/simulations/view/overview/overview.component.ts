import { Component, Input, OnInit } from '@angular/core';
import { FormattedSimulation } from '../view.model';
import { SharedSimulationService } from '@biosimulations/shared/services';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'biosimulations-simulation-run-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() public simulation!: FormattedSimulation;
  @Input() public hasSbml!: boolean;

  public constructor(private sharedSimulationService: SharedSimulationService, public snackBar: MatSnackBar) {
    /* Constructor is empty */
  }

  public ngOnInit(): void {}

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
