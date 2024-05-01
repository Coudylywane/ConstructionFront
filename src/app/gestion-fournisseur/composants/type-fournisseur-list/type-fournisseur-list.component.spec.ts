import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFournisseurListComponent } from './type-fournisseur-list.component';

describe('TypeFournisseurListComponent', () => {
  let component: TypeFournisseurListComponent;
  let fixture: ComponentFixture<TypeFournisseurListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeFournisseurListComponent]
    });
    fixture = TestBed.createComponent(TypeFournisseurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
