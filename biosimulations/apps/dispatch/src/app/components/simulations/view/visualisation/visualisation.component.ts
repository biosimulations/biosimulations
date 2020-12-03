import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { VisualisationService } from '../../../../services/visualisation/visualisation.service';
import { PlotlyComponent } from 'angular-plotly.js'

@Component({
  selector: 'biosimulations-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit {
  data: any;
  layout: any;

  @ViewChild('plotParent', { static: true }) plotParent?: ElementRef;

  constructor(
    private visualisationService: VisualisationService,
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

  @ViewChild(PlotlyComponent, { read: ElementRef }) plot!: ElementRef;

  @HostListener('window:resize')
  onResize() {
    this.setLayout();
  }

  setLayout() {
    const rect = this.plot.nativeElement.parentElement.parentElement.getBoundingClientRect();
    const height = this.plotParent?.nativeElement.offsetHeight;
    this.layout = {
      width: rect.width,
      height: height | rect.height,
    }
  }
}
