import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-cc-icon',
  templateUrl: './cc-icon.component.html',
  styleUrls: ['./cc-icon.component.sass'],
})
export class CCIconComponent implements OnInit {
  @Input()
  icon!: string;
  iconList!: string[];

  ngOnInit(): void {
    this.iconList = this.icon.split('_');
  }
}
