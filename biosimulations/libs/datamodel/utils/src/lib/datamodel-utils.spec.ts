import { getFileExtension } from './datamodel-utils';
describe('File Extension', () => {
  it('should give file entension', () => {
    expect(getFileExtension('Test.txt')).toEqual('txt');
  });
});
