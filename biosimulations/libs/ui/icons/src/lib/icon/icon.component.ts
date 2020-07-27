import { Component, OnInit, Input } from '@angular/core';

interface IconInfo {
  type: 'mat' | 'fas' | 'fab' | 'far' | 'cc';
  name: string;
}

export type biosimulationsIcon =
  | 'home'
  | 'file'
  | 'question'
  | 'authors'
  | 'reviewer'
  | 'oss'
  | 'simulator'
  | 'repository'
  | 'user'
  | 'model'
  | 'taxon'
  | 'framework'
  | 'format'
  | 'license'
  | 'tag'
  | 'tags'
  | 'cc0'
  | 'ccBy'
  | 'ccNc'
  | 'ccSa'
  | 'ccS'
  | 'cc'
  | 'ccByNc'
  | 'ccBySa'
  | 'ccByNcSa';
@Component({
  selector: 'biosimulations-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input()
  icon!: biosimulationsIcon;
  iconLabel!: string;
  @Input()
  size?: string;
  isSyncAnimated = false;
  iconInfo!: IconInfo;
  iconMap: { [key in biosimulationsIcon]: IconInfo } = {
    home: { type: 'fas', name: 'home' },
    file: { type: 'fas', name: 'file' },
    authors: { type: 'fas', name: 'pencil-alt' },
    user: { type: 'fas', name: 'user' },
    question: { type: 'fas', name: 'question' },
    model: { type: 'fas', name: 'bezier-curve' },
    taxon: { type: 'fas', name: 'dna' },
    oss: { type: 'fab', name: 'osi' },
    framework: { type: 'fas', name: 'calculator' },
    format: { type: 'far', name: 'file-alt' },
    license: { type: 'fas', name: 'certificate' },
    simulator: { type: 'fas', name: 'cogs' },
    repository: { type: 'fas', name: 'database' },
    tag: { type: 'fas', name: 'tag' },
    tags: { type: 'fas', name: 'tags' },
    cc: { type: 'fab', name: 'creative-commons' },
    cc0: { type: 'fab', name: 'creative-commons-zero' },
    ccBy: { type: 'fab', name: 'creative-commons-by' },
    ccNc: { type: 'fab', name: 'creative-commons-nc' },
    ccSa: { type: 'fab', name: 'creative-commons-sa' },
    ccS: { type: 'fab', name: 'creative-commons-s' },
    reviewer: { type: 'fas', name: 'tasks' },
    ccByNc: { type: 'cc', name: 'creative-commons-by_creative-commons-nc' },
    ccByNcSa: {
      type: 'cc',
      name: 'creative-commons-by_creative-commons-nc_creative-commons-sa',
    },
    ccBySa: { type: 'cc', name: 'creative-commons-by_creative-commons-sa' },
  };
  constructor() {
    this.iconInfo = this.iconMap[this.icon];
  }

  ngOnInit(): void {
    this.iconInfo = this.iconMap[this.icon];
    if (!this.iconInfo) {
      this.iconInfo = this.iconMap['question'];
    }
    this.iconLabel = this.icon + '-icon';
  }
}
