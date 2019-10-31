export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  icon_type?: string;
  children?: string[];
  display: string;
  link?: string;
  click?: string;
}

export const NavItems: NavItem[] = [
  // Top-level menu
  {
    id: 'Models',
    label: 'Models',
    icon: 'project-diagram',
    icon_type: 'fas',
    children: ['Models-Browse', 'Models-Submit'],
    display: 'always',
  },
  {
    id: 'Simulations',
    label: 'Simulations',
    icon: 'timeline',
    icon_type: 'mat',
    children: ['Simulations-Browse', 'Simulations-Submit'],
    display: 'always',
  },
  {
    id: 'Visualizations',
    label: 'Visualizations',
    icon: 'chart-area',
    icon_type: 'fas',
    children: ['Visualizations-Browse'],
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
    children: ['User-Profile', 'User-Settings', 'User-Sign-In', 'User-Sign-Out'],
    display: 'always',
  },
  
  // Models sub-menu
  {
    id: 'Models-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    display: 'always',
    link: '/files',
  },
  {
    id: 'Models-Submit',
    label: 'Submit',
    icon: 'add_circle',
    icon_type: 'mat',
    display: 'always',
    link: '/files',
  },

  // Simulations sub-menu
  {
    id: 'Simulations-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    display: 'always',
    link: '/data',
  },
  {
    id: 'Simulations-Submit',
    label: 'Submit',
    icon: 'add_circle',
    icon_type: 'mat',
    display: 'always',
    link: '/data',
  },
  
  // Visualizations sub-menu
  {
    id: 'Visualizations-Browse',
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
    link: '/guide',
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
    link: '/profile',
  },
  {
    id: 'User-Settings',
    label: 'Settings',
    icon: 'settings',
    icon_type: 'mat',
    display: 'loggedIn', 
    link: '/settings',
  },
  {
    id: 'User-Sign-In',
    label: 'Sign in',
    icon: 'sign-in-alt',
    icon_type: 'fas',
    display: 'loggedOut', 
    click: 'auth.login()',
  },
  {
    id: 'User-Sign-Out',
    label: 'Sign out',
    icon: 'sign-out-alt',
    icon_type: 'fas',
    display: 'loggedIn', 
    click: 'auth.logout()',
  },
];
