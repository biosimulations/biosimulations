import { Component, OnInit, Input } from '@angular/core';

interface IconInfo {
  type: 'mat' | 'fas' | 'fab' | 'far';
  name: string;
}
@Component({
  selector: 'biosimulations-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input()
  icon!: string;
  @Input()
  size?: string;
  isSyncAnimated = false;
  iconInfo!: IconInfo;
  iconMap: { [key: string]: IconInfo } = {
    home: { type: 'fas', name: 'home' },
    file: { type: 'fas', name: 'file' },
    question: { type: 'fas', name: 'question' },
  };
  constructor() {
    this.iconInfo = this.iconMap[this.icon];
  }

  ngOnInit(): void {
    this.iconInfo = this.iconMap[this.icon];
    if (!this.iconInfo) {
      this.iconInfo = this.iconMap['question'];
    }
  }
}
