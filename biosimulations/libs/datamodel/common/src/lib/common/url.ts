export enum UrlType {
  type_1 = 'Home page',
  type_2 = 'Software catalogue',
  type_3 = 'Docker image',
  type_4 = 'Dockerfile',
  type_5 = 'Examples',
  type_6 = 'Installation instructions',
  type_7 = 'Tutorial',
  type_8 = 'Documentation',
  type_9 = 'FAQ',
  type_10 = 'News',
  type_11 = 'Release notes',
  type_12 = 'Discussion forum',
  type_13 = 'Mailing list',
  type_14 = 'Issue tracker',
  type_15 = 'Guide to contributing',
  type_16 = 'Source repository',
  type_17 = 'Code of conduct',
  type_18 = 'License',
  type_19 = 'Terms of service',
  type_20 = 'Contact information',
  type_21 = 'Other',
}

export interface Url {
  url: string;
  title: string | null;
  type: UrlType;
}
