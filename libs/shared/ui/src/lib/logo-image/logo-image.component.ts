import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-logo-image',
  templateUrl: './logo-image.component.html',
  styleUrls: ['./logo-image.component.scss'],
})
export class LogoImageComponent implements OnInit {
  @Input()
  logo = 'assets/images/biosimulations-logo/logo.svg';

  @Input()
  simulatorsLogo = 'assets/images/biosimulators-logo/logo.svg';

  @Input()
  useSimulatorsLogo = false;

  ngOnInit(): void {
    this.logo = this.useSimulatorsLogo ? this.simulatorsLogo : this.logo;
  }
}
