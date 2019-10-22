import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass'],
})
export class SearchBarComponent implements OnInit {
  @Input() buttonTerm = 'Search';
  @Input() icon = 'search';
  @Input() placeholder = 'Search...';
  @Input() baseURL = '/search/';
  constructor() {}

  ngOnInit() {}
}
