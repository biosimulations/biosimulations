import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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

type RangeSliderLayout = {
  autorange: boolean;
  bordercolor: string;
  borderwidth: number;
  thickness: number;
};

type AxisLayout = {
  tickfont: TickfontLayout;
  font: {
    family: string;
    size: number;
    color: string;
  };
  rangeslider?: RangeSliderLayout | null;
};

@Component({
  selector: 'biosimulations-plotly-visualization',
  templateUrl: './plotly-visualization.component.html',
  styleUrls: ['./plotly-visualization.component.scss'],
})
export class PlotlyVisualizationComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('plotly') public plotlyComponent!: this;
  @Input() public plotTitle = '';
  @Input() public projectTitle = '';
  @Input() public plotNum?: number;
  @Input() public customizedAxis = false;
  @Input() public sliderEnabled = false;
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

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.sliderEnabled) {
      if (this.layout && this.layout.xaxis && this.layout.xaxis.rangeslider) {
        this.layout.xaxis.rangeslider.autorange = this.sliderEnabled;
      }
    }
  }

  public handleResize(resize: ResizeObserverEntry): void {
    console.log('onResize', resize);
    this.resizeDebounce();
  }

  public ngOnDestroy(): void {
    this.resizeDebounce?.cancel();
  }

  public getOutputArray(value: PlotlyDataLayout | any, i = 0): number[] {
    return value.data[i];
  }

  public toggleRangeSlider(): void {
    if (this.layout && this.layout.xaxis && this.layout.xaxis.rangeslider) {
      this.layout.xaxis.rangeslider.autorange = !this.layout.xaxis.rangeslider.autorange;
    }
  }

  private setLegendLayout(
    x = 4.5,
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

  private setRangeSliderLayout(
    autoRange = true,
    borderColor = '#ff7b00',
    borderWidth = 1,
    height = 0.15,
  ): RangeSliderLayout {
    const layout: RangeSliderLayout = {
      autorange: autoRange,
      bordercolor: borderColor,
      borderwidth: borderWidth,
      thickness: height,
    };
    return layout;
  }

  private setAxisLayout(
    fontSize = 18,
    fontColor = '#7f7f7f',
    tickFontSize = 14,
    tickFontColor = 'black',
    fontFamily = 'Roboto, sans-serif',
  ): AxisLayout {
    const axisLayout: AxisLayout = {
      tickfont: {
        size: tickFontSize,
        color: tickFontColor,
      },
      font: {
        family: fontFamily,
        size: fontSize,
        color: fontColor,
      },
    };
    if (this.sliderEnabled) {
      axisLayout.rangeslider = this.setRangeSliderLayout();
    }
    return axisLayout;
  }

  private setLayout(): void {
    this.visible = this.hostElement.nativeElement.offsetParent != null;
    if (this.visible && this.layout) {
      this.layout.autosize = true;
      this.layout.legend = this.setLegendLayout();
      if (this.customizedAxis) {
        this.layout.xaxis = this.setAxisLayout();
      }
    }
  }
}
