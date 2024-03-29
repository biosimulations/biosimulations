import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedComponent } from './featured.component';
import { FeaturedService } from './featured.service';
import { HomeModule } from '../home.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FeaturedComponent', () => {
  let component: FeaturedComponent;
  let fixture: ComponentFixture<FeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [FeaturedComponent],
      providers: [FeaturedService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
