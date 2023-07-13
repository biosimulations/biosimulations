import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from './services/health/health.service';
import { UpdateService } from '@biosimulations/shared/pwa';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'simulators';
  public platformPointer = 'https://biosimulations.dev';
  public dispatchPointer = 'https://run.biosimulations.dev';
  public devPointer = '.dev';

  public healthy$!: Observable<boolean>;

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
  ) {}

  public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
    this.handleUrlPointers();
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }

  private handleUrlPointers(): void {
    this.config.platformAppUrl = this.getUrlPointer('biosimulations');
    //this.config.dispatchAppUrl = this.getUrlPointer('run.biosimulations');
  }

  private getUrlPointer(site: string, pointer = ''): string {
    if (!pointer.length) {
      pointer = this.platformPointer;
    }
    return 'https://' + site + '.' + pointer;
  }
}
