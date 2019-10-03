import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass'],
})
export class SearchBarComponent implements OnInit {
  @Input() buttonTerm: string = 'Search';
  @Input() placeholder: string = 'Search...';
  constructor() {}

  ngOnInit() {}
}
