import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonFormComponent } from './taxon-form.component';

describe('TaxonFormComponent', () => {
  let component: TaxonFormComponent;
  let fixture: ComponentFixture<TaxonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
