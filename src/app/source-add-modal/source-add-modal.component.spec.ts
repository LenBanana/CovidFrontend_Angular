import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAddModalComponent } from './source-add-modal.component';

describe('SourceAddModalComponent', () => {
  let component: SourceAddModalComponent;
  let fixture: ComponentFixture<SourceAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
