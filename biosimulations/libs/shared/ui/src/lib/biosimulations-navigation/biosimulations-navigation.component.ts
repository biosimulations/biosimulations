import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'biosimulations-navigation',
  templateUrl: './biosimulations-navigation.component.html',
  styleUrls: ['./biosimulations-navigation.component.scss'],
})
export class BiosimulationsNavigationComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
