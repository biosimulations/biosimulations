import { IsHexidecimalColorConstraint } from './isHexidecimalColor';

describe('isHexidecimalColor', () => {
  it('Should accept valid colors', () => {
    expect(new IsHexidecimalColorConstraint().validate('00FF00')).toBe(true);
    expect(new IsHexidecimalColorConstraint().validate('00ff00')).toBe(true);
    expect(new IsHexidecimalColorConstraint().validate('00ff00CC')).toBe(true);
    expect(new IsHexidecimalColorConstraint().validate('00ff00cc')).toBe(true);
  });

  it('Should reject non-strings', () => {
    const value = 1;
    expect(new IsHexidecimalColorConstraint().validate(value)).toBe(false);
  });

  it('Should reject empty strings', () => {
    const value = '';
    expect(new IsHexidecimalColorConstraint().validate(value)).toBe(false);
  });

  it('Should reject short strings', () => {
    const value = '00FF';
    expect(new IsHexidecimalColorConstraint().validate(value)).toBe(false);
  });

  it('Should reject 7-digit strings', () => {
    const value = '00FFFF8';
    expect(new IsHexidecimalColorConstraint().validate(value)).toBe(false);
  });

  it('Should reject long strings', () => {
    const value = '00FF00FF9';
    expect(new IsHexidecimalColorConstraint().validate(value)).toBe(false);
  });

  it('Should reject non-hexidecimal characters', () => {
    const value = '00GG00';
    expect(new IsHexidecimalColorConstraint().validate(value)).toBe(false);
  });
});
