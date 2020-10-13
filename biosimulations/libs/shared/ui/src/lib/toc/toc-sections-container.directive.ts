import { ChangeDetectorRef, Directive, ElementRef } from '@angular/core';

import { TocSection } from './toc-section';

@Directive({
  selector: '[tocSectionsContainer]',
  exportAs: 'tocSectionsContainer',
})
export class TocSectionsContainerDirective {
  constructor(private changeRef: ChangeDetectorRef) {}
  public addToc(toc: TocSection) {
    this.sections.push(toc);
    this.markChanged();
  }

  public getToc() {
    this.markChanged();
    return this.sections;
  }
  private sections: TocSection[] = [];
  private markChanged() {
    this.changeRef.markForCheck();
  }
}
