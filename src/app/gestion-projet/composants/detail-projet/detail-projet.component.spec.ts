import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjetComponent } from './detail-projet.component';

describe('DetailProjetComponent', () => {
  let component: DetailProjetComponent;
  let fixture: ComponentFixture<DetailProjetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailProjetComponent]
    });
    fixture = TestBed.createComponent(DetailProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
