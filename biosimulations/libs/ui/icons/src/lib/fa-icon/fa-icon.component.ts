import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-fa-icon',
  templateUrl: './fa-icon.component.html',
  styleUrls: ['./fa-icon.component.sass'],
})
export class FaIconComponent implements OnInit {
  @Input()
  icon!: string;
  constructor() {}

  ngOnInit(): void {}
}
