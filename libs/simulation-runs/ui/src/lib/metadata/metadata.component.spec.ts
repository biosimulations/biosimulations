import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';

import { MetadataComponent } from './metadata.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MetadataComponent', () => {
  let component: MetadataComponent;
  let fixture: ComponentFixture<MetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetadataComponent],
      imports: [BiosimulationsIconsModule, SharedUiModule, MarkdownModule.forRoot(), NoopAnimationsModule],
      providers: [MarkdownService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
