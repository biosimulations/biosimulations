import { Directive, ElementRef, Input, Host } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TocSection } from './toc-section';
import { TocSectionsContainerDirective } from './toc-sections-container.directive';

@Directive({
  selector: '[tocSection]',
  exportAs: 'tocSection',
})
export class TocSectionDirective {
  private heading = new BehaviorSubject<string>('');

  @Input()
  set tocSection(heading: string) {
    this.heading.next(heading);
  }

  private section: TocSection;

  constructor(
    @Host() private sectionsContainer: TocSectionsContainerDirective,
    elementRef: ElementRef,
  ) {
    this.section = {
      heading: this.heading.asObservable(),
      target: elementRef.nativeElement,
    };
    sectionsContainer.addToc(this.section);
  }

  ngOnDestroy() {
    this.sectionsContainer.removeToc(this.section);
  }
}
