import {
  Component,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';

interface TocItem {
  heading: string;
  target: HTMLElement;
}

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

  tocSections: TocItem[] = [];
  tocSectionObservers: MutationObserver[] = [];

  @ViewChild('sectionsContainer', {read: ElementRef})
  set sectionsContainer(container: ElementRef) {
    while(this.tocSections.length) {
      this.tocSections.pop();
    }
    while(this.tocSectionObservers.length) {
      const observer = this.tocSectionObservers.pop();
      if (observer !== undefined) {
        observer.disconnect();
      }
    }
    this.getTocSections(container.nativeElement);
  }

  getTocSections(container: any) {
    for (const section of container.children) {
      if (section.localName === 'biosimulations-text-page-content-section') {
        const heading = section.getAttribute('shortHeading')
            || section.getAttribute('ng-reflect-short-heading')
            || section.getAttribute('heading')
            || section.getAttribute('ng-reflect-heading');
        const tocSection = {
          heading: heading,
          target: section,
        };
        this.tocSections.push(tocSection);

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const heading = section.getAttribute('shortHeading')
              || section.getAttribute('ng-reflect-short-heading')
              || section.getAttribute('heading')
              || section.getAttribute('ng-reflect-heading');
            tocSection.heading = heading;
          });
        });

        observer.observe(section, {
          attributeFilter: ['shortHeading', 'ng-reflect-short-heading', 'heading', 'ng-reflect-heading'],
        });
        this.tocSectionObservers.push(observer);
      } else {
        this.getTocSections(section);
      }
    }
  }

  constructor() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    while(this.tocSectionObservers.length) {
      const observer = this.tocSectionObservers.pop();
      if (observer !== undefined) {
        observer.disconnect();
      }
    }
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    this.fixed = event.srcElement.scrollTop > 64;
  };
}
