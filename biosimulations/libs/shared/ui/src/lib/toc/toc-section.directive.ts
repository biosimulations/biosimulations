import { Directive, ElementRef, Input, Host } from '@angular/core';

import { TocSection } from './toc-section';
import { TocSectionsContainerDirective } from './toc-sections-container.directive';

@Directive({
  selector: '[tocSection]',
  exportAs: 'tocSection',
})
export class TocSectionDirective {
  @Input()
  set tocSection (heading: string) {
    this.section.heading = heading;
  }

  private section: TocSection = {};

  constructor(
    @Host() sectionsContainer: TocSectionsContainerDirective,
    elementRef: ElementRef,
  ) {
    this.section.target = elementRef.nativeElement;
    sectionsContainer.sections.push(this.section);
  }
}
