import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Spec } from 'vega';
import vegaEmbed from 'vega-embed';
import { environment } from '@biosimulations/shared/environments';

@Component({
  selector: 'biosimulations-vega-embed',
  templateUrl: './vega-embed.component.html',
  styleUrls: ['./vega-embed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VegaEmbedComponent implements OnDestroy {
  @ViewChild('vegaContainer', { static: false })
  private vegaContainer!: ElementRef;

  private builtInConsoleWarn!: any;

  public constructor(private hostElement: ElementRef) {
    this.builtInConsoleWarn = console.warn;
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.render();
  }
  public ngOnDestroy(): void {
    console.warn = this.builtInConsoleWarn;
  }

  private loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  private _spec: Spec | undefined | null = undefined;

  private error = new BehaviorSubject<string>('');
  error$ = this.error.asObservable();

  @Input()
  private set spec(value: Spec | undefined | null) {
    this._spec = value;
    this.error.next('');
    this.loading.next(false);
    this.render();
  }

  @Input()
  private set visible(value: boolean) {
    this.render();
  }

  private ngOnViewInit(): void {
    this.render();
  }

  private ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.spec = changes.spec.currentValue;
  }

  private isVisible = false;
  ngAfterContentChecked(): void {
    if (
      this.isVisible == false &&
      this.hostElement.nativeElement.offsetParent != null
    ) {
      console.log('isVisible switched from false to true');
      this.isVisible = true;
      this.render();
    } else if (
      this.isVisible == true &&
      this.hostElement.nativeElement.offsetParent == null
    ) {
      console.log('isVisible switched from true to false');
      this.isVisible = false;
    }
  }
  private render(): void {
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

        console.warn = function (
          this: VegaEmbedComponent,
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
      } else {
        this.error.next('Visualization could not be loaded.');
      }
    }
  }
}
