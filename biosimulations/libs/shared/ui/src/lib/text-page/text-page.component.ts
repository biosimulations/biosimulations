import {
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';

interface TocItem {
  title: string;
  target: HTMLElement;
}

@Component({
  selector: 'biosimulations-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss'],
})
export class TextPageComponent implements OnInit {
  @Input()
  title = '';

  fixed = false;

  tocSections: TocItem[] = [];

  @ViewChild('sectionsContainer')
  set sectionsContainer(container: any) {
    this.getTocSections(container.nativeElement);
  }

  getTocSections(container: any) {
    for (const section of container.children) {
      if (section.getAttribute('shortTitle')) {
        this.tocSections.push({
          title: section.getAttribute('shortTitle'),
          target: section,
        });
      } else {
        this.getTocSections(section);
      }
    }
  }

  constructor() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    this.fixed = event.srcElement.scrollTop > 64;
  };
}
