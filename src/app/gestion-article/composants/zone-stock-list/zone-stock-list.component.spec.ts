import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneStockListComponent } from './zone-stock-list.component';

describe('ZoneStockListComponent', () => {
  let component: ZoneStockListComponent;
  let fixture: ComponentFixture<ZoneStockListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoneStockListComponent]
    });
    fixture = TestBed.createComponent(ZoneStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
