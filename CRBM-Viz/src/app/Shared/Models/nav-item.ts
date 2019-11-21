import { NavItemDisplayLevel } from '../Enums/nav-item-display-level';

export interface NavItem {
  id?: string;
  label: string;
  icon?: string;
  iconType?: string;
  children?: string[];
  display: NavItemDisplayLevel;
  route?: (string | number)[];
  click?: string;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  // Top-level menu
  {
    id: 'Models',
    label: 'Models',
    icon: 'project-diagram',
    iconType: 'fas',
    children: [
      'Models-Browse',
      'Models-New',
      'Models-Mine',
    ],
    display: NavItemDisplayLevel.always,
  },
  {
    id: 'Simulate',
    label: 'Simulate',
    icon: 'timeline',
    iconType: 'mat',
    children: [
      'Simulate-Browse',
      'Simulate-New',
      'Simulate-Mine',
    ],
    display: NavItemDisplayLevel.always,
  },
  {
    id: 'Visualize',
    label: 'Visualize',
    icon: 'chart-area',
    iconType: 'fas',
    children: ['Visualize-Browse'],
    display: NavItemDisplayLevel.always,
  },
  {
    id: 'Help',
    label: 'Help',
    icon: 'help',
    iconType: 'mat',
    children: ['Help-Help', 'Help-About'],
    display: NavItemDisplayLevel.always,
  },
  {
    id: 'User',
    label: 'Account',
    icon: 'account_circle',
    iconType: 'mat',
    children: [
      'User-Profile',
      // 'User-Notifications',
      // 'User-Settings',
      'User-Sign-In',
      'User-Sign-Up',
      'User-Sign-Out',
    ],
    display: NavItemDisplayLevel.always,
  },

  // Models sub-menu
  {
    id: 'Models-Browse',
    label: 'Browse',
    icon: 'view_list',
    iconType: 'mat',
    display: NavItemDisplayLevel.always,
    route: ['/models'],
  },
  {
    id: 'Models-New',
    label: 'New',
    icon: 'add_circle',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/models/new'],
  },
  {
    id: 'Models-Mine',
    label: 'My models',
    icon: 'account_circle',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/models/mine'],
    disabled: true,
  },

  // Simulate sub-menu
  {
    id: 'Simulate-Browse',
    label: 'Browse',
    icon: 'view_list',
    iconType: 'mat',
    display: NavItemDisplayLevel.always,
    route: ['/simulate/'],
  },
  {
    id: 'Simulate-New',
    label: 'New',
    icon: 'add_circle',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/simulate/new'],
  },
  {
    id: 'Simulate-Mine',
    label: 'My simulations',
    icon: 'account_circle',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/simulate/mine'],
  },

  // Visualize sub-menu
  {
    id: 'Visualize-Browse',
    label: 'Browse',
    icon: 'view_list',
    iconType: 'mat',
    display: NavItemDisplayLevel.always,
    route: ['/visualize'],
  },

  // About sub-menu
  {
    id: 'Help-Help',
    label: 'Help',
    icon: 'help',
    iconType: 'mat',
    display: NavItemDisplayLevel.always,
    route: ['/about/help'],
  },
  {
    id: 'Help-About',
    label: 'About',
    icon: 'info',
    iconType: 'mat',
    display: NavItemDisplayLevel.always,
    route: ['/about'],
  },

  // User account sub-menu
  {
    id: 'User-Profile',
    label: 'Profile',
    icon: 'account_circle',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/user'],
  },
  /*
  {
    id: 'User-Notifications',
    label: 'Notifications',
    icon: 'notifications',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/notifications'],
  },
  {
    id: 'User-Settings',
    label: 'Settings',
    icon: 'settings',
    iconType: 'mat',
    display: NavItemDisplayLevel.loggedIn,
    route: ['/settings'],
  },
  */
  {
    id: 'User-Sign-In',
    label: 'Sign in',
    icon: 'sign-in-alt',
    iconType: 'fas',
    display: NavItemDisplayLevel.loggedOut,
    route: null,
    click: 'toggleLogin',
  },
  {
    id: 'User-Sign-Up',
    label: 'Sign up',
    icon: 'user-plus',
    iconType: 'fas',
    display: NavItemDisplayLevel.loggedOut,
    route: null,
    click: 'toggleLogin',
  },
  {
    id: 'User-Sign-Out',
    label: 'Sign out',
    icon: 'sign-out-alt',
    iconType: 'fas',
    display: NavItemDisplayLevel.loggedIn,
    route: null,
    click: 'toggleLogin',
  },
];
