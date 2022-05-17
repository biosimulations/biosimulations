import { Component, EventEmitter, Input, Output } from '@angular/core';
export type DateRange = {
  start: Date | null;
  end: Date | null;
  selectedStart: Date | null;
  selectedEnd: Date | null;
};
@Component({
  selector: 'biosimulations-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent {
  /**
   * The earliest date that can be selected.
   */
  @Input()
  public startDate: Date | null = null;

  /**
   * The latest date that can be selected.
   *
   **/
  @Input()
  public endDate: Date | null = null;

  /**
   * The currently selected start date.
   *
   **/
  @Input()
  public selectedStartDate: Date | null = null;

  /**
   * The currently selected end date.
   **/
  @Input()
  public selectedEndDate: Date | null = null;

  @Output()
  public dateFilterChange = new EventEmitter<DateRange>();

  public handleDateFilterChange(start?: Date, end?: Date): void {
    this.selectedStartDate = start || this.selectedStartDate;
    this.selectedEndDate = end || this.selectedEndDate;
    this.emitDate();
  }
  public emitDate(): void {
    this.dateFilterChange.emit({
      start: this.startDate,
      end: this.endDate,
      selectedStart: this.selectedStartDate,
      selectedEnd: this.selectedEndDate,
    });
  }
  public clearFilter(): void {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.emitDate();
  }
}
