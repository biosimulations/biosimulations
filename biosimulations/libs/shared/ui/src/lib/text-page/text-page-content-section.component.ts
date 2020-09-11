import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-content-section',
  templateUrl: './text-page-content-section.component.html',
  styleUrls: ['./text-page-content-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageContentSectionComponent {
  @Input()
  heading = '';

  scrollToTop(): void {
    const scrollContainer = document.getElementsByTagName('mat-sidenav-content')[0];
    scrollContainer.scrollTo({top: 64 + 1, behavior: 'smooth'});
  }
}
