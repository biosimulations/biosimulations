import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPageSectionComponent } from './summary-page-section.component';

describe('SummaryPageSectionComponent', () => {
  let component: SummaryPageSectionComponent;
  let fixture: ComponentFixture<SummaryPageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryPageSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
