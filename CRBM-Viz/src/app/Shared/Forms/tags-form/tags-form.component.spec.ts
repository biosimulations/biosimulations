import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsFormComponent } from './tags-form.component';

describe('TagsFormComponent', () => {
  let component: TagsFormComponent;
  let fixture: ComponentFixture<TagsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
