import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[formHost]',
})
export class FormHostDirective {
  public constructor(public viewContainerRef: ViewContainerRef) {}
}
