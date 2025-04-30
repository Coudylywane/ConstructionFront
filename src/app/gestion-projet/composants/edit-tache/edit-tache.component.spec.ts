import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTacheComponent } from './edit-tache.component';

describe('EditTacheComponent', () => {
  let component: EditTacheComponent;
  let fixture: ComponentFixture<EditTacheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTacheComponent]
    });
    fixture = TestBed.createComponent(EditTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
