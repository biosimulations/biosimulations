import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent implements OnInit {
  // TODO: get from app config
  apiUrl = 'https://api.biosimulations.dev/'
  webserviceUrl = 'https://submit.biosimulations.dev/'
  webserviceHelpUrl = webserviceUrl + 'help'

  constructor() { }

  ngOnInit(): void { }
}
