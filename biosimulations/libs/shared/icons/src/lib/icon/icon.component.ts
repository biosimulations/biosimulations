import { Component, OnInit, Input } from '@angular/core';

interface IconInfo {
  type: 'mat' | 'fas' | 'fab' | 'far' | 'cc';
  name: string;
}

export type biosimulationsIcon =
  | 'home'
  | 'file'
  | 'help'
  | 'tutorial'
  | 'info'
  | 'legal'
  | 'policy'
  | 'comment'
  | 'bug'
  | 'error'
  | 'user'
  | 'author'
  | 'reviewer'
  | 'reuser'
  | 'write'
  | 'review'
  | 'oss'
  | 'simulator'
  | 'simulators'
  | 'repository'
  | 'login'
  | 'logout'
  | 'project'
  | 'model'
  | 'simulation'
  | 'task'
  | 'chart'
  | 'visualization'
  | 'browse'
  | 'new'
  | 'overview'
  | 'report'
  | 'download'
  | 'upload'
  | 'logs'
  | 'compare'
  | 'filter'
  | 'columns'
  | 'reuse'
  | 'taxon'
  | 'framework'
  | 'format'
  | 'license'
  | 'id'
  | 'tag'
  | 'tags'
  | 'status'
  | 'date'
  | 'duration'
  | 'cc0'
  | 'ccBy'
  | 'ccNc'
  | 'ccSa'
  | 'ccS'
  | 'cc'
  | 'ccByNc'
  | 'ccBySa'
  | 'ccByNcSa'
  | 'version'
  | 'link'
  | 'internalLink'
  | 'email'
  | 'git'
  | 'github'
  | 'docker'
  | 'linkedin'
  | 'orcid'
  | 'toTop';
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
    link: { type: 'fas', name: 'link' },
    internalLink: { type: 'fas', name: 'external-link-alt'},
    toTop: { type: 'fas', name: 'angle-double-up' },
    email: { type: 'fas', name: 'envelope' },
    git: { type: 'fab', name: 'git-alt' },
    github: { type: 'fab', name: 'github' },
    docker: { type: 'fab', name: 'docker' },
    linkedin: { type: 'fab', name: 'linkedin' },
    orcid: { type: 'fab', name: 'orcid' },
    file: { type: 'fas', name: 'file-alt' },
    user: { type: 'fas', name: 'user' },
    author: { type: 'fas', name: 'user-edit' },
    reviewer: { type: 'fas', name: 'user-check' },
    reuser: { type: 'fas', name: 'user-cog' },
    write: { type: 'fas', name: 'pencil-alt' },
    review: { type: 'fas', name: 'tasks' },
    login: { type: 'fas', name: 'sign-in-alt' },
    logout: { type: 'fas', name: 'sign-out-alt' },
    help: { type: 'fas', name: 'question-circle' },
    tutorial: { type: 'fas', name: 'book-open' },
    info: { type: 'fas', name: 'info-circle' },
    legal: { type: 'fas', name: 'balance-scale' },
    policy: { type: 'fas', name: 'shield-alt' },
    comment: { type: 'fas', name: 'comment-dots' },
    bug: { type: 'fas', name: 'bug' },
    error: { type: 'fas', name: 'exclamation' },
    project: { type: 'fas', name: 'folder-open' },
    model: { type: 'fas', name: 'project-diagram' },
    simulation: { type: 'mat', name: 'timeline' },
    task: { type: 'fas', name: 'tasks' },
    chart: { type: 'fas', name: 'chart-bar' },
    visualization: { type: 'fas', name: 'paint-brush' },
    browse: { type: 'fas', name: 'list' },
    new: { type: 'fas', name: 'plus-circle' },
    overview: { type: 'fas', name: 'list' },
    report: { type: 'fas', name: 'table' },
    download: { type: 'fas', name: 'download' },
    upload: { type: 'fas', name: 'upload' },
    logs: { type: 'fas', name: 'terminal' },
    compare: { type: 'mat', name: 'stacked_line_chart' },
    filter: { type: 'fas', name: 'filter' },
    columns: { type: 'fas', name: 'columns' },
    reuse: { type: 'fas', name: 'sync-alt' },
    taxon: { type: 'fas', name: 'dna' },
    oss: { type: 'fab', name: 'osi' },
    framework: { type: 'fas', name: 'calculator' },
    format: { type: 'far', name: 'file-alt' },
    license: { type: 'fas', name: 'certificate' },
    simulator: { type: 'fas', name: 'cog' },
    simulators: { type: 'fas', name: 'cogs' },
    repository: { type: 'fas', name: 'database' },
    id: { type: 'fas', name: 'hashtag' },
    tag: { type: 'fas', name: 'tag' },
    tags: { type: 'fas', name: 'tags' },
    status: { type: 'fas', name: 'tachometer-alt' },
    date: { type: 'fas', name: 'calendar-alt' },
    duration: { type: 'fas', name: 'stopwatch' },
    cc: { type: 'fab', name: 'creative-commons' },
    cc0: { type: 'fab', name: 'creative-commons-zero' },
    ccBy: { type: 'fab', name: 'creative-commons-by' },
    ccNc: { type: 'fab', name: 'creative-commons-nc' },
    ccSa: { type: 'fab', name: 'creative-commons-sa' },
    ccS: { type: 'fab', name: 'creative-commons-s' },
    ccByNc: { type: 'cc', name: 'creative-commons-by_creative-commons-nc' },
    ccByNcSa: {
      type: 'cc',
      name: 'creative-commons-by_creative-commons-nc_creative-commons-sa',
    },
    ccBySa: { type: 'cc', name: 'creative-commons-by_creative-commons-sa' },
    version: { type: 'fas', name: 'code-branch' },
  };
  constructor() {
    this.iconInfo = this.iconMap[this.icon];
  }

  ngOnInit(): void {
    this.iconInfo = this.iconMap[this.icon];
    if (!this.iconInfo) {
      console.error("icon '" + this.icon + "' not found in library")
      this.iconInfo = this.iconMap['help'];
    }
    this.iconLabel = this.icon + '-icon';
  }
}
