import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent implements OnInit {
  // TODO: get from app config
  apiUrl = 'https://api.biosimulations.org/'  
  submitAppUrl = 'https://submit.biosimulations.org/'
  submitAppHelpUrl = this.submitAppUrl + 'help'
  webserviceUrl = 'https://dispatch.biosimulations.org/'

  constructor() { }

  ngOnInit(): void { }
}
