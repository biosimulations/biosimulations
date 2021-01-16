import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TocSection } from '../toc/toc-section';
import { Observable, BehaviorSubject } from 'rxjs';
import { ScrollService } from '@biosimulations/shared/services';

interface SideBarStyle {
  position: string | null;
  width: string | null;
  top: string | null;
}

@Component({
  selector: 'biosimulations-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageComponent {
  _heading = '';

  @Input()
  set heading(value: string) {
    this._heading = value;
    this.calcSideBarStyle();
  }

  @Input()
  contentsHeading = 'Contents';

  @Input()
  padded = true;

  private _alwaysFixed: string | null = null;

  @Input()
  set alwaysFixed(value: string | null) {
    this._alwaysFixed = value;
    this.calcSideBarStyle();
  }

  private fixed = false;
  private smallLayout = false;

  @Input()
  tocSections!: Observable<TocSection[] | null>;

  @Input()
  tocScrollSectionScrollOffset = 96;

  private sideBarStyle = new BehaviorSubject<SideBarStyle>({
    position: null,
    width: null,
    top: null,
  });
  sideBarStyle$: Observable<SideBarStyle> = this.sideBarStyle.asObservable();

  @Input()
  compact = false;

  constructor(
    breakpointObserver: BreakpointObserver,
    private changeRef: ChangeDetectorRef,
    private scrollService: ScrollService
  ) {
    this.boundScroll = this.scrollService.addScrollListener(this.scroll.bind(this));

    this.smallLayout = breakpointObserver.isMatched('(max-width: 959px)');
    breakpointObserver.observe(['(max-width: 959px)']).subscribe((result) => {
      this.smallLayout = result.matches;
      this.calcSideBarStyle();
    });
    this.calcSideBarStyle();
  }
  markChanged() {
    this.changeRef.markForCheck();
  }
  ngOnDestroy() {
    this.scrollService.removeScrollListener(this.boundScroll);
  }

  scroll(event: any): void {
    this.fixed = event.srcElement.scrollTop > 64;
    this.calcSideBarStyle();
  }
  boundScroll: (event: any) => void;

  calcSideBarStyle() {
    let position: string | null = null;
    let width: string | null = null;
    if (
      (!this._heading || this._alwaysFixed != null || this.fixed) &&
      !this.smallLayout
    ) {
      position = 'fixed';
      width = '16rem';
    }

    let top;
    if (this._alwaysFixed == null) {
      top = 'calc(64px + 32px + 2rem)';
    } else {
      top = this._alwaysFixed;
    }

    const sideBarStyle = {
      position,
      width,
      top,
    };

    this.sideBarStyle.next(sideBarStyle);
  }
}
