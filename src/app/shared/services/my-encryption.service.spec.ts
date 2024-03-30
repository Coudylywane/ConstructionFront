import { TestBed } from '@angular/core/testing';

import { MyEncryptionService } from './my-encryption.service';

describe('MyEncryptionService', () => {
  let service: MyEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
