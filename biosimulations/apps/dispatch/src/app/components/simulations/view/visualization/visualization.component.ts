import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { VisualisationService } from '../../../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent {
  @Input()
  data?: any[];

  visible = false;
  layout: any;

  constructor(
    private visualisationService: VisualisationService,
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
