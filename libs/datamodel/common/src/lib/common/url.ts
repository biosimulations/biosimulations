export enum UrlType {
  type_1 = 'Home page',
  type_2 = 'Web application',
  type_3 = 'Web service',
  type_4 = 'Docker image',
  type_5 = 'Dockerfile',
  type_6 = 'Software catalogue',
  type_7 = 'Examples',
  type_8 = 'Installation instructions',
  type_9 = 'Tutorial',
  type_10 = 'Documentation',
  type_11 = 'FAQ',
  type_12 = 'News',
  type_13 = 'Release notes',
  type_14 = 'Discussion forum',
  type_15 = 'Mailing list',
  type_16 = 'Issue tracker',
  type_17 = 'Guide to contributing',
  type_18 = 'Code of conduct',
  type_19 = 'Source repository',
  type_20 = 'Unit tests',
  type_21 = 'Continuous integration builds',
  type_22 = 'License',
  type_23 = 'Terms of service',
  type_24 = 'Contact information',
  type_25 = 'Other',
}

export interface Url {
  url: string;
  title: string | null;
  type: UrlType;
}

export function sortUrls(a: Url, b: Url): number {
  if (a.type === b.type) {
    return 0;
  }

  let aVal = 0;
  let bVal = 0;
  for (const [val, label] of Object.entries(UrlType)) {
    if (label === a.type) {
      aVal = parseInt(val.substring(5));
    }

    if (label === b.type) {
      bVal = parseInt(val.substring(5));
    }
  }

  if (aVal < bVal) {
    return -1;
  } else {
    return 1;
  }
}
