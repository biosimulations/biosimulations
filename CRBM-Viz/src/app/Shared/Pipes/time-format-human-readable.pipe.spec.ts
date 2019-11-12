import { TimeFormatHumanReadablePipe } from './time-format-human-readable.pipe';

describe('TimeFormatHumanReadablePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeFormatHumanReadablePipe();
    expect(pipe).toBeTruthy();
  });
});
