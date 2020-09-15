import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-toc-item',
  templateUrl: './text-page-toc-item.component.html',
  styleUrls: ['./text-page-toc-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageTocItemComponent implements OnInit {
  @Input()
  heading = '';

  @Input()
  scrollTarget!: HTMLElement;

  @Input()
  scrollOffset = 0;

  constructor() {}

  ngOnInit(): void {}

  scrollToElement(): void {
    const scrollContainer = document.getElementsByTagName('mat-sidenav-content')[0];
    const y = this.scrollTarget.getBoundingClientRect().top + scrollContainer.scrollTop - this.scrollOffset;
    scrollContainer.scrollTo({top: y, behavior: 'smooth'});
  }
}
