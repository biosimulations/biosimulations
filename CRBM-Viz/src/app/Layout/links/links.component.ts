import { Component, OnInit } from '@angular/core';
import { CrbmAuthService } from 'src/app/Services/crbm-auth.service';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass'],
})
export class LinksComponent implements OnInit {
  constructor(public crbmAuthService: CrbmAuthService) {}

  ngOnInit() {}
}
