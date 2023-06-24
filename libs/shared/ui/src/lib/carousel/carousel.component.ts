import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input()
  images: string[] = [];

  @Input()
  downloadFileName = "simulation_profile_image.jpg";

  public expandedImage?: string;

  constructor() {
    for (let i = 0; i < this.images.length; i++) {
      console.log(`Here is image number ${i}: ${this.images[i]}`);
    }
  }

  expandImage(image: string) {
    this.expandedImage = image;
  }

  downloadImage(downloadName: string | null = null) {
    const imageUrl = this.images[0]; // Or get this from the <biosimulations-carousel> component
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = this.getImageDownloadName(); // Provide the name for downloaded image
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  private getImageDownloadName(downloadName: string | null = null): string {
    if (!downloadName) {
      downloadName = this.downloadFileName;
    }
    return downloadName;
  }
}
