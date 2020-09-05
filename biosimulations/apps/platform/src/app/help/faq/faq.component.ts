import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass'],
})
export class FaqComponent implements OnInit {
  // TODO: get from app config
  issueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  emailUrl = 'mailto:' + 'info@biosimulations.org'
  biosimulatorsIssueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  submitAppUrl = 'https://submit.biosimulations.org/'
  webserviceUrl = 'https://dispatch.biosimulations.org/'

  constructor() { }

  ngOnInit(): void { }
}
