import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-image',
  templateUrl: './home-image.component.svg',
  styleUrls: ['./home-image.component.sass']
})
export class HomeImageComponent {
  constructor(private router: Router) { }

  route(path: (string | number)[]): void {
    this.router.navigate(path);
  }
}
