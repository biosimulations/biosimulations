import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { VisualizationService } from '../../../../services/visualization/visualization.service';

@Component({
  selector: 'biosimulations-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent {
  @Input()
  data?: any[];

  visible = false;
  layout: any;

  constructor(
    private visualizationService: VisualizationService,
    private hostElement: ElementRef,
  ) { }

  @HostListener('window:resize')
  onResize() {
    this.setLayout();
  }

  setLayout(): void {
    this.visible = this.hostElement.nativeElement.offsetParent != null;
    if (this.visible) {
      const rect = this.hostElement.nativeElement.parentElement.getBoundingClientRect();
      this.layout = {
        width: rect.width,
        height: rect.height,
      }
    }
  }
}
