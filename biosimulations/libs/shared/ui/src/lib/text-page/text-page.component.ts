import {
  Component,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TocSection } from '../toc/toc-section';

@Component({
  selector: 'biosimulations-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss'],
})
export class TextPageComponent {
  @Input()
  heading = '';

  @Input()
  contentsHeading = 'Contents';

  @Input()
  padded = true;

  @Input()
  alwaysFixed: string | null = null;

  fixed = false;
  smallLayout = false;

  @Input()
  tocSections!: TocSection[];

  @Input()
  tocScrollSectionScrollOffset = 96;

  constructor(mediaMatcher: MediaMatcher) {
    window.addEventListener('scroll', this.scroll, true);

    const matcher = mediaMatcher.matchMedia('(max-width: 959px)');
    this.smallLayout = matcher.matches;
    matcher.addListener((event) => {
      this.smallLayout = event.matches;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    this.fixed = event.srcElement.scrollTop > 64;
  };
}
