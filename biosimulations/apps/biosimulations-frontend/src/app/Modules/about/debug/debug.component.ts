import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.sass'],
})
export class DebugComponent implements OnInit {
  env: any;
  constructor() {}

  ngOnInit(): void {
    this.env = environment;
  }
}
