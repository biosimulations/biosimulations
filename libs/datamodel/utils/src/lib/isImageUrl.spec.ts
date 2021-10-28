import { IsImageUrlConstraint } from './isImageUrl';

describe('isImageUrl', () => {
  it('Should Accept valid URLs', () => {
    const value =
      'ghcr.io/biosimulators/tellurium:2.2.1';
    expect(new IsImageUrlConstraint().validate(value)).toBe(true);
  });

  it('Should reject non-strings', () => {
    const value = 1;
    expect(new IsImageUrlConstraint().validate(value)).toBe(false);
  })

  it('Should reject empty strings', () => {
    const value = '';
    expect(new IsImageUrlConstraint().validate(value)).toBe(false);
  })

  it('Should reject protocols', () => {
    const value =
      'http://ghcr.io/biosimulators/tellurium:2.2.1';
    expect(new IsImageUrlConstraint().validate(value)).toBe(false);
  })

  it('Should reject no tags', () => {
    const value =
      'ghcr.io/biosimulators/tellurium';
    expect(new IsImageUrlConstraint().validate(value)).toBe(false);
  })

  it('Should reject latest tag', () => {
    const value =
      'ghcr.io/biosimulators/tellurium:latest';
    expect(new IsImageUrlConstraint().validate(value)).toBe(false);})

  it('Should reject invalid tags', () => {
    const value =
      'ghcr.io/biosimulators/tellurium:bad@tag';
    expect(new IsImageUrlConstraint().validate(value)).toBe(false);
  });
});
