import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  simulators = ['COPASI', 'VCell'];

  constructor() { }

  ngOnInit(): void {
  }

}
