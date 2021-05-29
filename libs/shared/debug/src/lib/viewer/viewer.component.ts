import { Component, Input, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router, ParamMap } from '@angular/router';

@Component({
  selector: 'biosimulations-debug-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  @Input()
  show = false;
  showDebug = of(false);
  showInfo = false;
  route: any;
  params!: ParamMap;
  user$: any;
  loggedIn$!: Observable<boolean>;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.showDebug = this.router.routerState.root.queryParamMap.pipe(
      tap((param) => (this.params = param)),
      map((params) => params.get('debug') !== null),
    );
    if (this.show) {
      this.showDebug = of(true);
    }
    this.route = this.router.routerState;
  }
}
