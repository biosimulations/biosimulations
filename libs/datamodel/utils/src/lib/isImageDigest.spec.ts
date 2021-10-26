import { IsImageDigestConstraint } from './isImageDigest';

describe('isImageDigest', () => {
  it('Should Accept valid digests', () => {
    const value =
      'sha256:1234567890123456789012345678901234567890123456789012345678901234';
    expect(new IsImageDigestConstraint().validate(value)).toBe(true);
  });

  it('Should reject invalid digests', () => {
    const value =
      'sha256:1234567890abcdef1234567890abcdef1234567890cdef1234567890abcdef';
    expect(new IsImageDigestConstraint().validate(value)).toBe(false);
  });

  it('Should reject digest without prefix', () => {
    const value =
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    expect(new IsImageDigestConstraint().validate(value)).toBe(false);
  });
});
