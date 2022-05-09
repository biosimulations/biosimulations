import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  HostListener,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Utilities } from './utilities';
import { SliderHandlerEnum } from './slider-handler.enum';
@Component({
  selector: 'biosimulations-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent extends Utilities implements OnInit, OnChanges {
  private sliderModel = [0, 0, 0];
  private step = 1;
  private sliderWidth = 0;
  private totalDiff = 0;
  private startClientX = 0;
  private startPleft = 0;
  private startPRight = 0;
  private minValue!: number;
  private maxValue!: number;
  private minSelected!: number;
  private maxSelected!: number;
  private sliderInitiated = false;

  public initValues: number[] = [];
  public currentValues: number[] = [0, 0];
  public handlerX: number[] = [0, 0];
  public isHandlerActive = false;
  public isTouchEventStart = false;
  public isMouseEventStart = false;
  public currentHandlerIndex = 0;
  public stepIndicatorPositions: any[] = [];
  public isDisabled = false;
  public hideTooltip = false;
  public hideValues = false;

  public handlerIndex = SliderHandlerEnum;

  constructor(private el: ElementRef) {
    super();
  }

  @Input('min')
  set setMinValues(value: number) {
    if (!isNaN(value)) {
      this.minValue = Number(value);
    }
  }

  @Input('max')
  set setMaxValues(value: number) {
    if (!isNaN(value)) {
      this.maxValue = Number(value);
    }
  }

  @Input('minSelected')
  set setMinSelectedValues(value: number) {
    if (!isNaN(value) && this.minSelected !== Number(value)) {
      this.minSelected = Number(value);
    }
  }

  @Input('maxSelected')
  set setMaxSelectedValues(value: number) {
    if (!isNaN(value) && this.maxSelected !== Number(value)) {
      this.maxSelected = Number(value);
    }
  }
  @Input('step')
  set stepValue(value: number) {
    if (!isNaN(value)) {
      this.step = Number(value);
    }
  }

  @Input() showStepIndicator = false;
  @Input() multiRange = true;
  @Input('hide-tooltip')
  set setHideTooltip(value: boolean) {
    this.hideTooltip = this.toBoolean(value);
  }
  @Input('hide-values')
  set setHideValues(value: boolean) {
    this.hideValues = this.toBoolean(value);
  }

  @Input('disabled')
  set setDisabled(value: string) {
    this.isDisabled = this.toBoolean(value, 'disabled');
  }

  @Output() onChange = new EventEmitter<number[]>();

  ngOnInit() {
    this.initializeSlider();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.sliderInitiated) {
      if (
        !this.isNullOrEmpty(changes.setMinSelectedValues) &&
        changes.setMinSelectedValues.previousValue === changes.setMinSelectedValues.currentValue
      ) {
        return;
      }
      if (
        !this.isNullOrEmpty(changes.setMaxSelectedValues) &&
        changes.setMaxSelectedValues.previousValue === changes.setMaxSelectedValues.currentValue
      ) {
        return;
      }
      this.resetModel();
    }
  }

  /*Method to initailize entire Slider*/
  public initializeSlider() {
    try {
      // Taking width of slider bar element.
      this.sliderWidth = this.el.nativeElement.children[0].children[0].offsetWidth;
      this.resetModel();
      this.sliderInitiated = true;
    } catch (e) {
      console.error(e);
    }
  }

  /*Method to initialize variables and model values */
  private resetModel() {
    this.validateSliderValues();
    // Setting the model values
    this.sliderModel = [
      this.currentValues[0] - this.initValues[0],
      this.currentValues[1] - this.currentValues[0],
      this.initValues[1] - this.currentValues[1],
    ];

    this.totalDiff = this.sliderModel.reduce((prevValue, curValue) => prevValue + curValue, 0);

    // Validation for slider step
    if (this.totalDiff % this.step !== 0) {
      const newStep = this.findNextValidStepValue(this.totalDiff, this.step);
      console.warn('Invalid step value "' + this.step + '" : and took "' + newStep + '" as default step');
      this.step = newStep;
    }
    this.initializeStepIndicator();
    this.setHandlerPosition();
  }

  /*Method to do validation of init and seleted range values*/
  private validateSliderValues() {
    if (this.isNullOrEmpty(this.minValue) || this.isNullOrEmpty(this.maxValue)) {
      this.updateInitValues([0, 0]);
      this.updateCurrentValue([0, 0], true);
    } else if (this.minValue > this.maxValue) {
      this.updateInitValues([0, 0]);
      this.updateCurrentValue([0, 0], true);
    } else {
      this.initValues = [this.minValue, this.maxValue];
      /*
       * Validation for Selected range values
       */
      if (
        this.isNullOrEmpty(this.minSelected) ||
        this.minSelected < this.minValue ||
        this.minSelected > this.maxValue
      ) {
        this.minSelected = this.minValue;
      }
      if (
        this.isNullOrEmpty(this.maxSelected) ||
        this.maxSelected < this.minValue ||
        this.maxSelected > this.maxValue
      ) {
        this.maxSelected = this.maxValue;
      }
      if (this.minSelected > this.maxSelected) {
        this.minSelected = this.minValue;
        this.maxSelected = this.maxValue;
      }
      this.updateCurrentValue([this.minSelected, this.maxSelected], true);
    }
  }

  /*Method to add step inidicator to slider */
  private initializeStepIndicator() {
    if (this.showStepIndicator) {
      this.stepIndicatorPositions.length = 0;
      const numOfStepIndicators = this.totalDiff / this.step;
      if (this.sliderWidth / numOfStepIndicators >= 10) {
        const increment = this.sliderWidth / numOfStepIndicators;
        let leftPosition = increment;
        while (this.stepIndicatorPositions.length < numOfStepIndicators - 1) {
          this.stepIndicatorPositions.push(+leftPosition.toFixed(2));
          leftPosition += increment;
        }
      } else {
        console.warn(`As 'step' value is too small compared to min & max value difference and slider width,
          Step Indicator can't be displayed!. Provide slight large value for 'step'`);
      }
    } else {
      this.stepIndicatorPositions.length = 0;
    }
  }

  /*Method to set current selected values */
  private updateCurrentValue(arrayValue: number[], privateChange = false) {
    this.minSelected = this.currentValues[0] = arrayValue[0];
    this.maxSelected = this.currentValues[1] = arrayValue[1];
    if (!privateChange) {
      this.onChange.emit(this.multiRange ? this.currentValues : [this.currentValues[0]]);
    }
  }

  /*Method to set current selected values */
  private updateInitValues(arrayValue: number[]) {
    this.minValue = this.initValues[0] = arrayValue[0];
    this.maxValue = this.initValues[1] = arrayValue[1];
  }

  /*Method to set handler position */
  private setHandlerPosition() {
    let runningTotal = 0;
    // Updating selected values : current values
    this.updateCurrentValue([this.initValues[0] + this.sliderModel[0], this.initValues[1] - this.sliderModel[2]]);
    /*Setting handler position */
    for (let i = 0, len = this.sliderModel.length - 1; i < len; i++) {
      runningTotal += this.sliderModel[i];
      this.handlerX[i] = (runningTotal / this.totalDiff) * 100;
    }
  }

  /*Method to set model array values - will try to refine the values using step */
  private setModelValue(index: number, value: number) {
    if (this.step > 1) {
      value = Math.round(value / this.step) * this.step;
    }
    this.sliderModel[index] = value;
  }

  /*Method to disable handler movement*/
  /*Execute on events:
   * on-mouseup
   * on-panend
   */
  @HostListener('document:mouseup')
  @HostListener('document:panend')
  setHandlerActiveOff() {
    this.isMouseEventStart = false;
    this.isTouchEventStart = false;
    this.isHandlerActive = false;
  }

  /*Method to detect start draging handler*/
  /*Execute on events:
   * on-mousedown
   * on-panstart
   */
  public setHandlerActive(event: any, handlerIndex: number) {
    event.preventDefault();
    if (!this.isDisabled) {
      if (!this.isNullOrEmpty(event.clientX)) {
        this.startClientX = event.clientX;
        this.isMouseEventStart = true;
        this.isTouchEventStart = false;
      } else if (!this.isNullOrEmpty(event.deltaX)) {
        this.startClientX = event.deltaX;
        this.isTouchEventStart = true;
        this.isMouseEventStart = false;
      }
      if (this.isMouseEventStart || this.isTouchEventStart) {
        this.currentHandlerIndex = handlerIndex;
        this.startPleft = this.sliderModel[handlerIndex];
        this.startPRight = this.sliderModel[handlerIndex + 1];
        this.isHandlerActive = true;
      }
    }
  }

  /*Method to calculate silder handler movement */
  /*Execute on events:
   * on-mousemove
   * on-panmove
   */
  public handlerSliding(event: any) {
    if ((this.isMouseEventStart && event.clientX) || (this.isTouchEventStart && event.deltaX)) {
      const movedX = Math.round(
        (((event.clientX || event.deltaX) - this.startClientX) / this.sliderWidth) * this.totalDiff,
      );
      const nextPLeft = this.startPleft + movedX;
      const nextPRight = this.startPRight - movedX;
      if (nextPLeft >= 0 && nextPRight >= 0) {
        this.setModelValue(this.currentHandlerIndex, nextPLeft);
        this.setModelValue(this.currentHandlerIndex + 1, nextPRight);
        this.setHandlerPosition();
      }
    }
  }
}
