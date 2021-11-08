import { Component, OnInit, Input } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-text-page-toc-item',
  templateUrl: './text-page-toc-item.component.html',
  styleUrls: ['./text-page-toc-item.component.scss'],
})
export class TextPageTocItemComponent implements OnInit {
  @Input()
  heading = '';

  @Input()
  scrollTarget!: HTMLElement;

  @Input()
  scrollOffset = 0;

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {}

  scrollToElement(): void {
    this.scrollService.scrollToElement(this.scrollTarget, this.scrollOffset);
  }
}
