import { TestBed } from '@angular/core/testing';

import { ZoneStockService } from './zone-stock.service';

describe('ZoneStockService', () => {
  let service: ZoneStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
