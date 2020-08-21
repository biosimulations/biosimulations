import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'biosimulations-navigation',
  templateUrl: './biosimulations-navigation.component.html',
  styleUrls: ['./biosimulations-navigation.component.scss'],
})
export class BiosimulationsNavigationComponent {
  @Input()
  appName: string = '';

  @Input()
  logo: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
