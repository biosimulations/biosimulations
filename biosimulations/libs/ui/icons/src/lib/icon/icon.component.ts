import { Component, OnInit, Input } from '@angular/core';
import { biosimulationsIcon } from '../..';

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
  icon!: biosimulationsIcon;
  @Input()
  size?: string;
  isSyncAnimated = false;
  iconInfo!: IconInfo;
  iconMap: { [key in biosimulationsIcon]: IconInfo } = {
    home: { type: 'fas', name: 'home' },
    file: { type: 'fas', name: 'file' },
    authors: { type: 'fas', name: 'users' },
    author: { type: 'fas', name: 'user' },
    question: { type: 'fas', name: 'question' },
    model: { type: 'fas', name: 'bezier-curve' },
    taxon: { type: 'fas', name: 'dna' },
    framework: { type: 'fas', name: 'calculator' },
    format: { type: 'far', name: 'file-alt' },
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
