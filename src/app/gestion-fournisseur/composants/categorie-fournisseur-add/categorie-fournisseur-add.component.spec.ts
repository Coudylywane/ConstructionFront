import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieFournisseurAddComponent } from './categorie-fournisseur-add.component';

describe('CategorieFournisseurAddComponent', () => {
  let component: CategorieFournisseurAddComponent;
  let fixture: ComponentFixture<CategorieFournisseurAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieFournisseurAddComponent]
    });
    fixture = TestBed.createComponent(CategorieFournisseurAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
