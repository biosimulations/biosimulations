import { FormatService } from './format.service';

describe('FormatService', () => {
  let service: FormatService;
  it('should', () => {
    expect(FormatService.formatDuration(60)).toBe('1 m');
    expect(FormatService.formatDuration(61)).toBe('1.0 m');

    expect(FormatService.formatDigitalSize(1000)).toBe('1 KB');
    expect(FormatService.formatDigitalSize(1024 ** 2, 1024)).toBe('1 MB');
    expect(FormatService.formatDigitalSize(1024)).toBe('1.024 KB');
  });
});
