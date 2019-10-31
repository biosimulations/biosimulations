export interface NavItem {
  title: string;
  icon?: string;
  children?: string[];
  link?: string;
  tooltip?: string;
}

export const NavItems: NavItem[] = [
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
    children: ['Data'],
  },
  {
    title: 'Visualizations',
    icon: 'timeline',
    children: [],
  },
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
  {
    title: 'Data',
    icon: 'assignment',
    link: '/data',
  },
];
