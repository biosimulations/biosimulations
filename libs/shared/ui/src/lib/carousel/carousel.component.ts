import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input() public images: string[] = [];
  @Input() public downloadFileName = 'simulation_profile_image.jpg';

  public downloadImage(imageIndex = 0): void {
    const imageUrl = this.images[imageIndex];
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = this.getImageDownloadName();
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
