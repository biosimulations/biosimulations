import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroBannerUtilButtonComponent } from './hero-banner-util-button.component';

describe('HeroBannerUtilButtonComponent', () => {
  let component: HeroBannerUtilButtonComponent;
  let fixture: ComponentFixture<HeroBannerUtilButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroBannerUtilButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroBannerUtilButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
