import { OmexFile } from './omex-file';
import { Buffer } from 'buffer';

describe('OmexFile', () => {
  it('should be defined', () => {
    // tslint:disable-next-line: deprecation
    expect(new OmexFile('', new Buffer(''))).toBeDefined();
  });
});
