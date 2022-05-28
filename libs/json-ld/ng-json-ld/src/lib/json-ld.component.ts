import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'biosimulations-json-ld',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonLdComponent {
  public constructor(private sanitizer: DomSanitizer) {}

  @HostBinding('innerHTML') private jsonLD?: SafeHtml;

  @Input()
  public set json(currentValue: unknown) {
    this.jsonLD = this.getSafeHTML(currentValue);
  }
  private getSafeHTML(value: unknown): SafeHtml {
    const json = value ? JSON.stringify(value, null, 2).replace(/<\/script>/g, '<\\/script>') : '';
    const html = `<script type="application/ld+json">${json}</script>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
