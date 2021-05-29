import { biosimulationsIcon } from '@biosimulations/shared/icons';

export abstract class ViewModel {
  display!: string;
  icon!: biosimulationsIcon | null;
  link!: string | null;
  tooltip!: string | null;
  init() {
    this.display = this.toString();
    this.icon = this.getIcon();
    this.link = this.getLink();
    this.tooltip = this.getTooltip();
  }
  abstract toString(): string;
  abstract getIcon(): biosimulationsIcon | null;
  abstract getLink(): string | null;
  abstract match(predicate: any): boolean;
  abstract getTooltip(): string | null;
}
