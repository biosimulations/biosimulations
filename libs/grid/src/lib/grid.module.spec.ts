import { async, TestBed } from '@angular/core/testing';
import { GridModule } from './grid.module';

describe('GridModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GridModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(GridModule).toBeDefined();
  });
});
