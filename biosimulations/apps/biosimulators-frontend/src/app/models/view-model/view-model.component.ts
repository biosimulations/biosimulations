import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { pluck, map, mergeAll, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ModelService, Model } from '../services/model.service';

@Component({
  selector: 'biosimulations-view-model',
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewModelComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modelService: ModelService,
  ) {}
  id$!: Observable<string>;
  model$!: Observable<Model | undefined>;
  isLoading = true;
  // TODO handler errors from model service
  error = false;
  ngOnInit(): void {
    this.id$ = this.route.params.pipe(pluck('id'));
    this.model$ = this.id$.pipe(
      map((id: string) => this.modelService.get(id)),
      mergeAll(),
      tap((_) => (this.isLoading = false)),
      catchError((err: any) =>
        of(undefined).pipe(tap((_) => (this.error = err))),
      ),
    );
  }
}
