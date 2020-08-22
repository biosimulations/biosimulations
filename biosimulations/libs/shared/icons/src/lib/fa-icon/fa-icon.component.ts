import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-fa-icon',
  templateUrl: './fa-icon.component.html',
  styleUrls: ['./fa-icon.component.scss'],
})
export class FaIconComponent implements OnInit {
  @Input()
  icon!: string;
  constructor() { }

  ngOnInit(): void { }
}
