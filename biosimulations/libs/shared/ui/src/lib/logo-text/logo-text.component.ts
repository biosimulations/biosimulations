import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-logo-text',
  templateUrl: './logo-text.component.html',
  styleUrls: ['./logo-text.component.scss']
})
export class LogoTextComponent implements OnInit {
  // TODO: get from app config
  appNameParts: string[] = ['Bio', 'Simulations'];

  constructor() { }

  ngOnInit(): void {
  }

}
