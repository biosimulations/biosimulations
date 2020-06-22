import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'biosimulations-stepper-buttons',
  templateUrl: './next-previous-buttons.component.html',
  styleUrls: ['./next-previous-buttons.component.scss'],
})
export class StepperButtonsComponent implements OnInit {
  @Input()
  showNext = true;
  @Input()
  showPrevious = true;
  @Input()
  enableNext = true;
  @Input()
  enablePrevious = true;
  @Input()
  nextLabel = 'Next';
  @Input()
  previousLabel = 'Back';

  @Output()
  next = new EventEmitter();
  @Output()
  previous = new EventEmitter();

  constructor() {}
  ngOnInit(): void {}
}
