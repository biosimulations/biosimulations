import { Component, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PlotlyTrace, PlotlyLayout, PlotlyDataLayout } from '@biosimulations/datamodel/common';
import { debounce } from 'throttle-debounce';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HtmlSnackBarComponent } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-plotly-visualization',
  templateUrl: './plotly-visualization.component.html',
  styleUrls: ['./plotly-visualization.component.scss'],
})
export class PlotlyVisualizationComponent implements AfterViewInit, OnDestroy {
  @Input()
  public saveTitle?: string = '';

  @Input()
  public plotNum?: number;

  public visible = false;
  public loading = false;
  public data: PlotlyTrace[] | undefined = undefined;
  public layout: PlotlyLayout | undefined = undefined;
  public config: any = {
    scrollZoom: true,
    editable: false,
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'biosim-db-' + this.saveTitle,
      height: 500,
      width: 700,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    modeBarButtonsToRemove: [],
    showEditInChartStudio: true,
    plotlyServerURL: 'https://chart-studio.plotly.com',
    responsive: true,
  };
  public errors: string[] = [];
  private resizeDebounce!: debounce<() => void>;

  public constructor(private hostElement: ElementRef, private snackBar: MatSnackBar) {}

  @Input()
  public set dataLayout(value: PlotlyDataLayout | null | undefined) {
    if (value == null) {
      this.loading = true;
      this.errors = [];
    } else if (value.data && value.layout) {
      this.loading = false;
      this.data = value.data;
      this.layout = value.layout;
      this.errors = [];
      this.setLayout();

      if (value?.dataErrors?.length) {
        this.snackBar.openFromComponent(HtmlSnackBarComponent, {
          data: {
            message: `<p>Some aspects of the requested plot could not be produced.</p><ul><li>${value.dataErrors.join(
              '</li><li>',
            )}</li></ul>`,
            spinner: false,
            action: 'Ok',
          },
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    } else {
      this.loading = false;
      this.errors = value?.dataErrors || [];
    }
  }

  public ngAfterViewInit(): void {
    this.resizeDebounce = debounce(50, false, this.setLayout.bind(this));
  }

  public handleResize(resize: ResizeObserverEntry): void {
    console.log('onResize', resize);
    this.resizeDebounce();
  }

  public ngOnDestroy() {
    this.resizeDebounce?.cancel();
  }

  private setLayout(): void {
    this.visible = this.hostElement.nativeElement.offsetParent != null;
    if (this.visible && this.layout) {
      const rect = this.hostElement.nativeElement.parentElement.getBoundingClientRect();
      const heightModifier = 1.005;
      const widthModifier = 1.5;
      this.layout.autosize = true;
      this.layout.legend = {
        x: 0.05,
        y: 1.5,
        orientation: 'h',
      };
    }
  }
}
