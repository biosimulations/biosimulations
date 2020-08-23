import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass'],
})
export class FaqComponent implements OnInit {
  // TODO: get from app config
  emailUrl = 'mailto:' + 'info@biosimulations.org'

  constructor() { }

  ngOnInit(): void { }
}
