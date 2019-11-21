export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  icon_type?: string;
  children?: string[];
  display: string;
  link?: string;
  click?: string;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  // Top-level menu
  {
    id: 'Models',
    label: 'Models',
    icon: 'project-diagram',
    icon_type: 'fas',
    children: [
      'Models-Browse',
      'Models-New',
      'Models-Mine',
    ],
    display: 'always',
  },
  {
    id: 'Simulate',
    label: 'Simulate',
    icon: 'timeline',
    icon_type: 'mat',
    children: [
      'Simulate-Browse',
      'Simulate-New',
      'Simulate-Mine',
    ],
    display: 'always',
  },
  {
    id: 'Visualize',
    label: 'Visualize',
    icon: 'chart-area',
    icon_type: 'fas',
    children: ['Visualize-Browse'],
    display: 'always',
  },
  {
    id: 'Help',
    label: 'Help',
    icon: 'help',
    icon_type: 'mat',
    children: ['Help-Help', 'Help-About'],
    display: 'always',
  },
  {
    id: 'User',
    label: 'Account',
    icon: 'account_circle',
    icon_type: 'mat',
    children: [
      'User-Profile',
      // 'User-Notifications',
      // 'User-Settings',
      'User-Sign-In',
      'User-Sign-Up',
      'User-Sign-Out',
    ],
    display: 'always',
  },

  // Models sub-menu
  {
    id: 'Models-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    display: 'always',
    link: '/models',
  },
  {
    id: 'Models-New',
    label: 'New',
    icon: 'add_circle',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/models/new',
  },
  {
    id: 'Models-Mine',
    label: 'My models',
    icon: 'account_circle',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/models/mine',
    disabled: true,
  },

  // Simulate sub-menu
  {
    id: 'Simulate-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    display: 'always',
    link: '/simulate/',
  },
  {
    id: 'Simulate-New',
    label: 'New',
    icon: 'add_circle',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/simulate/new',
  },
  {
    id: 'Simulate-Mine',
    label: 'My simulations',
    icon: 'account_circle',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/simulate/mine',
  },

  // Visualize sub-menu
  {
    id: 'Visualize-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    display: 'always',
    link: '/visualize',
  },

  // About sub-menu
  {
    id: 'Help-Help',
    label: 'Help',
    icon: 'help',
    icon_type: 'mat',
    display: 'always',
    link: '/about/help',
  },
  {
    id: 'Help-About',
    label: 'About',
    icon: 'info',
    icon_type: 'mat',
    display: 'always',
    link: '/about',
  },

  // User account sub-menu
  {
    id: 'User-Profile',
    label: 'Profile',
    icon: 'account_circle',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/user',
  },
  /*
  {
    id: 'User-Notifications',
    label: 'Notifications',
    icon: 'notifications',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/notifications',
  },
  {
    id: 'User-Settings',
    label: 'Settings',
    icon: 'settings',
    icon_type: 'mat',
    display: 'loggedIn',
    link: '/settings',
  },
  */
  {
    id: 'User-Sign-In',
    label: 'Sign in',
    icon: 'sign-in-alt',
    icon_type: 'fas',
    display: '!loggedIn',
    link: null,
    click: 'toggleLogin',
  },
  {
    id: 'User-Sign-Up',
    label: 'Sign up',
    icon: 'user-plus',
    icon_type: 'fas',
    display: '!loggedIn',
    link: null,
    click: 'toggleLogin',
  },
  {
    id: 'User-Sign-Out',
    label: 'Sign out',
    icon: 'sign-out-alt',
    icon_type: 'fas',
    display: 'loggedIn',
    link: null,
    click: 'toggleLogin',
  },
];
