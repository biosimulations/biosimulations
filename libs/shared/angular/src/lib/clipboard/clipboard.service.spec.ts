import { ClipboardService } from './clipboard.service';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACK_BAR_DURATION } from '@biosimulations/config/common';

class MockSnackBar {
  open = jest.fn();
}

describe('ClipboardService', () => {
  let service: ClipboardService;
  let mockSnackBar = new MockSnackBar();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClipboardService, { provide: MatSnackBar, useValue: mockSnackBar }],
    });
    service = TestBed.inject(ClipboardService);
  });

  it('should post notification', () => {
    expect(service).toBeDefined();
    service.copyToClipboard('test1', 'test2');
    expect(mockSnackBar.open).toHaveBeenCalledWith('test2', undefined, {
      duration: SNACK_BAR_DURATION,
    });
  });
});
