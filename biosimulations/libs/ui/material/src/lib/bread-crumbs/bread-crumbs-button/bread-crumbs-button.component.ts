import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-bread-crumbs-button',
  templateUrl: './bread-crumbs-button.component.html',
  styleUrls: ['./bread-crumbs-button.component.scss']
})
export class BreadCrumbsButtonComponent implements OnInit {


  @Input()
  label!: string
  @Input()
  icon!: string

  @Input()
  route!: string

  constructor() { }

  ngOnInit(): void {
  }

}
