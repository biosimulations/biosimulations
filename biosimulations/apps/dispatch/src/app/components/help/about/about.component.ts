import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass'],
})
export class AboutComponent implements OnInit {
  // TODO: get from app config
  appUrl = 'https://biosimulations.org/'
  apiUrl = 'https://api.biosimulations.org/'
  issueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  emailUrl = 'mailto:' + 'info@biosimulations.org'

  constructor() { }

  ngOnInit(): void { }
}
