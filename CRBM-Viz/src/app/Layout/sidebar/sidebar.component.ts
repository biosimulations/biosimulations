import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';
import { NavItem } from 'src/app/Models/nav-item';
import { NavItems } from 'src/app/Models/nav-item';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent implements OnInit {
  NavItems = NavItems;
  constructor(public auth: AuthService) {}
  isTopLevel(navItem: NavItem) {
    return navItem.children != null;
  }
  isChildOf(child: NavItem, parent: NavItem) {
    return parent.children.includes(child.title);
  }

  ngOnInit() {}
}
