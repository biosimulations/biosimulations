import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-logo-text',
  templateUrl: './logo-text.component.html',
  styleUrls: ['./logo-text.component.scss']
})
export class LogoTextComponent implements OnInit {
  left: string = 'Bio';
  right: string = 'Simulations';

  constructor() { }

  ngOnInit(): void {
  }

}
