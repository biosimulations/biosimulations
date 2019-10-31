import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { NavItems } from 'src/app/Shared/Models/nav-item';
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
  isChildOf(child: NavItem, args: any[]) {
    const parent: NavItem = args[0];
    
    return parent.children.includes(child.id);
  }

  ngOnInit() {}
}
