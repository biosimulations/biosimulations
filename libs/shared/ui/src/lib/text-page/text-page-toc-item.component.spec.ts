import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TextPageTocItemComponent } from './text-page-toc-item.component';
import { ScrollService } from '@biosimulations/shared/angular';

describe('TextPageTocItemComponent', () => {
  let component: TextPageTocItemComponent;
  let fixture: ComponentFixture<TextPageTocItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPageTocItemComponent],
      imports: [RouterTestingModule],
      providers: [ScrollService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPageTocItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
