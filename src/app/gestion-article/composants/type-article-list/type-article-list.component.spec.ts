import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeArticleListComponent } from './type-article-list.component';

describe('TypeArticleListComponent', () => {
  let component: TypeArticleListComponent;
  let fixture: ComponentFixture<TypeArticleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeArticleListComponent]
    });
    fixture = TestBed.createComponent(TypeArticleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
