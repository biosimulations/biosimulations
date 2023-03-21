import { Component, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Spec } from 'vega';
import vegaEmbed from 'vega-embed';
import { debounce } from 'throttle-debounce';

@Component({
  selector: 'biosimulations-vega-visualization',
  templateUrl: './vega-visualization.component.html',
  styleUrls: ['./vega-visualization.component.scss'],
})
export class VegaVisualizationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vegaContainer')
  private _vegaContainer!: ElementRef;

  private subscriptions: Subscription[] = [];

  private resizeDebounce!: debounce<() => void>;
  private resizeObserver!: ResizeObserver;

  private builtInConsoleWarn!: any;

  constructor(private hostElement: ElementRef) {}

  public ngAfterViewInit(): void {
    this.resizeDebounce = debounce(200, false, this.doOnResize.bind(this));

    this.resizeObserver = new ResizeObserver((entries, observer) => {
      this.resizeDebounce();
    });
    this.resizeObserver.observe(this.hostElement.nativeElement.parentElement);

    this.builtInConsoleWarn = console.warn;
  }

  ngOnDestroy() {
    console.warn = this.builtInConsoleWarn;
    this.resizeDebounce.cancel();
    this.resizeObserver.disconnect();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loading = true;

  private _spec: Spec | null | false = null;

  error = '';

  @Input()
  set spec(value: Observable<Spec | null | false>) {
    this.loading = true;
    this.error = '';
    this._spec = null;
    const sub = value.subscribe((value: Spec | null | false) => {
      this._spec = value;
      this.render();
    });
    this.subscriptions.push(sub);
  }

  private render(): void {
    if (!this.hostElement) {
      return;
    }

    if (!this._spec) {
      this.error = 'The visualization could not be loaded.';
      this.loading = false;
      return;
    }

    const rect = this.getBoundingClientRect(this.hostElement.nativeElement.parentElement);
    if (!rect) {
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

    console.warn = function (this: VegaVisualizationComponent, ...args: any[]): void {
      if (
        args.length === 4 &&
        args[0] == 'WARN' &&
        args[1] == 'Loading failed' &&
        dataUrls.includes(args[2]) &&
        args[3].constructor.name === 'Error'
      ) {
        this.error = 'The data for the visualization could not be loaded.';
      } else {
        this.builtInConsoleWarn(...args);
      }
    }.bind(this);

    vegaEmbed(this._vegaContainer.nativeElement, this._spec as Spec, options)
      .then(() => (this.loading = false))
      .catch((error: Error): void => {
        console.error(error);
        this.loading = false;
        this.error = `The visualization is invalid: ${error.message}.`;
      });
  }

  private getBoundingClientRect(element: HTMLElement): ClientRect | null {
    const rect = element.getBoundingClientRect();
    if (rect?.width === null || rect?.width === 0 || rect?.height === null || rect?.height === 0) {
      return null;
    } else {
      return rect;
    }
  }

  private doOnResize(): void {
    this.render();
  }
}
