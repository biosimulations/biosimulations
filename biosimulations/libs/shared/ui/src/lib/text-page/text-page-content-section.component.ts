import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-content-section',
  templateUrl: './text-page-content-section.component.html',
  styleUrls: ['./text-page-content-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPageContentSectionComponent implements OnInit {
  @Input()
  heading = '';

  @Input()
  shortHeading = '';

  constructor() {}

  ngOnInit(): void {}

  scrollToTop(): void {
    const scrollContainer = document.getElementsByTagName('mat-sidenav-content')[0];
    scrollContainer.scrollTo({top: 64 + 1, behavior: 'smooth'});
  }
}
