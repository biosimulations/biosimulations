import { Component, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PlotlyTrace, PlotlyLayout, PlotlyDataLayout } from '@biosimulations/datamodel/common';
import { debounce } from 'throttle-debounce';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HtmlSnackBarComponent } from '@biosimulations/shared/ui';

type PlotLegendLayout = {
  x: number;
  y: number;
  orientation: string;
  traceorder: string;
  font: {
    family: string;
    size: number;
    color: string;
  };
  display: string;
  bgcolor: string;
  bordercolor: string;
  borderwidth: number;
};

type TickfontLayout = {
  size: number;
  color: string;
};

type AxisLayout = {
  size: number;
  color: string;
  tickfont: TickfontLayout;
};

@Component({
  selector: 'biosimulations-plotly-visualization',
  templateUrl: './plotly-visualization.component.html',
  styleUrls: ['./plotly-visualization.component.scss'],
})
export class PlotlyVisualizationComponent implements AfterViewInit, OnDestroy {
  @Input()
  public plotTitle: string = '';

  @Input()
  public projectTitle: string = '';

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
      height: 500,
      width: 700,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    modeBarButtonsToRemove: [],
    displayLogo: false,
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
      const plotSaveName = this.projectTitle + '_' + this.plotTitle;
      this.config.toImageButtonOptions.filename = plotSaveName;
      this.errors = [];
      for (let i = 0; i <= value.data.length; i++) {
        const d = this.getOutputArray(value, i);
        console.log(i, d);
      }
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

  public getOutputArray(value: PlotlyDataLayout | any, i = 0): number[] {
    return value.data[i];
  }

  private setLegendLayout(
    x = 0.0,
    y = 1.5,
    orientation = 'v',
    traceorder = 'normal',
    fontFamily = 'sans-serif',
    fontSize = 9,
    fontColor = '#000',
    display = 'grid',
    bgcolor = '#DCDCDC',
    bordercolor = '#FFFFFF',
    borderwidth = 1,
  ): PlotLegendLayout {
    const layout: PlotLegendLayout = {
      x: x,
      y: y,
      orientation: orientation,
      traceorder: traceorder,
      font: {
        family: fontFamily,
        size: fontSize,
        color: fontColor,
      },
      display: display,
      bgcolor: bgcolor,
      bordercolor: bordercolor,
      borderwidth: borderwidth,
    };
    return layout;
  }

  private setAxisLayout(fontSize = 18, fontColor = '#7f7f7f', tickFontSize = 14, tickFontColor = 'black'): AxisLayout {
    const layout: AxisLayout = {
      size: fontSize,
      color: fontColor,
      tickfont: {
        size: tickFontSize,
        color: tickFontColor,
      },
    };
    return layout;
  }

  private setLayout(): void {
    this.visible = this.hostElement.nativeElement.offsetParent != null;
    if (this.visible && this.layout) {
      //this.layout.autosize = true;
      this.layout.legend = this.setLegendLayout();
      //this.layout.xaxis = this.setAxisLayout();
      //this.layout.yaxis = this.setAxisLayout();
    }
  }
}
