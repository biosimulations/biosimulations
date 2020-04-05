export class QueryOptions {
  user?: string;
  parent?: string;
  embed?: string[] = [];

  toQueryString() {
    let queryString = '';
    if (this.user) {
      queryString = queryString.concat('owner=' + (this.user as string));
    }
    if (this.parent) {
      queryString = queryString.concat(('parent=' + this.parent) as string);
    }

    if (this.embed) {
      this.embed.forEach(value => {
        queryString = queryString.concat('embed=' + (value as string) + '&');
      });
    }
    if (queryString.charAt(queryString.length - 1) === '&') {
      queryString = queryString.substring(0, queryString.length - 1);
    }
    return queryString;
  }
}
