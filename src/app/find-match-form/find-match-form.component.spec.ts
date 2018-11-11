import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMatchFormComponent } from './find-match-form.component';

describe('FindMatchFormComponent', () => {
  let component: FindMatchFormComponent;
  let fixture: ComponentFixture<FindMatchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindMatchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
