import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'biosimulations-debug-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  showDebug = of(false);
  constructor(private route: Router) {}

  ngOnInit(): void {
    this.showDebug = this.route.routerState.root.queryParamMap.pipe(
      tap(param => console.log(param)),
      map(params => params.get('debug') !== null),
    );
  }
}
