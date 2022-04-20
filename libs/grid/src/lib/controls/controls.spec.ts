import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridControlsComponent } from './controls.component';

describe('GridControlsComponent', () => {
  let component: GridControlsComponent;
  let fixture: ComponentFixture<GridControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridControlsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
