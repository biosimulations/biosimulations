import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfigService } from '@biosimulations/config/angular';

type MobileView = {
  height: number;
  width: number;
  display: string;
};

@Component({
  selector: 'biosimulations-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isMobileSimulations = false;
  public mobileLinkTarget = '_blank';
  public mobileLink?: string;

  public constructor(public config: ConfigService, private observer: BreakpointObserver) {
    /* Constructor is empty */
  }

  public ngOnInit(): void {
    this.observer.observe(Breakpoints.Handset).subscribe((result) => {
      if (result.matches) {
        this.isMobileSimulations = true;
        console.log(this.handleMobileView(10, 20, 'flex'));
      } else {
        console.log('It is not there');
      }
    });
  }

  private handleMobileView(h: number, w: number, d: string): MobileView {
    const view: MobileView = {
      height: h,
      width: w,
      display: d,
    };
    return view;
  }

  public navigateToMobileLink(mobileLink: string): void {
    window.open(mobileLink, this.mobileLinkTarget);
  }
}
