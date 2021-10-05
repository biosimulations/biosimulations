import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { ScrollService } from '@biosimulations/shared/services';

export type IconActionType =
  | 'scrollToTop'
  | 'routerLink'
  | 'href'
  | 'toggle'
  | null;

@Component({
  selector: 'biosimulations-text-page-content-section',
  templateUrl: './text-page-content-section.component.html',
  styleUrls: ['./text-page-content-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageContentSectionComponent {
  _scrollToTopOffset = 64 + 1;

  @Input()
  set scrollToTopOffset(value: number) {
    this._scrollToTopOffset = value;
    this.setIconAction();
  }

  get scrollToTopOffset(): number {
    return this._scrollToTopOffset;
  }

  @Input()
  heading = '';

  @Input()
  icon: BiosimulationsIcon = 'toTop';

  _iconAction!: any;
  _iconActionType: IconActionType = 'scrollToTop';

  @Input()
  set iconAction(iconAction: any) {
    this._iconAction = iconAction;
    this.setIconAction();
  }

  get iconAction(): any {
    return this._iconAction;
  }

  @Input()
  set iconActionType(iconActionType: IconActionType) {
    this._iconActionType = iconActionType;
    this.setIconAction();
  }

  get iconActionType(): IconActionType {
    return this._iconActionType;
  }

  iconRouterLink: any = null;
  iconHref: string | null = null;
  iconClick: (() => void) | null = this.scrollService.scrollToTop.bind(
    this.scrollService,
    this.scrollToTopOffset,
  );

  setIconAction(): void {
    if (this._iconActionType === 'scrollToTop') {
      this.iconRouterLink = null;
      this.iconHref = null;
      this.iconClick = this.scrollService.scrollToTop.bind(
        this.scrollService,
        this.scrollToTopOffset,
      );
    } else if (this._iconActionType === 'routerLink') {
      this.iconRouterLink = this._iconAction;
      this.iconHref = null;
      this.iconClick = null;
    } else if (this._iconActionType === 'href') {
      this.iconRouterLink = null;
      this.iconHref = this._iconAction;
      this.iconClick = null;
    } else if (this._iconActionType === 'toggle') {
      this.icon = 'open';
      this.closed = true;
      this.iconRouterLink = null;
      this.iconHref = null;
      this.iconClick = () => {
        this.closed = !this.closed;

        // TODO: make the toggle icon change; this seems like a change detection issue
        this.icon = this.closed ? 'closed' : 'open';
      };
    } else {
      this.iconRouterLink = null;
      this.iconHref = null;
      this.iconClick = null;
    }
  }

  @Input()
  highlight = false;

  @Input()
  compact = false;

  @Input()
  first = false;

  @Input()
  last = false;

  @Input()
  closed = false;

  constructor(private scrollService: ScrollService) {}
}
