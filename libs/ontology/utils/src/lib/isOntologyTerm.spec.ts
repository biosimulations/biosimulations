import { IsOntologyTermConstraint } from './isOntologyTerm';
import { Ontologies } from '@biosimulations/datamodel/common';

describe('isOntologyTerm', () => {
  it('Should accept valid ids', () => {
    const value = 'KISAO_0000019';
    const args = {
      constraints: [Ontologies.KISAO, undefined],
      value: value,
      targetName: '',
      object: {},
      property: 'term',
    }
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(true);
  });

  it('Should accept valid immediate parents', () => {
    const value = 'KISAO_0000019';
    const args = {
      constraints: [Ontologies.KISAO, 'KISAO_0000433'],
      value: value,
      targetName: '',
      object: {},
      property: 'term',
    }
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(true);
  });

  it('Should accept valid parents', () => {
    const value = 'KISAO_0000019';
    const args = {
      constraints: [Ontologies.KISAO, 'KISAO_0000000'],
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
      constraints: [Ontologies.KISAO, undefined],
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
      constraints: [Ontologies.KISAO, undefined],
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

  it('Should accept reject invalid parents', () => {
    const value = 'KISAO_0000019';
    const args = {
      constraints: [Ontologies.KISAO, 'KISAO_0000201'],
      value: value,
      targetName: '',
      object: {},
      property: 'term',
    }
    expect(new IsOntologyTermConstraint().validate(value, args)).toBe(false);
  });
});
