import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-preview',
  templateUrl: './edit-preview.component.html',
  styleUrls: ['./edit-preview.component.sass'],
})
export class EditPreviewComponent implements OnInit {
  @Input()
  data;
  @Input()
  headers = ['Edit Form,', 'Preview Json'];
  constructor() {}

  ngOnInit(): void {}
}
