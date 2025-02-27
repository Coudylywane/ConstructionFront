import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenererPlanningComponent } from './generer-planning.component';

describe('GenererPlanningComponent', () => {
  let component: GenererPlanningComponent;
  let fixture: ComponentFixture<GenererPlanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenererPlanningComponent]
    });
    fixture = TestBed.createComponent(GenererPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
