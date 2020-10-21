import { Directive, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TocSection } from './toc-section';

@Directive({
  selector: '[tocSectionsContainer]',
  exportAs: 'tocSectionsContainer',
})
export class TocSectionsContainerDirective {
  private _sections: TocSection[] = [];
  private sections = new BehaviorSubject<TocSection[]>(this._sections);
  sections$ = this.sections.asObservable();

  public addToc(section: TocSection) {
    this._sections.push(section);
    this.sections.next(this._sections);
  }
}
