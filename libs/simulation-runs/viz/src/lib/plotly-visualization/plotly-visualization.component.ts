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
  public plotTitle = '';

  @Input()
  public projectTitle = '';

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
      filename: this.projectTitle + '-' + this.plotTitle,
      height: 500,
      width: 700,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    modeBarButtonsToRemove: [], //['zoomIn2d', 'zoomOut2d', 'zoom2d'],
    displayLogo: false,
    showEditInChartStudio: true,
    plotlyServerURL: 'https://chart-studio.plotly.com',
    responsive: true,
    titlefont: {
      size: 24,
      color: '#7f7f7f',
    },
    xaxis: {
      title: 'X Axis',
      titlefont: {
        size: 18,
        color: '#7f7f7f',
      },
      tickfont: {
        size: 14,
        color: 'black',
      },
    },
    yaxis: {
      title: 'Y Axis',
      titlefont: {
        size: 18,
        color: '#7f7f7f',
      },
      tickfont: {
        size: 14,
        color: 'black',
      },
    },
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
      this.layout.title = this.plotTitle;
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
      /* const rect = this.hostElement.nativeElement.parentElement.getBoundingClientRect();
      const heightModifier = 1.005;
      const widthModifier = 1.5; */
      this.layout.autosize = true;
      this.layout.legend = {
        x: 0.7,
        y: 1.5,
        orientation: 'v',
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 9,
          color: '#000',
        },
        display: 'grid',
        bgcolor: '#DCDCDC',
        bordercolor: '#FFFFFF',
        borderwidth: 1,
      };
    }
  }
}
