import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { VisualisationService } from '../../../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit {
  data: any;
  layout: any;

  constructor(
    private visualisationService: VisualisationService,
    private hostElement: ElementRef,
  ) { }

  ngOnInit(): void {
    this.visualisationService.updateDataEvent.subscribe(
      (reports: any) => {
        const res: any = [];
        const keys = Object.keys(reports['data']);
        keys.forEach(element => {
          res.push({ ...reports['data'][element], name: element });
        });
        this.data = res;

      },
      (error) => {
      }
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.setLayout();
  }

  setLayout() {
    const rect = this.hostElement.nativeElement.parentElement.getBoundingClientRect();
    this.layout = {
      width: rect.width,
      height: rect.height,
    }
  }
}
