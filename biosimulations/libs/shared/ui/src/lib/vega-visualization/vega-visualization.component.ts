import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Spec } from 'vega';
import vegaEmbed from 'vega-embed';

@Component({
  selector: 'biosimulations-vega-visualization',
  templateUrl: './vega-visualization.component.html',
  styleUrls: ['./vega-visualization.component.scss'],
})
export class VegaVisualizationComponent {
  private _container: ElementRef | null = null;

  @ViewChild('container')
  set container(value: ElementRef | null) {
    this._container = value;
    this.renderVisualization();
  }

  private _spec: Spec | null = null;

  @Input()
  set spec(value: Observable<Spec | null>) {
    value.subscribe((value: Spec | null): void => {
        this._spec = value;
        this.renderVisualization();
    })
  }

  private renderVisualization(): void {
    if (this._container) {
      if (this._spec) {
        vegaEmbed(this._container.nativeElement, this._spec as Spec)
          .then(() => {
            this.refreshed.emit(true);
          })
          .catch(this.error.emit);
      } else {
        this.refreshed.emit(true);
      }
    }
  }

  @Output()
  refreshed = new EventEmitter<boolean>();

  @Output()
  error = new EventEmitter<Error>();
}