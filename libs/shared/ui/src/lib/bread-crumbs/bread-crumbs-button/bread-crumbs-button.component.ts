import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { ClipboardService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-bread-crumbs-button',
  templateUrl: './bread-crumbs-button.component.html',
  styleUrls: ['./bread-crumbs-button.component.scss'],
})
export class BreadCrumbsButtonComponent {
  @Input()
  public label!: string;

  @Input()
  public icon!: BiosimulationsIcon;

  @Input()
  public route?: string | string[];

  @Input()
  public onClick?: (
    route: string,
    router: Router,
    clipboardService: ClipboardService,
  ) => void;

  @Input()
  public hover?: string;

  public constructor(
    private router: Router,
    private clipboardService: ClipboardService,
  ) {}

  public clickHandler(): void {
    if (!this.onClick) {
      return;
    }
    const route = this.router.url;
    this.onClick(route, this.router, this.clipboardService);
  }
}
