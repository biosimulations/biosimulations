import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pluck, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  state: Observable<string>;
  token: Observable<string>;
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.state = this.route.queryParams.pipe(pluck('state'));
    this.token = this.route.queryParams.pipe(pluck('token'));
  }
  continueLogin() {
    this.state.subscribe(
      state =>
        (window.location.href =
          'https://auth.biosimulations.dev/continue?state=' + state),
    );
  }
}
