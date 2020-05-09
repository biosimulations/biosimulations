import { Component, OnInit, Input } from '@angular/core';

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
  constructor() {}

  ngOnInit(): void {}
}
