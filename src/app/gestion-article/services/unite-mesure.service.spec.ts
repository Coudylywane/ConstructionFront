import { TestBed } from '@angular/core/testing';

import { UniteMesureService } from './unite-mesure.service';

describe('UniteMesureService', () => {
  let service: UniteMesureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniteMesureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
