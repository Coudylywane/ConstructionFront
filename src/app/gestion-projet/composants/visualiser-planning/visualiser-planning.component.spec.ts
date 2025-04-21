import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserPlanningComponent } from './visualiser-planning.component';

describe('VisualiserPlanningComponent', () => {
  let component: VisualiserPlanningComponent;
  let fixture: ComponentFixture<VisualiserPlanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualiserPlanningComponent]
    });
    fixture = TestBed.createComponent(VisualiserPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
