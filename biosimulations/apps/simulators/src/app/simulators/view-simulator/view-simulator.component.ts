import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { pluck, map, mergeAll, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// import { SimulatorService, Simulator } from '../services/simulator.service';

@Component({
  selector: 'biosimulations-view-simulator',
  templateUrl: './view-simulator.component.html',
  styleUrls: ['./view-simulator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSimulatorComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private simulatorService: SimulatorService,
  ) {}
  id$!: Observable<string>;
  // simulator$!: Observable<Simulator | undefined>;
  isLoading = true;
  // TODO handler errors from simulator service
  error = false;
  ngOnInit(): void {
    this.id$ = this.route.params.pipe(pluck('id'));
    /*
    this.simulator$ = this.id$.pipe(
      map((id: string) => this.simulatorService.get(id)),
      mergeAll(),
      tap((_) => (this.isLoading = false)),
      catchError((err: any) =>
        of(undefined).pipe(tap((_) => (this.error = err))),
      ),
    );
    */
  }
}
