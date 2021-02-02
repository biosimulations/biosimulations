import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/services';

export enum IconActionType {
  scrollToTop = 'scrollToTop',
  routerLink = 'routerLink',
  href = 'href',
  toggle = 'toggle',
}

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
  icon = 'toTop';

  _iconAction!: any;
  _iconActionType = IconActionType.scrollToTop;

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
  iconClick: () => void = this.scrollService.scrollToTop.bind(
    this.scrollService,
    this.scrollToTopOffset,
  );

  setIconAction(): void {
    if (this._iconActionType === IconActionType.scrollToTop) {
      this.iconRouterLink = null;
      this.iconHref = null;
      this.iconClick = this.scrollService.scrollToTop.bind(
        this.scrollService,
        this.scrollToTopOffset,
      );
    } else if (this._iconActionType === IconActionType.routerLink) {
      this.iconRouterLink = this._iconAction;
      this.iconHref = null;
      this.iconClick = () => {};
    } else if (this._iconActionType === IconActionType.href) {
      this.iconRouterLink = null;
      this.iconHref = this._iconAction;
      this.iconClick = () => {};
    } else if (this._iconActionType === IconActionType.toggle) {
      this.icon = 'open';
      this.closed = true;
      this.iconRouterLink = null;
      this.iconHref = null;
      this.iconClick = () => {
        this.closed = !this.closed;

        // TODO: make the toggle icon change; this seems like a change detection issue
        this.icon = this.closed ? 'open' : 'close';
      };
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
