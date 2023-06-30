import { Component, Input, AfterViewInit, HostListener } from '@angular/core';
import { FeaturedService } from './featured.service';
import { FeaturedProject } from './featured.model';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'biosimulations-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => in', [style({ opacity: 0 }), animate(600, style({ opacity: 1 }))]),
    ]),
  ],
  providers: [FeaturedService],
})
export class FeaturedComponent implements AfterViewInit {
  @Input() public autoScrollInterval = 9000;
  public showNew = false;
  public projects: FeaturedProject[];
  public startIndex = 0;
  public endIndex = 1;
  public numCards = 1;
  public currentServiceIndex: number;
  public alternateImage = 'Explore Now';
  public showCard = true;
  public cardIsActive = false;
  private intervalId!: NodeJS.Timer | null;

  private touchStartX = 0;
  private touchEndX = 0;

  public constructor(private service: FeaturedService) {
    this.projects = this.service.getProjects();
    this.startIndex = 0;
    this.endIndex = this.numCards - 1;
    this.currentServiceIndex = 0;
  }

  public ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  public async previous(): Promise<void> {
    this.stopAutoScroll();
    if (this.startIndex > 0) {
      this.startIndex--;
      this.endIndex--;
    } else {
      if (this.endIndex === this.projects.length - 1) {
        this.startIndex = this.projects.length - this.numCards;
        this.endIndex = this.projects.length - (this.numCards - 1);
      } else {
        this.startIndex = this.projects.length - this.numCards - 1;
        this.endIndex = this.projects.length - 2;
      }
    }
    await this.sleep();
    this.startAutoScroll();
  }

  public async next(): Promise<void> {
    this.stopAutoScroll();
    if (this.endIndex < this.projects.length - 1) {
      this.startIndex++;
      this.endIndex++;
    } else {
      this.startIndex = 0;
      this.endIndex = this.numCards - 1;
    }
    await this.sleep();
    this.startAutoScroll();
  }

  public startAutoScroll(): void {
    this.intervalId = setInterval(() => {
      this.next();
    }, this.autoScrollInterval);
  }

  public stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public OnDestroy(): void {
    this.stopAutoScroll();
  }

  public jumpTo(index: number): void {
    this.startIndex = index;
    this.endIndex = index + (this.numCards - 1);
  }

  public getBackgroundUrl(image: string): string {
    return `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`;
  }

  public showNewElement(): void {
    this.showNew = true;
    this.stopAutoScroll();
  }

  public hideNewElement(): void {
    this.showNew = false;
    this.startAutoScroll();
  }

  @HostListener('touchstart', ['$event'])
  public nTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  public onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipeGesture();
  }

  public handleSwipeGesture(): void {
    const swipeThreshold = 100;
    if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.previous();
    } else if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.next();
    }
  }

  private sleep(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.autoScrollInterval));
  }
}
