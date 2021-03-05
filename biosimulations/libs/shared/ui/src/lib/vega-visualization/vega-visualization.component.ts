import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
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
  constructor(private hostElement: ElementRef) { }

  private _spec: Spec | null = null;

  @Input()
  set spec(value: Observable<Spec | null>) {
    value.subscribe((value: Spec | null): void => {
        this._spec = value;
        this.render();
    })
  }

  render(): void {
    if (this.hostElement) {
      if (this._spec) {
        const rect = this.hostElement.nativeElement.parentElement.getBoundingClientRect();
        const options = {
          width: Math.max(rect.width, 10),
          height: Math.max(rect.height, 10),
          padding: 0,
        };
        vegaEmbed(this.hostElement.nativeElement, this._spec as Spec, options)
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

  @HostListener('window:resize')
  onResize() {
    this.render();
  }

  @Output()
  error = new EventEmitter<Error>();
}