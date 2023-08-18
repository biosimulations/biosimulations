import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'biosimulations-navigation',
  templateUrl: './biosimulations-navigation.component.html',
  styleUrls: ['./biosimulations-navigation.component.scss'],
})
export class BiosimulationsNavigationComponent implements OnInit {
  @Input()
  public appName!: string;

  @Input()
  public appNameParts!: string[];

  @Input()
  public logo!: string;

  @Input()
  public privacyPolicyVersion!: number;

  @Input()
  public newsVersion!: number;

  @Input()
  public showNews!: boolean;

  @Input()
  public healthy!: boolean | null;

  @Input()
  public darkMode = false;

  public useSimulations = true;

  public simulationsColor = '#2196f3';

  public simulatorsColor = '#ff9800';

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  public constructor(private breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    if (this.appName === 'BioSimulators') {
      this.useSimulations = !this.useSimulations;
    }
  }
}
