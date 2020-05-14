import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'biosimulations-debug-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class DebugViewerComponent implements OnInit {
  showDebug = of(false);
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.showDebug = this.route.queryParamMap.pipe(
      tap(param => console.log(param)),
      map(params => params.get('debug') !== null),
    );
  }
}
