import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteMesureAddComponent } from './unite-mesure-add.component';

describe('UniteMesureAddComponent', () => {
  let component: UniteMesureAddComponent;
  let fixture: ComponentFixture<UniteMesureAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniteMesureAddComponent]
    });
    fixture = TestBed.createComponent(UniteMesureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
