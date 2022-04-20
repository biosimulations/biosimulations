import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStranglerComponent } from './table-strangler.component';

describe('TableStranglerComponent', () => {
  let component: TableStranglerComponent;
  let fixture: ComponentFixture<TableStranglerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableStranglerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableStranglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
