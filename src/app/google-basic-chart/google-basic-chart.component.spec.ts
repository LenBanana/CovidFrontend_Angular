import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleBasicChartComponent } from './google-basic-chart.component';

describe('GoogleBasicChartComponent', () => {
  let component: GoogleBasicChartComponent;
  let fixture: ComponentFixture<GoogleBasicChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleBasicChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleBasicChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
