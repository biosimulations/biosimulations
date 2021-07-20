import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Spec } from 'vega';
import vegaEmbed from 'vega-embed';
import { environment } from '@biosimulations/shared/environments';

@Component({
  selector: 'biosimulations-vega-visualization',
  templateUrl: './vega-visualization.component.html',
  styleUrls: ['./vega-visualization.component.scss'],
})
export class VegaVisualizationComponent implements OnDestroy {
  @ViewChild('vegaContainer', { static: false })
  private vegaContainer!: ElementRef;

  private builtInConsoleWarn!: any;

  constructor(private hostElement: ElementRef) {
    this.builtInConsoleWarn = console.warn;
  }

  ngOnDestroy(): void {
    console.warn = this.builtInConsoleWarn;
  }

  private loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  private _spec: Spec | undefined | false = undefined;

  private error = new BehaviorSubject<string>('');
  error$ = this.error.asObservable();

  @Input()
  set spec(value: Observable<Spec | undefined | false>) {
    this._spec = undefined;
    this.loading.next(true);
    value.subscribe((value: Spec | undefined | false): void => {
      this._spec = value;
      this.loading.next(false);
      this.render();
    });
  }

  render(): void {
    if (this.hostElement) {
      if (this._spec) {
        const rect =
          this.hostElement.nativeElement.parentElement?.getBoundingClientRect();
        const options = {
          width: Math.max(rect?.width || 0, 10),
          height: Math.max(rect?.height || 0, 10),
          padding: 0,
        };

        const dataUrls: string[] = [];
        this._spec?.data?.forEach((data: any): void => {
          const url = data?.url;
          if (url) {
            dataUrls.push(url as string);
          }
        });

        console.warn = function(this: VegaVisualizationComponent): void {
          if (
            arguments.length === 4
            && arguments[1] == 'Loading failed'
            && dataUrls.includes(arguments[2])
            && arguments[3].constructor.name === 'Error'
            && arguments[3].message === '500'
          ) {
            this.error.next('The data for the visualization could not be loaded.');
          } else {
            this.builtInConsoleWarn(...arguments);
          }
        }.bind(this);

        vegaEmbed(
          this.vegaContainer.nativeElement,
          this._spec as Spec,
          options,
        ).catch((error: Error): void => {
          if (!environment.production) {
            console.error(error);
          }
          this.error.next(`The visualization is invalid: ${error.message}.`);
        });
      } else {
        this.error.next('Visualization could not be loaded.');
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.render();
  }
}
