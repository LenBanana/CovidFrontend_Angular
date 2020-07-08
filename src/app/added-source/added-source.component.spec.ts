import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedSourceComponent } from './added-source.component';

describe('AddedSourceComponent', () => {
  let component: AddedSourceComponent;
  let fixture: ComponentFixture<AddedSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
