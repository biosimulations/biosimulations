export interface NavItem {
  title: string;
  label: string;
  icon?: string;
  icon_type?: string;
  children?: string[];
  link?: string;
  tooltip?: string;
}

export const NavItems: NavItem[] = [
  // Top-level menu
  {
    title: 'Models',
    label: 'Models',
    icon: 'project-diagram',
    icon_type: 'fas',
    children: ['Models-Browse', 'Models-Submit'],
  },
  {
    title: 'Simulations',
    label: 'Simulations',
    icon: 'timeline',
    icon_type: 'mat',
    children: ['Simulations-Browse', 'Simulations-Submit'],
  },
  {
    title: 'Visualizations',
    label: 'Visualizations',
    icon: 'chart-area',
    icon_type: 'fas',
    children: ['Visualizations-Browse'],
  },
  {
    title: 'Help',
    label: 'Help',
    icon: 'help',
    icon_type: 'mat',
    children: ['Help-Help', 'Help-About'],
  },
  {
    title: 'User',
    label: 'Account',
    icon: 'account_circle',
    icon_type: 'mat',
    children: ['User-Profile', 'User-Settings'],
  },
  
  // Models sub-menu
  {
    title: 'Models-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    link: '/files',
  },
  {
    title: 'Models-Submit',
    label: 'Submit',
    icon: 'add_circle',
    icon_type: 'mat',
    link: '/files',
  },

  // Simulations sub-menu
  {
    title: 'Simulations-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    link: '/data',
  },
  {
    title: 'Simulations-Submit',
    label: 'Submit',
    icon: 'add_circle',
    icon_type: 'mat',
    link: '/data',
  },
  
  // Visualizations sub-menu
  {
    title: 'Visualizations-Browse',
    label: 'Browse',
    icon: 'view_list',
    icon_type: 'mat',
    link: '/visualize',
  },

  // About sub-menu
  {
    title: 'Help-Help',
    label: 'Help',
    icon: 'help',
    icon_type: 'mat',
    link: '/guide',
  },
  {
    title: 'Help-About',
    label: 'About',
    icon: 'info',
    icon_type: 'mat',
    link: '/about',
  },

  // User account sub-menu
  {
    title: 'User-Profile',
    label: 'Profile',
    icon: 'account_circle',
    icon_type: 'mat',
    link: '/profile',
  },
  {
    title: 'User-Settings',
    label: 'Settings',
    icon: 'settings',
    icon_type: 'mat',
    link: '/settings',
  },
];
