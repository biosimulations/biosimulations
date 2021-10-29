import { IsOntologyTermConstraint } from './isOntologyTerm';
import { Ontologies } from '@biosimulations/datamodel/common';

describe('isOntologyTerm', () => {
  it('Should Accept valid URLs', () => {
    const value = 'KISAO_0000019';
    const args = {
      constraints: [Ontologies.KISAO],
      value: value,
      targetName: '',
      object: {},
      property: 'term',
    }
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(true);
  });

  it('Should reject non-strings', () => {
    const value = 19;
    const args = {
      constraints: [Ontologies.KISAO],
      value: value,
      targetName: '',
      object: {},
      property: 'term',
    }
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(false);
  });

  it('Should reject invalid ids', () => {
    let value = 'KISAO:0000019';
    const args = {
      constraints: [Ontologies.KISAO],
      value: value,
      targetName: '',
      object: {},
      property: 'term',
    }
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(false);

    value = 'KISAO_19';
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(false);

    value = '0000019';
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(false);

    value = '19';
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(false);
  });
});
