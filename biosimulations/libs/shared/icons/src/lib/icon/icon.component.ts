import { Component, OnInit, Input } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

interface IconInfo {
  type: 'mat' | 'fas' | 'fab' | 'far' | 'fal' | 'fad' | 'cc';
  name: IconName;
  spin?: boolean;
}

export type BiosimulationsIcon =
  | 'home'
  | 'file'
  | 'help'
  | 'tutorial'
  | 'info'
  | 'contact'
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
  | 'experiment'
  | 'task'
  | 'chart'
  | 'visualization'
  | 'browse'
  | 'new'
  | 'overview'
  | 'report'
  | 'download'
  | 'upload'
  | 'refresh'
  | 'logs'
  | 'compare'
  | 'controls'
  | 'search'
  | 'filter'
  | 'columns'
  | 'reuse'
  | 'taxon'
  | 'framework'
  | 'format'
  | 'standard'
  | 'code'
  | 'operatingSystem'
  | 'softwareInterface'
  | 'license'
  | 'free'
  | 'paid'
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
  | 'copy'
  | 'fork'
  | 'link'
  | 'internalLink'
  | 'email'
  | 'git'
  | 'github'
  | 'docker'
  | 'linkedin'
  | 'orcid'
  | 'toTop'
  | 'more'
  | 'construction'
  | 'maintainence'
  | 'valid'
  | 'invalid'
  | 'funding'
  | 'spinner'
  | 'trash'
  | 'progress'
  | 'open'
  | 'url'
  | 'share'
  | 'close'
  | 'longRightArrow'
  | 'pdf'
  | 'video'
  | 'googleDrive'
  | 'youtube'
  | 'location'
  | 'memory'
  | 'processor';
@Component({
  selector: 'biosimulations-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input()
  icon!: BiosimulationsIcon;
  iconLabel!: string;
  @Input()
  size?: string;
  isSyncAnimated = false;
  iconInfo!: IconInfo;
  iconMap: { [key in BiosimulationsIcon]: IconInfo } = {
    share: { type: 'fas', name: 'share-alt' },
    home: { type: 'fas', name: 'home' },
    internalLink: { type: 'fas', name: 'link' },
    link: { type: 'fas', name: 'external-link-alt' },
    toTop: { type: 'fas', name: 'angle-double-up' },
    more: { type: 'fas', name: 'angle-double-right' },
    url: { type: 'fas', name: 'cloud' },
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
    contact: { type: 'fas', name: 'comment-dots' },
    legal: { type: 'fas', name: 'balance-scale' },
    policy: { type: 'fas', name: 'shield-alt' },
    comment: { type: 'fas', name: 'comment-dots' },
    bug: { type: 'fas', name: 'bug' },
    error: { type: 'fas', name: 'exclamation' },
    project: { type: 'fas', name: 'folder-open' },
    model: { type: 'fas', name: 'project-diagram' },
    simulation: { type: 'mat', name: 'timeline' as IconName },
    experiment: { type: 'fas', name: 'flask' },
    task: { type: 'fas', name: 'tasks' },
    chart: { type: 'fas', name: 'chart-bar' },
    visualization: { type: 'fas', name: 'paint-brush' },
    browse: { type: 'fas', name: 'list' },
    new: { type: 'fas', name: 'plus-circle' },
    overview: { type: 'fas', name: 'list' },
    report: { type: 'fas', name: 'table' },
    download: { type: 'fas', name: 'download' },
    upload: { type: 'fas', name: 'upload' },
    refresh: { type: 'fas', name: 'sync-alt' },
    logs: { type: 'fas', name: 'terminal' },
    compare: {
      type: 'mat' as IconPrefix,
      name: 'stacked_line_chart' as IconName,
    },
    controls: { type: 'fas', name: 'cog' },
    search: { type: 'fas', name: 'search' },
    filter: { type: 'fas', name: 'filter' },
    columns: { type: 'fas', name: 'columns' },
    reuse: { type: 'fas', name: 'sync-alt' },
    taxon: { type: 'fas', name: 'dna' },
    oss: { type: 'fab', name: 'osi' },
    framework: { type: 'fas', name: 'calculator' },
    format: { type: 'far', name: 'file-alt' },
    standard: { type: 'fas', name: 'check-double' },
    code: { type: 'fas', name: 'code' },
    operatingSystem: { type: 'fas', name: 'cog' },
    softwareInterface: { type: 'fas', name: 'desktop' },
    license: { type: 'fas', name: 'balance-scale' },
    free: { type: 'fas', name: 'lock-open' },
    paid: { type: 'fas', name: 'lock' },
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
    ccS: { type: 'fab', name: 'creative-commons-share' },
    ccByNc: {
      type: 'cc' as IconPrefix,
      name: 'creative-commons-by_creative-commons-nc' as IconName,
    },
    ccByNcSa: {
      type: 'cc' as IconPrefix,
      name: 'creative-commons-by_creative-commons-nc_creative-commons-sa' as IconName,
    },
    ccBySa: {
      type: 'cc' as IconPrefix,
      name: 'creative-commons-by_creative-commons-sa' as IconName,
    },
    version: { type: 'fas', name: 'code-branch' },
    copy: { type: 'fas', name: 'copy' },
    fork: { type: 'fas', name: 'code-branch' },
    construction: { type: 'fas', name: 'tools' },
    maintainence: { type: 'fas', name: 'tools' },
    valid: { type: 'fas', name: 'check' },
    invalid: { type: 'fas', name: 'times' },
    funding: { type: 'fas', name: 'dollar-sign' },
    spinner: { type: 'fas', name: 'spinner', spin: true },
    trash: { type: 'fas', name: 'trash' },
    progress: { type: 'fas', name: 'tasks' },
    open: { type: 'fas', name: 'chevron-down' },
    close: { type: 'fas', name: 'chevron-up' },
    longRightArrow: { type: 'fas', name: 'long-arrow-alt-right' },

    pdf: { type: 'fas', name: 'file-pdf' },
    video: { type: 'fas', name: 'video' },
    googleDrive: { type: 'fab', name: 'google-drive' },
    youtube: { type: 'fab', name: 'youtube' },

    location: { type: 'fas', name: 'location-arrow' },
    memory: { type: 'fas', name: 'memory' },
    processor: { type: 'fas', name: 'microchip' },
  };
  constructor() {
    this.iconInfo = this.iconMap[this.icon];
  }

  ngOnInit(): void {
    this.iconInfo = this.iconMap[this.icon];
    if (!this.iconInfo) {
      console.error("icon '" + this.icon + "' not found in library");
      this.iconInfo = this.iconMap['help'];
    }
    this.iconLabel = this.icon + '-icon';
  }
}
