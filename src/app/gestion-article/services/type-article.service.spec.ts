import { TestBed } from '@angular/core/testing';

import { TypeArticleService } from './type-article.service';

describe('TypeArticleService', () => {
  let service: TypeArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
