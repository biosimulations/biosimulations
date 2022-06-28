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
  public constructor(private service: FeaturedService) {
    this.projects = this.service.getProjects();
    this.startIndex = 0;
    this.endIndex = this.numCards - 1;
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
}
