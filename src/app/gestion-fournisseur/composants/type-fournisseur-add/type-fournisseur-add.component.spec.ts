import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFournisseurAddComponent } from './type-fournisseur-add.component';

describe('TypeFournisseurAddComponent', () => {
  let component: TypeFournisseurAddComponent;
  let fixture: ComponentFixture<TypeFournisseurAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeFournisseurAddComponent]
    });
    fixture = TestBed.createComponent(TypeFournisseurAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
