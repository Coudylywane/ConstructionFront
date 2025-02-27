import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenererDevisComponent } from './generer-devis.component';

describe('GenererDevisComponent', () => {
  let component: GenererDevisComponent;
  let fixture: ComponentFixture<GenererDevisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenererDevisComponent]
    });
    fixture = TestBed.createComponent(GenererDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
