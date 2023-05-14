import { Component } from '@angular/core';
import { FeaturedService } from './featured.service';
import { FeaturedProject } from './featured.model';
@Component({
  selector: 'biosimulations-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
  providers: [FeaturedService],
})
export class FeaturedComponent {
  public projects: FeaturedProject[];
  public startIndex = 0;
  public endIndex = 1;
  public numCards = 2;
  private intervalId!: NodeJS.Timer | null;
  public constructor(private service: FeaturedService) {
    this.projects = this.service.getProjects();
    this.startIndex = 0;
    this.endIndex = this.numCards - 1;
    this.startAutoScroll();
  }

  public previous(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.endIndex--;
    } else {
      this.startIndex = this.projects.length - this.numCards;
      this.endIndex = this.projects.length - (this.numCards - 1);
    }
  }
  public next(): void {
    if (this.endIndex < this.projects.length - 1) {
      this.startIndex++;
      this.endIndex++;
    } else {
      this.startIndex = 0;
      this.endIndex = this.numCards - 1;
    }
  }
  private startAutoScroll(): void {
    const intervalTime = 5000; // scroll every 5 seconds
    this.intervalId = setInterval(() => {
      this.next();
    }, intervalTime);
  }
  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  public ngOnDestroy(): void {
    this.stopAutoScroll();
  }
  public jumpTo(index: number): void {
    this.startIndex = index;
    this.endIndex = index + (this.numCards - 1);
  }
}
