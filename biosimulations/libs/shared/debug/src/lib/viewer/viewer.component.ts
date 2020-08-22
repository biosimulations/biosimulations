import { Component, OnInit, Optional } from '@angular/core';
import { of, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'biosimulations-debug-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  showDebug = of(false);
  showInfo = false;
  route: any;
  params!: ParamMap;
  user$: any;
  loggedIn$!: Observable<boolean>;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.showDebug = this.router.routerState.root.queryParamMap.pipe(
      tap((param) => (this.params = param)),
      map((params) => params.get('debug') !== null),
    );
    this.route = this.router.routerState;

  }
}
