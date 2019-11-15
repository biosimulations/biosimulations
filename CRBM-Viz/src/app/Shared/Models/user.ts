export class User {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  organization: string;
  website: string;
  publicEmail: string;
  github: string;
  googleScholar: string;
  orcid: string;

  constructor(id?: number, firstName?: string, lastName?: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    
    this.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla risus ac aliquam commodo. Ut pellentesque, \
      ligula sit amet condimentum lacinia, sapien tortor malesuada justo, et finibus nulla tellus vel velit. Aliquam erat volutpat. \
      Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras a scelerisque urna. \
      Sed sodales ex vel sapien condimentum, at rhoncus nisi mollis. Sed blandit lobortis sagittis. Ut pretium quam odio, \
      nec dictum erat aliquet quis. Quisque elementum, leo sagittis convallis suscipit, libero nisi faucibus nibh, \
      eu malesuada mauris dolor a orci. Aliquam erat volutpat. Cras tortor augue, euismod at neque non, aliquet feugiat libero.\
      Integer ullamcorper est laoreet, cursus odio sit amet, molestie libero. Etiam iaculis purus at felis interdum, \
      vel lobortis turpis consequat. Etiam faucibus libero finibus, posuere lacus vel, malesuada libero. Vestibulum augue est,\
      cursus eget purus vitae, tincidunt aliquet ligula';
    this.organization = 'Icahn School of Medicine at Mount Sinai';    
    this.website = 'https://www.karrlab.org';
    this.publicEmail = 'jonrkarr@gmail.com';
    this.github = 'jonrkarr';
    this.googleScholar = 'Yb5nVLAAAAAJ';
    this.orcid = '0000-0002-2605-5080';
  }

  getFullName(): string {
    const name: string[] = [];
    if (this.firstName) {
        name.push(this.firstName);
    }
    if (this.lastName) {
        name.push(this.lastName);
    }
    return name.join(' ');
  }
}
