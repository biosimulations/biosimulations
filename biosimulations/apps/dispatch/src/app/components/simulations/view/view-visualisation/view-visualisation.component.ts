import {
  Component,
  Input,
} from '@angular/core';
import { VisualisationService } from '../../../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-view-visualisation',
  templateUrl: './view-visualisation.component.html',
  styleUrls: ['./view-visualisation.component.scss'],
})
export class ViewVisualisationComponent {
  @Input()
  graphData: { data: any; layout: any } = { data: {}, layout: {} };

  constructor() {}
}
