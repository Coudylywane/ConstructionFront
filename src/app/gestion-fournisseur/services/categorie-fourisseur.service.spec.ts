import { TestBed } from '@angular/core/testing';

import { CategorieFourisseurService } from './categorie-fourisseur.service';

describe('CategorieFourisseurService', () => {
  let service: CategorieFourisseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieFourisseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
