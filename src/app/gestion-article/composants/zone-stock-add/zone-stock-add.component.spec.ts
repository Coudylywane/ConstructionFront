import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneStockAddComponent } from './zone-stock-add.component';

describe('ZoneStockAddComponent', () => {
  let component: ZoneStockAddComponent;
  let fixture: ComponentFixture<ZoneStockAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoneStockAddComponent]
    });
    fixture = TestBed.createComponent(ZoneStockAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
