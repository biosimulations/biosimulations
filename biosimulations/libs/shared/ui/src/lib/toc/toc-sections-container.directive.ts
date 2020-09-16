import { Directive, ElementRef } from '@angular/core';

import { TocSection } from './toc-section';

@Directive({
  selector: '[tocSectionsContainer]',
  exportAs: 'tocSectionsContainer',
})
export class TocSectionsContainerDirective {
  sections: any[] = [];
}
