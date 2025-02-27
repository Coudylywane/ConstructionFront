import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTacheComponent } from './add-tache.component';

describe('AddTacheComponent', () => {
  let component: AddTacheComponent;
  let fixture: ComponentFixture<AddTacheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTacheComponent]
    });
    fixture = TestBed.createComponent(AddTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
