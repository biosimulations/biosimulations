import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[blankTarget]',
})
export class BlankTargetDirective {
  public constructor(private el: ElementRef) {
    this.el.nativeElement.target = '_blank';
    this.el.nativeElement.rel = 'noopener';
  }
}
