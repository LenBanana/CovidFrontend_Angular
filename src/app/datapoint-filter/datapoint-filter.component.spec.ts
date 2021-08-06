import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatapointFilterComponent } from './datapoint-filter.component';

describe('DatapointFilterComponent', () => {
  let component: DatapointFilterComponent;
  let fixture: ComponentFixture<DatapointFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatapointFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatapointFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
