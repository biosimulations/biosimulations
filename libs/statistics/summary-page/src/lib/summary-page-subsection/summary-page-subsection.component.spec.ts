import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPageSubsectionComponent } from './summary-page-subsection.component';

describe('SummaryPageSubsectionComponent', () => {
  let component: SummaryPageSubsectionComponent;
  let fixture: ComponentFixture<SummaryPageSubsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryPageSubsectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPageSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
