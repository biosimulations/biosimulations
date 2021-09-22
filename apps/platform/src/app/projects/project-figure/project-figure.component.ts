import { Component, Input, OnInit } from '@angular/core';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';

@Component({
  selector: 'biosimulations-project-figure',
  templateUrl: './project-figure.component.html',
  styleUrls: ['./project-figure.component.scss'],
})
export class ProjectFigureComponent implements OnInit {
  @Input()
  figureMetadata!: ArchiveMetadata;
  constructor() {}

  ngOnInit(): void {}
}
