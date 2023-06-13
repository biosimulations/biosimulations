import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { UpdateService } from '@biosimulations/shared/pwa';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'platform';

  public healthy$!: Observable<boolean>;

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
    private snackBar: MatSnackBar,
  ) {}

  /*public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
  }*/

  public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
    this.healthy$.subscribe({
      error: (err) => {
        this.snackBar.open(
          'Something went wrong. If this issue persists, please contact our development team at info@biosimulations.org',
          'Close',
          {
            duration: 5000,
          },
        );
      },
    });
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
