import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

// TODO move this component to a shared library
@Component({
  selector: 'biosimulations-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
})
export class DebugComponent implements OnInit {
  showDebug = of(false);
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.showDebug = this.route.queryParamMap.pipe(
      tap(param => console.log(param)),
      map(params => params.get('debug') !== null),
    );
  }
}
