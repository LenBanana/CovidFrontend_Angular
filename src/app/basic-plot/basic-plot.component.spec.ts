import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicPlotComponent } from './basic-plot.component';

describe('BasicPlotComponent', () => {
  let component: BasicPlotComponent;
  let fixture: ComponentFixture<BasicPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
