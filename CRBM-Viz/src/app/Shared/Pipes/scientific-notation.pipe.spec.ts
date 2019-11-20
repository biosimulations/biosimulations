import { ScientificNotationPipe } from './scientific-notation.pipe';

describe('ScientificNotationPipe', () => {
  it('create an instance', () => {
    const pipe = new ScientificNotationPipe();
    expect(pipe).toBeTruthy();
  });

  it('format a number', () => {
    const pipe = new ScientificNotationPipe();
    expect(pipe.transform(0)).toEqual('0.000');
    expect(pipe.transform(10.1)).toEqual('10.100');
    expect(pipe.transform(10.001)).toEqual('10.001');
    expect(pipe.transform(10.0001)).toEqual('10.000');
    expect(pipe.transform(-10.1)).toEqual('-10.100');
    expect(pipe.transform(-10.001)).toEqual('-10.001');
    expect(pipe.transform(-10.0001)).toEqual('-10.000');
    expect(pipe.transform(1.1e3)).toEqual('1.100 × 10<sup>3</sup>');
    expect(pipe.transform(-1.1e3)).toEqual('-1.100 × 10<sup>3</sup>');
    expect(pipe.transform(1.1e-4)).toEqual('1.100 × 10<sup>-4</sup>');
    expect(pipe.transform(-1.1e-4)).toEqual('-1.100 × 10<sup>-4</sup>');
  });
});
