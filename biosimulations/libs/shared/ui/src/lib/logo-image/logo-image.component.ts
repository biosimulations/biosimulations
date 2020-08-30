import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-logo-image',
  templateUrl: './logo-image.component.html',
  styleUrls: ['./logo-image.component.scss']
})
export class LogoImageComponent implements OnInit {
  // TODO: get from app config
  src = '/assets/images/biosimulations-logo/logo.svg';

  constructor() { }

  ngOnInit(): void {
  }

}
