import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass'],
})
export class LinksComponent implements OnInit {
  headers = [
    {
      title: 'BioSimulations',
      icon: 'polymer',
      children: ['Home', 'About', 'User Guide', 'Team'],
    },
    {
      title: 'Account',
      icon: 'account_circle',
      children: ['Profile', 'Notifications', 'Settings'],
    },
    {
      title: 'Models',
      icon: 'file_copy',
      children: [],
    },
    {
      title: 'Simulations',
      icon: 'explore',
      children: [],
    },
    {
      title: 'Visualizations',
      icon: 'timeline',
      children: [],
    },
  ];
  routes = [
    {
      title: 'Home',
      icon: 'home',
      link: '/',
    },
    {
      title: 'About',
      icon: 'info',
      link: '/about',
    },
    {
      title: 'User Guide',
      icon: 'help',
      link: '/guide',
    },
    {
      title: 'Team',
      icon: 'face',
      link: '/about',
    },
    {
      title: 'Profile',
      icon: 'person',
      link: '/profile/',
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      link: '/profile',
    },
    {
      title: 'Settings',
      icon: 'settings',
      link: '/settings',
    },
  ];
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
