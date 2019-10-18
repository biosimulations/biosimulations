import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatTableModule,
} from '@angular/material';
import { FileTableComponent } from './file-table.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileTableComponent', () => {
  let component: FileTableComponent;
  let fixture: ComponentFixture<FileTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTableModule, HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
