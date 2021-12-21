import { isUrlConstraint, IsURLOptions } from './isUrl';

describe('isUrl', () => {
  const options: IsURLOptions = {
    require_protocol: true,
    protocols: ['http', 'https'],
    allowDecodedUrls: true,
  }

  const options2: IsURLOptions = {
    require_protocol: false,
    protocols: ['http', 'https', 'ftp'],
    allowDecodedUrls: false,
  }

  it('Should accept valid URLs', () => {
    let value: string;

    value = 'http://google.com';
    expect(isUrlConstraint(value, options)).toBe(true);

    value = 'https://google.com';
    expect(isUrlConstraint(value, options)).toBe(true);

    value = 'http://google.com/';
    expect(isUrlConstraint(value, options)).toBe(true);

    value = 'http://google.com/x';
    expect(isUrlConstraint(value, options)).toBe(true);

    value = 'http://google.com/x/y';
    expect(isUrlConstraint(value, options)).toBe(true);
  })

  it('Should accept fragments', () => {
    const value = 'http://google.com/x/y#z';
    expect(isUrlConstraint(value, options)).toBe(true);
  })

  it('Should accept query arguments', () => {
    const value = 'http://google.com/a-b?c';
    expect(isUrlConstraint(value, options)).toBe(true);
  });

  it('Should allow un-encoded URLs', () => {
    const value = 'http://google.com/a b c';
    expect(isUrlConstraint(value, options)).toBe(true);
    expect(isUrlConstraint(value, options2)).toBe(false);
  });

  it('Should reject non-strings', () => {
    const value = 1;
    expect(isUrlConstraint(value, options)).toBe(false);
  });

  it('Should reject empty strings', () => {
    const value = '';
    expect(isUrlConstraint(value, options)).toBe(false);
  });

  it('Should require protocols', () => {
    const value = 'ghcr.io/biosimulators/tellurium';
    expect(isUrlConstraint(value, options)).toBe(false);
    expect(isUrlConstraint(value, options2)).toBe(true);
  });

  it('Should require http or https protocol', () => {
    const value = 'ftp://ghcr.io/biosimulators/tellurium';
    expect(isUrlConstraint(value, options)).toBe(false);
    expect(isUrlConstraint(value, options2)).toBe(true);
  });
});
