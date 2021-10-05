import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
  HostListener,
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

  ngOnDestroy() {
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
      this.error.next('');
      this._spec = value;
      this.loading.next(false);
      this.render();
    });
  }

  // TODO: make private once dispatch app refactored to new visualization component
  render(): void {
    if (!this.hostElement) {
      return;
    }

    if (!this._spec) {
      this.error.next('Visualization could not be loaded.');
      return;
    }

    const rect =
      this.hostElement.nativeElement.parentElement?.getBoundingClientRect();    
    if (rect?.width === null || rect?.width === 0 || rect?.height === null || rect?.height === 0) {
      return;
    }
    const options = {
      width: Math.max(rect?.width, 10),
      height: Math.max(rect?.height, 10),
      padding: 0,
    };

    const dataUrls: string[] = [];
    (this._spec as Spec).data?.forEach((data: any): void => {
      const url = data?.url;
      if (url) {
        dataUrls.push(url as string);
      }
    });

    console.warn = function (
      this: VegaVisualizationComponent,
      ...args: any[]
    ): void {
      if (
        args.length === 4 &&
        args[1] == 'Loading failed' &&
        dataUrls.includes(args[2]) &&
        args[3].constructor.name === 'Error' &&
        args[3].message === '500'
      ) {
        this.error.next(
          'The data for the visualization could not be loaded.',
        );
      } else {
        this.builtInConsoleWarn(...args);
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
  }

  @HostListener('window:resize')
  onResize() {
    const rect = this.hostElement.nativeElement.parentElement?.getBoundingClientRect();
    if (
      !(rect?.width === null || rect?.width === 0) &&
      !(rect?.height === null || rect?.height === 0)
    ) {
      this.render();
    }
  }
}
