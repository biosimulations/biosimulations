import { Component, OnInit, Type } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { navItems } from 'src/app/Shared/Models/nav-item';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent implements OnInit {
  NavItemDisplayLevel = NavItemDisplayLevel;
  navItems: NavItem[] = navItems;

  constructor(public auth: AuthService) {}

  isTopLevel(navItem: NavItem) {
    return navItem.children != null;
  }

  isChildOf(child: NavItem, args: any[]) {
    const parent: NavItem = args[0];

    return parent.children.includes(child.id);
  }

  getClick(navItem: NavItem) {
    if (navItem.clickData === 'toggleLogin') {
      if (this.auth.loggedIn) {
        this.auth.logout()
      } else {
        this.auth.login()
      }
    }
  }

  ngOnInit() {}
}
