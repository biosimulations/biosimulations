import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { VisualisationService } from '../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-view-visualisation',
  templateUrl: './view-visualisation.component.html',
  styleUrls: ['./view-visualisation.component.scss'],
})
export class ViewVisualisationComponent implements OnInit {
  // @Input()
  // graphData!: Array<object>;
  @Input()
  graphData: { data: any; layout: any } = { data: {}, layout: {} };
  @Input()
  layoutTitle!: string;
  @Input()
  layoutWidth!: number;
  @Input()
  layoutHeight!: number;

  graph: { data: any; layout: any } = { data: {}, layout: {} };

  constructor() {}

  ngOnInit() {
    // this.graph = {
    //   data: this.graphData,
    //   layout: {width: this.layoutWidth, height: this.layoutHeight, title: this.layoutTitle}
    // };
  }
}
