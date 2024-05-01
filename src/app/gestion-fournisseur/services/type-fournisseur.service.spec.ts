import { TestBed } from '@angular/core/testing';

import { TypeFournisseurService } from './type-fournisseur.service';

describe('TypeFournisseurService', () => {
  let service: TypeFournisseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeFournisseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
