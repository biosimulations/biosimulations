import { Component, Input } from '@angular/core';
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
export class FeaturedComponent {
  @Input()
  public autoScrollInterval = 10000;

  public projects: FeaturedProject[];
  public startIndex = 0;
  public endIndex = 1;
  public numCards = 1;
  public currentServiceIndex: number;
  public alternateImage = 'Explore Now'; /*`
        _________________
      | BIO SIMULATIONS |
      |-----------------|
      |..   __     __   |
      |||__( o )__( o ) |
      |||   (*)     (*)  |
      |||     >     <   |
      |||    (_____)   |
      |||_______________|
      |                 |
      |    [RUNNING]    |
      |_________________|
  `;*/
  private intervalId!: NodeJS.Timer | null;
  showCard = true;
  public constructor(private service: FeaturedService) {
    this.projects = this.service.getProjects();
    this.startIndex = 0;
    this.endIndex = this.numCards - 1;
    this.currentServiceIndex = 0;
    this.startAutoScroll(this.autoScrollInterval);
  }

  public previous(): void {
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

  private startAutoScroll(intervalTime: number): void {
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

  public getBackgroundUrl(image: string): string {
    return `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`;
  }
}
