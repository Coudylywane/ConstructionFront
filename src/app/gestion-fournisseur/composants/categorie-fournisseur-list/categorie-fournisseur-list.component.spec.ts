import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieFournisseurListComponent } from './categorie-fournisseur-list.component';

describe('CategorieFournisseurListComponent', () => {
  let component: CategorieFournisseurListComponent;
  let fixture: ComponentFixture<CategorieFournisseurListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieFournisseurListComponent]
    });
    fixture = TestBed.createComponent(CategorieFournisseurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
