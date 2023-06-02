import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input()
  images: string[] = [];

  public expandedImage?: string;

  expandImage(image: string) {
    this.expandedImage = image;
  }
}
